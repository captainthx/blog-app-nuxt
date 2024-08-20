<script setup lang="ts">
import { AxiosError } from "axios";
import { faveritePost } from "~/service/favoritePost";
import { getFile } from "~/service/file";
import { getPostByid, likePost } from "~/service/post";
import { useAuthStore } from "~/store/authStore";
import { useProfileStore } from "~/store/profileStore";
import type { PostResponse } from "~/types";

useHead({
  title: "Blog",
  meta: [
    {
      name: "description",
      content: "Blog detail page",
    },
  ],
});

const route = useRoute();
const authStore = useAuthStore();
const { profile } = useProfileStore();
const postId = route.params.id;
const blog = ref<PostResponse | null>(null);
const toast = useToast();
const isComment = ref<boolean>(false);
const avatarImage = ref<string>("");

const openCommentfield = () => {
  isComment.value = !isComment.value;
};

const loadData = async () => {
  try {
    const res = await getPostByid(Number(postId));
    if (res.status === 200 && res.data.result) {
      blog.value = res.data.result;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      console.log("error ", responseData.message);
    }
  }
};

const isLiked = computed(() => {
  if (!blog.value || !blog.value.postLikes || !authStore.payload) {
    return false;
  }
  const result = blog.value.postLikes.some((like) => {
    const likeAccountId = like.id;
    return likeAccountId === authStore.payload?.auth;
  });

  return result;
});

const isFavorite = computed(() => {
  if (!blog.value || !blog.value.favoritesPosts || !authStore.payload) {
    return false;
  }
  const result = blog.value.favoritesPosts.some((fav) => {
    const favoriteAccountId = fav.id;
    return favoriteAccountId === authStore.payload?.auth;
  });
  return result;
});

const handlelike = async () => {
  try {
    const res = await likePost(Number(postId));
    if (res.status === 200 && res.data.code === 200) {
      showToastSuccess("You liked this post", res.data.message);

      await loadData();
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      handleAxiosError("like post failed", error);
    }
  }
};

const handleFavoritePost = async () => {
  try {
    const res = await faveritePost({ postId: Number(postId) });
    if (res.status === 200 && res.data.code === 200) {
      showToastSuccess("You favorite this post", res.data.message);
      await loadData();
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      handleAxiosError("favorite post failed", error);
    }
  }
};

const getAvatarImage = async () => {
  try {
    if (profile) {
      const res = await getFile(profile.avatar);
      if (res.status === 200 && res.data) {
        avatarImage.value = URL.createObjectURL(res.data);
      }
    }
  } catch (error) {}
};

onMounted(async () => {
  await loadData();
  if (blog.value && blog.value.author) {
    await getAvatarImage();
  }
});
</script>

<template>
  <div class="flex flex-col gap-4 w-full" v-if="blog">
    <h1 class="text-3xl font-semibold text-center">{{ blog.title }}</h1>
    <div class="flex flex-rows justify-between items-center align-middle p-2">
      <div class="flex flex-col">
        <div class="flex justify-start gap-5 items-center align-middle">
          <UAvatar
            :src="
              avatarImage
                ? avatarImage
                : 'https://avatars.githubusercontent.com/u/739984?v=4'
            "
          />
          <div>{{ blog.author ? blog.author.name : "Init post" }}</div>
        </div>
        <div class="mt-2 p-1">
          <p>{{ formatDate(blog.cdt) }}</p>
        </div>
      </div>
      <div>
        <UButton
          :disabled="isLiked"
          color="white"
          class="text-red-500"
          variant="ghost"
          :icon="isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
          @click="handlelike"
          >{{ blog.likeCount }}</UButton
        >

        <UButton
          color="blue"
          variant="ghost"
          icon="i-heroicons-chat-bubble-bottom-center-text"
          @click="openCommentfield"
        />

        <UButton
          :disabled="isFavorite"
          color="white"
          variant="ghost"
          class="text-yellow-500"
          :icon="
            isFavorite
              ? 'i-heroicons-bookmark-20-solid'
              : 'i-heroicons-bookmark'
          "
          @click="handleFavoritePost"
        />
      </div>
    </div>
    <div>
      <UCard class="h-[50dvh] overflow-auto text-pretty">
        <div v-html="blog.content"></div>
      </UCard>
    </div>
    <ClientOnly>
      <USlideover v-model="isComment">
        <AComment :post-id="blog.id" :open-comment="isComment" />
      </USlideover>
    </ClientOnly>
  </div>
</template>
