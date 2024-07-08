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

// const isLiked = computed(() => {
//   if (blog.value?.postLikes === null) {
//     return false;
//   }
//   return blog.value?.postLikes.find(
//     (like) => like.id === authStore.userProfile?.id
//   );
// });
// console.log("postLike", blog.value?.postLikes);
await loadData();
</script>

<template>
  <div class="flex flex-col gap-4 w-full" v-if="blog">
    {{ blog.postLikes }}
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
              class="text-red-500"
              variant="ghost"
              name="i-heroicons-heart"
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
