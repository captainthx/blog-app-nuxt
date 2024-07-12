<script setup lang="ts">
import { AxiosError } from "axios";
import { commentPost } from "~/service/comment";
import type { CommentPostRequest, PostResponse } from "~/types";

const props = defineProps({
  data: {
    type: Object as PropType<PostResponse>,
  },
  openComment: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["updateComment", "openComment"]);
const toast = useToast();
const commentRequest = reactive<CommentPostRequest>({
  postId: props.data?.id || 0,
  comment: "",
});

const handleComment = async () => {
  try {
    if (commentRequest.comment.length < 1) {
      toast.add({
        title: "Comment post failed",
        description: "comment is empty",
        color: "red",
        timeout: 3000,
      });
      return;
    }
    const res = await commentPost(commentRequest);
    if (res.status === 200 && res.data.message === "success") {
      toast.add({
        title: "You comment this post",
        description: res.data.message,
        color: "green",
        timeout: 3000,
      });
      emit("updateComment", res.data.message);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      console.log("error ", responseData.message);
      toast.add({
        title: "Comment post failed",
        description: responseData.message,
        color: "red",
        timeout: 3000,
      });
    }
  }
};
const updateComment = (value: string) => {
  commentRequest.comment = value;
};
</script>

<template>
  <div class="p-3">
    <ATiptapEditor
      :value="commentRequest.comment"
      @update:value="updateComment"
    />
    <div class="flex justify-end mt-2">
      <UButton @click="handleComment">Comment</UButton>
    </div>

    <div class="max-h-[50dvh] overflow-y-auto">
      <div v-for="comment in props.data?.comments" :key="comment.id">
        <div class="flex flex-col gap-2 mb-4">
          <div class="flex justify-start gap-2 items-center">
            <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />
            <div class="ml-1 text-pretty font-medium">
              {{ comment.account.name }}
            </div>
          </div>
          <div v-html="comment.comment"></div>
          <UDivider class="mb-2 w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-container {
  max-height: 60vh;
  min-height: 200px;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .comments-container {
    max-height: 70vh;
  }
}

@media (min-width: 1024px) {
  .comments-container {
    max-height: 80vh;
  }
}
</style>
