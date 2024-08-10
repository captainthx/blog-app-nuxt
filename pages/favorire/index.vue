<script setup lang="ts">
import { getFaveritePost } from "~/service/favoritePost";
import type { Pagination, FavoritePostResponse } from "~/types";
import { DefaultPagination } from "~/types/enum";

const favoritePosts = ref<FavoritePostResponse[] | null>(null);
const pagination = reactive<Pagination>({
  page: DefaultPagination.pages,
  size: DefaultPagination.limit,
});
const loadData = async () => {
  try {
    const res = await getFaveritePost(pagination);
    if (res.status === 200 && res.data.result) {
      console.log(res.data.result);
      favoritePosts.value = res.data.result;
    }
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  loadData();
});
</script>

<template>
  <h1 class="text-center font-semibold text-2xl text-pretty">favorite post</h1>
  <div class="w-full mx-auto p-5 mt-5">
    <div class="flex flex-col gap-5">
      <div
        class="h-36 mb-2 bg-gray-50 rounded-lg"
        v-for="fav in favoritePosts"
        :key="fav.id"
      >
        <div class="flex flex-col">
          <h2 class="flex justify-start pl-5 font-semibold">
            {{ fav.post.title }}
          </h2>
          <p
            v-html="fav.post.content"
            class="p-2 min-h-20 text-clip overflow-hidden"
          ></p>
          <div class="flex justify-end pr-2">
            <ULink
              :to="`/blog/${fav.post.id}`"
              active-class="text-primary"
              inactive-class="text-blue-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-blue-500"
              >read</ULink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
