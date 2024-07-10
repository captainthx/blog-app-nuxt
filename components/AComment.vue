<script setup lang="ts">
import type { CommentResponse } from "~/types";

const props = defineProps({
  commentsData: {
    type: Array as PropType<CommentResponse[]>,
  },
  openComment: {
    type: Boolean,
    default: false,
  },
});
const update = (value: string) => {
  console.log("editor value", value);
};

const comment = ref<string>("");
</script>

<template>
  <div>
    <UCard v-for="comment in commentsData" :key="comment.id" v-show="comment">
      <div class="flex flex-rows just-stretch gap-5 mb-5">
        <UAvatar alt="Avatar" :src="comment.account.avatar"></UAvatar>
        <UInput
          v-model="comment.comment"
          class="w-5/6"
          variant="none"
          disabled
        />
      </div>
    </UCard>
    <UCard v-show="!commentsData">
      <div class="flex flex-rows just-stretch gap-5 mb-5">
        <UInput
          class="w-5/6"
          variant="none"
          disabled
          placeholder=" no have comment..."
        />
      </div>
    </UCard>
    <div class="mt-5 mb-10 flex justify-between" v-show="openComment">
      <div class="w-full">
        <div class="mb-16 h-52">
          <ATiptapEditor :value="comment" @update:value="update" />
          <!-- <UTextarea autoresize size="xl" placeholder="comment ..." /> -->
        </div>
        <div class="flex justify-end">
          <UButton>Send</UButton>
        </div>
      </div>
    </div>
  </div>
</template>
