<script setup lang="ts">
import { AxiosError } from "axios";
import { commentPost, getCommentByPostId } from "~/service/comment";
import type { CommentPostRequest, CommentResponse } from "~/types";

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
  openComment: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["updateComment", "openComment"]);
const commentRequest = reactive<CommentPostRequest>({
  postId: props.postId,
  comment: "",
});
const commentData = ref<CommentResponse[] | null>(null);

const handleComment = async () => {
  try {
    if (commentRequest.comment.length < 1) {
      showToastError("Comment post failed", "comment is empty");
      return;
    }
    const res = await commentPost(commentRequest);
    if (res.status === 200 && res.data.message === "success") {
      showToastSuccess("Comment post success", "You comment this post");
      // reset comment
      commentRequest.comment = "";
      await loadComment();
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      handleAxiosError("Comment post failed", error);
    }
  }
};
const updateComment = (value: string) => {
  commentRequest.comment = value;
};

const loadComment = async () => {
  try {
    const res = await getCommentByPostId(props.postId);
    if (res.status === 200 && res.data.result) {
      commentData.value = res.data.result;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      handleAxiosError("Get comment failed", error);
    }
  }
};

onBeforeMount(async () => {
  if (props.postId) {
    await loadComment();
  }
});
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
      <div v-for="comment in commentData" :key="comment.cdt">
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
    <div
      class="text-center opacity-50"
      v-if="!commentData || commentData.length === 0"
    >
      <p>be the first to comment</p>
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
