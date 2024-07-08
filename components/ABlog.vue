<script setup lang="ts">
import type { PostResponse } from "~/types";
import { formatDate } from "#imports";
defineProps({
  blog: Object as PropType<PostResponse>,
});

const randomColor = () => {
  const colors = ["red", "yellow", "green", "blue", "indigo", "purple", "pink"];
  return colors[Math.floor(Math.random() * colors.length)];
};
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-lg" v-if="blog">
    <!-- <img
      src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
      class="aspect-video w-full object-cover"
      alt=""
    /> -->
    <div class="p-4">
      <p class="mb-1 text-sm text-green-500">
        <span> {{ blog.author.username.toUpperCase() }}</span>
        : {{ formatDate(blog.cdt) }}
      </p>
      <!-- title -->
      <h3 class="text-xl font-medium text-gray-900">
        {{ blog.title }}
      </h3>
      <!--content-->
      <p class="mt-1 text-gray-500 truncate">
        {{ blog.content }}
      </p>
      <div class="flex justify-end mt-4">
        <ULink
          :to="`/blog/${blog.id}`"
          active-class="text-primary"
          inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >read more</ULink
        >
      </div>
      <!-- tag-->
      <ClientOnly>
        <div class="mt-4 flex gap-2">
          <span
            v-for="tag in blog.tags"
            :key="tag"
            :class="`inline-flex items-center gap-1 rounded-full bg-${randomColor()}-50 px-2 py-1 text-base font-semibold text-${randomColor()}-600`"
            >{{ tag }}</span
          >
        </div>
      </ClientOnly>
    </div>
  </div>
  <div v-else class="text-center">Not Found!</div>
</template>

<style scoped></style>
