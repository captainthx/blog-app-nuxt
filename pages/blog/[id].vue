<script setup lang="ts">
import { AxiosError } from "axios";
import { faveritePost } from "~/service/favoritePost";
import { getPostByid, likePost } from "~/service/post";
import { useAuthStore } from "~/store/authStore";
import type { PostResponse } from "~/types";

const route = useRoute();
const authStore = useAuthStore();
const postId = route.params.id;
const blog = ref<PostResponse | null>(null);
const toast = useToast();
const isComment = ref<boolean>(false);
const isOpen = ref<boolean>(false);

useHead({
  title: "Blog",
  meta: [
    {
      name: "description",
      content: "Blog detail page",
    },
  ],
});

const openCommentfield = () => {
  isComment.value = !isComment.value;
};
const commentStatus = ref<string>("");

const loadData = async () => {
  try {
    const res = await getPostByid(Number(postId));
    if (res.status === 200 && res.data.result) {
      blog.value = res.data.result;
    }
  } catch (error) {
    if (typeof error === "string") {
      console.log(error);
    } else if (error instanceof AxiosError) {
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
      console.log("response ", res.data);
      toast.add({
        title: "You liked this post",
        description: res.data.message,
        color: "green",
        timeout: 3000,
      });
      await loadData();
    }
  } catch (error) {
    if (typeof error === "string") {
      console.log("error like post ", error);
    } else if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      toast.add({
        title: "like post failed",
        description: responseData.message,
        color: "red",
        timeout: 3000,
      });
    }
  }
};

const handleFavoritePost = async () => {
  try {
    const res = await faveritePost({ postId: Number(postId) });
    if (res.status === 200 && res.data.code === 200) {
      toast.add({
        title: "You favorite this post",
        description: res.data.message,
        color: "green",
        timeout: 3000,
      });
      await loadData();
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      toast.add({
        title: "favorite post failed",
        description: responseData.message,
        color: "red",
        timeout: 3000,
      });
    }
  }
};

const updateCommet = (value: string) => {
  commentStatus.value = value;
};

watchEffect(() => {
  if (commentStatus.value === "success") {
    loadData();
  }
});
onMounted(async () => {
  await loadData();
});
</script>

<template>
  <div class="flex flex-col gap-4 w-full" v-if="blog">
    <h1 class="text-3xl font-semibold text-center">{{ blog.title }}</h1>
    <div class="flex flex-rows justify-between items-center align-middle p-2">
      <div class="flex flex-col">
        <div class="flex justify-start gap-5 items-center align-middle">
          <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />
          <div>{{ blog.author.name }}</div>
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
      <UCard>
        {{ blog?.content }}
        <template #footer> </template>
      </UCard>
    </div>
    <ClientOnly>
      <USlideover v-model="isComment">
        <AComment
          :data="blog"
          :open-comment="isComment"
          @update-comment="updateCommet"
        />
      </USlideover>
      <div v-if="!blog.comments" class="text-center">
        <p>no have comment...</p>
      </div>
    </ClientOnly>
  </div>
</template>
