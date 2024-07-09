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
  if (!blog.value || !blog.value.postLikes || !authStore.userProfile) {
    return false;
  }
  const result = blog.value.postLikes.some((like) => {
    const likeAccountId = like.account.id;
    return likeAccountId === authStore.userProfile?.id;
  });

  return result;
});

const isFavorite = computed(() => {
  if (!blog.value || !blog.value.favoritesPosts || !authStore.userProfile) {
    return false;
  }
  const result = blog.value.favoritesPosts.some((fav) => {
    const favoriteAccountId = fav.account.id;
    return favoriteAccountId === authStore.userProfile?.id;
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
    if (typeof error === "string") {
      console.log("error favorite post ", error);
    } else if (error instanceof AxiosError) {
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

await loadData();
</script>

<template>
  <div class="flex flex-col gap-4 w-full" v-if="blog">
    <h1 class="text-3xl font-semibold text-center">{{ blog.title }}</h1>
    <div>
      <UCard>
        <template #header>
          <div class="flex flex-rows gap-4 items-center">
            <UAvatar :src="blog.author.avatar" />
            {{ formatDate(blog.cdt) }}
          </div>
        </template>
        {{ blog.content }}
        <template #footer>
          <div class="flex justify-between">
            <UButton
              :disabled="isLiked"
              color="white"
              class="text-red-500"
              variant="ghost"
              :icon="isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
              @click="handlelike"
            />
            <UButton
              color="white"
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
        </template>
      </UCard>
    </div>
    <AComment :commentsData="blog.comments" :open-comment="isComment" />
  </div>
</template>

<style scoped></style>
