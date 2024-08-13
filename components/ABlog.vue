<script setup lang="ts">
import type { PostResponse } from "~/types";
import { formatDate } from "#imports";
import { AxiosError } from "axios";
import { getFile } from "~/service/file";
const props = defineProps({
  blog: Object as PropType<PostResponse>,
});

const postImage = ref<string>("");
const defaultImage =
  "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80";

const randomColor = () => {
  const colors = ["red", "yellow", "green", "blue", "indigo", "purple", "pink"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getImage = async () => {
  try {
    if (props.blog) {
      const res = await getFile(props.blog.postImage);
      if (res.status === 200 && res.data) {
        postImage.value = URL.createObjectURL(res.data);
      }
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("error get image", error);
    }
  }
};

onBeforeMount(() => {
  getImage();
});
</script>

<template>
  <div
    class="overflow-hidden rounded-lg mt-5 cursor-pointer shadow-xl bg-white transition ease-in-out dark:bg-transparent dark:hover:bg-gray-800 hover:scale-105 hover:bg-gray-100 duration-200"
    v-if="blog"
    @click="$router.push(`/blog/${blog.id}`)"
  >
    <div class="flex justify-center">
      <NuxtImg
        class="w-[500px] h-[281px] aspect-video mt-2 p-2"
        :src="postImage ? postImage : defaultImage"
        alt="alt"
      />
    </div>
    <div class="p-4">
      <p class="mb-1 text-sm text-green-500">
        <span>
          {{
            blog.author ? blog.author.username.toUpperCase() : "Init post"
          }}</span
        >
        : {{ formatDate(blog.cdt) }}
      </p>
      <!-- title -->
      <h3 class="text-xl font-medium text-gray-600 dark:text-gray-300">
        {{ blog.title }}
      </h3>
      <!--content-->
      <p
        v-html="blog.content"
        class="mt-1 text-gray-500 truncate dark:text-gray-300"
      ></p>
      <div class="flex justify-end mt-5">
        <!-- <ULink
          :to="`/blog/${blog.id}`"
          active-class="text-primary"
          inactive-class="text-blue-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-blue-500"
          >read more</ULink
        > -->
      </div>
      <!-- tag-->
      <ClientOnly>
        <div
          class="flex flex-row items-center align-middle justify-between gap-2 mt-4"
        >
          <div>
            <span
              v-for="tag in blog.tags"
              :key="tag"
              :class="`inline-flex items-center   px-2 py-1 text-base font-semibold text-${randomColor()}-600`"
              >{{ tag }}</span
            >
          </div>
          <UButton
            class="text-red-500 hover:bg-inherit"
            icon="i-heroicons-heart-solid"
            variant="ghost"
            color="white"
          >
            {{ blog.likeCount }}
          </UButton>
        </div>
      </ClientOnly>
    </div>
  </div>
  <div v-else class="text-center">Not Found!</div>
</template>
<style scoped></style>
