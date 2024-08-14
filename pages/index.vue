div
<script setup lang="ts">
import { AxiosError } from "axios";
import ASpinner from "~/components/ASpinner.vue";
import { getpostList } from "~/service/post";
import type { PostResponse, PostRequest } from "~/types";
import { DefaultPagination } from "~/types/enum";

const queryPost = ref<PostRequest>({
  page: DefaultPagination.pages,
  size: DefaultPagination.limit,
});
const pagination = reactive({
  currentPage: 1,
  pageCount: 0,
  totalPage: 0,
});
const isLoading = ref<boolean>(false);
const postList = ref<PostResponse[] | null>(null);

const loadData = async () => {
  isLoading.value = true;
  try {
    const res = await getpostList(queryPost.value);
    if (res.status === 200 && res.data.result) {
      postList.value = res.data.result;
      pagination.pageCount = res.data.pagination.pages;
      pagination.totalPage = res.data.pagination.records;
    }
  } catch (error) {
    isLoading.value = false;
    if (error instanceof AxiosError) {
      console.log("error get post", error);
      handleAxiosError("Load post failed", error);
    }
  } finally {
    isLoading.value = false;
  }
};
const handlePagination = async (page: number) => {
  queryPost.value.page = page;
  await loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <ASpinner v-if="isLoading" />
  <div class="flex flex-col gap-5">
    <p class="text-pretty font-semibold text-2xl" v-if="postList">All Post</p>
    <div
      v-if="postList?.length"
      class="w-full grid gap-4"
      v-for="post in postList"
      :key="post.id"
    >
      <ABlog :blog="post" />
    </div>
    <div class="flex justify-end mb-10 pr-5">
      <UPagination
        v-model="pagination.currentPage"
        :total="pagination.totalPage"
        :page-count="pagination.pageCount"
        @click="handlePagination(pagination.currentPage)"
        show-last
        show-first
      />
    </div>
  </div>
</template>
