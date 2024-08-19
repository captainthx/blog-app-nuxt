<script setup lang="ts">
import { getFile } from "~/service/file";
import type { PostFavoriteResponse } from "~/types";

const postImage = ref<string>("");
const defaultImage =
  "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80";
const props = defineProps({
  blog: Object as PropType<PostFavoriteResponse>,
});

const getPostImage = async () => {
  try {
    if (props.blog) {
      const res = await getFile(props.blog.postImage);
      postImage.value = URL.createObjectURL(res.data);
    }
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  getPostImage();
});
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-center font-semibold text-pretty">
        {{ blog?.title }}
      </h2>
    </template>
    <div class="flex flex-col">
      <NuxtImg
        class="w-[300px] h-[225px]"
        :src="postImage ? postImage : defaultImage"
        alt="image"
      />
      <UTooltip class="line-clamp-3 text-sm mt-5" :text="blog?.content">
        {{ blog?.content }}
      </UTooltip>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <ULink
          :to="`/blog/${blog?.id}`"
          active-class="text-primary"
          inactive-class="text-blue-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-blue-500"
          >read</ULink
        >
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
