<script setup lang="ts">
import { getFaveritePost } from "~/service/favoritePost";
import { getFile } from "~/service/file";
import type { Pagination, FavoritePostResponse } from "~/types";
import { DefaultPagination } from "~/types/enum";

const favoritePosts = ref<FavoritePostResponse[] | null>(null);

const query = reactive<Pagination>({
  page: DefaultPagination.pages,
  size: DefaultPagination.limit,
});
const pagination = reactive({
  currentPage: 0,
  pageCount: 0,
  totalPage: 0,
});

const loadData = async () => {
  try {
    const res = await getFaveritePost(query);
    if (res.status === 200 && res.data.result) {
      favoritePosts.value = res.data.result;
      pagination.pageCount = res.data.pagination.pages;
      pagination.totalPage = res.data.pagination.records;
    }
  } catch (error) {
    console.log(error);
  }
};
const handlePagination = async (page: number) => {
  query.page = page;
  await loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <h1 class="text-center font-semibold text-2xl text-pretty">favorite</h1>
  <div class="w-full mx-auto p-5 mt-5">
    <div class="grid grid-cols-4 gap-5">
      <div
        v-for="blog in favoritePosts"
        :key="blog.id"
        class="hover:shadow-lg hover:scale-105 transition-transform duration-300"
      >
        <MotionGroup preset="popVisibleOnce" :duration="600">
          <AFavoritePost :blog="blog.post" />
        </MotionGroup>
      </div>
    </div>
    <div class="flex justify-end">
      <UPagination
        v-model="pagination.currentPage"
        :total="pagination.totalPage"
        @click="handlePagination(pagination.currentPage)"
        show-last
        show-first
      />
    </div>
  </div>
</template>

<style scoped>
.transition-ease-in-out {
  transition: all 0.3s ease-in-out;
}
</style>
