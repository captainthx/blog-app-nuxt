<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";
import { getpostList } from "~/service/post";
import type { PaginationResponse, PostResponse, PostRequest } from "~/types";
import { DefaultPagination } from "~/types/enum";

const authStore = useAuthStore();
const toast = useToast();

const queryPost = ref<PostRequest>({
  page: DefaultPagination.pages,
  size: DefaultPagination.limit,
});
const pagination = ref<PaginationResponse>({
  current: 0,
  limit: 0,
  records: 0,
  pages: 0,
});
const postList = ref<PostResponse[]>([]);

const loadData = async () => {
  try {
    const res = await getpostList(queryPost.value);
    if (res.status === 200 && res.data.code === 200) {
      postList.value = res.data.result;
      pagination.value = res.data.pagination;
    }
  } catch (error) {
    if (typeof error === "string") {
    } else if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      toast.add({
        title: "Load data failed",
        description: responseData.message,
        timeout: 3000,
        color: "red",
      });
    }
  }
};

const handlePagination = async (page: number) => {
  if (page !== queryPost.value.page) {
    queryPost.value.page = page;
    await loadData();
  }
};
await loadData();
</script>

<template>
  <p class="text-pretty font-semibold text-3xl">All Post</p>
  <div class="w-full grid gap-4" v-for="post in postList" :key="post.id">
    <hr />
    <ABlog :blog="post" />
  </div>
  <div class="flex justify-end my-10 p-10">
    <UPagination
      v-model="pagination.current"
      :page-count="pagination?.current"
      :total="pagination?.records"
      @click="() => handlePagination(pagination.current)"
    />
  </div>
</template>
