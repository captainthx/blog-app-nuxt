<script setup lang="ts">
import { AxiosError } from "axios";
import { getPostByid } from "~/service/post";
import { useAuthStore } from "~/store/authStore";
import type { PostResponse } from "~/types";

const route = useRoute();
const authStore = useAuthStore();
const id = route.params.id;
const blog = ref<PostResponse | null>(null);
const toast = useToast();
const isComment = ref<boolean>(false);

const openCommentfield = () => {
  isComment.value = !isComment.value;
};

const loadData = async () => {
  try {
    const res = await getPostByid(Number(id));
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
    const likeAccountId = like.account?.id;
    console.log(
      `Comparing like.account.id: ${likeAccountId} (${typeof likeAccountId}) with userProfile.id: ${
        authStore.userProfile?.id
      } (${typeof authStore.userProfile?.id})`
    );
    return likeAccountId === authStore.userProfile?.id;
  });

  return result;
});

const handlelike = async () => {
  console.log("isLiked", isLiked.value);
  if (isLiked.value) {
    toast.add({
      title: "You already liked this post",
      description: "You can't like a post more than once",
      color: "red",
      timeout: 3000,
    });
  }
  // Call the like API
  toast.add({
    title: "You liked this post",
    description: "You can't like a post more than once",
    color: "green",
    timeout: 3000,
  });
};

await loadData();
</script>

<template>
  <div class="flex flex-col gap-4 w-full" v-if="blog">
    {{ isLiked }} {{ authStore.userProfile?.id }}
    <div>
      <UCard>
        <template #header>
          <UAvatar :src="blog.author.avatar" />
          {{ blog.title }}
        </template>

        {{ blog.content }}
        <template #footer>
          <div class="flex justify-between">
            <UIcon
              :class="isLiked ? 'text-red-500' : 'text-gray-500'"
              variant="ghost"
              :name="isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
              @click="handlelike"
            />
            <UButton
              color="white"
              variant="ghost"
              icon="i-heroicons-chat-bubble-bottom-center-text"
              @click="openCommentfield"
            />

            <UButton
              color="white"
              variant="ghost"
              icon="i-heroicons-bookmark"
            />
          </div>
        </template>
      </UCard>
    </div>
    <div>
      <UCard> show comment</UCard>
    </div>
    <div class="mt-5 mb-10 flex justify-between" v-show="isComment">
      <div class="w-full">
        <div class="mb-2">
          <UTextarea autoresize size="xl" />
        </div>
        <div class="flex justify-end">
          <UButton>Send</UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
