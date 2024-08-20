<script setup lang="ts">
import { searchPost } from "~/service/post";
import type { SearchPostRequest, SearchPostResponse } from "~/types";

const router = useRouter();

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
const isOpen = ref(false);
const isLoading = ref<boolean>(false);
const search = ref<string>("");
const searchList = ref<SearchPostResponse[]>([]);

const loadSearch = async () => {
  isLoading.value = true;
  try {
    const res = await searchPost({
      search: search.value,
    });
    if (res.status === 200 && res.data.result) {
      searchList.value = res.data.result;
    }
  } catch (error) {
    console.log("search post error :", error);
  } finally {
    isLoading.value = false;
  }
};

const handelCloseModal = () => {
  isOpen.value = false;
  search.value = "";
  searchList.value = [];
};

const handelSelectSearch = (id: number) => {
  handelCloseModal();
  router.push({ path: `/blog/${id}` });
};

watch(search, () => {
  if (search.value != "") {
    loadSearch();
  }
  searchList.value = [];
});
</script>

<template>
  <div
    class="group fixed bottom-0 right-0 p-2 flex items-end justify-end size-24"
  >
    <!-- main -->
    <div
      class="text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 z-50 absolute"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 group-hover:rotate-90 transition-all duration-[0.6s]"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
    <!-- sub left -->
    <!-- <div
      class="absolute rounded-full transition-all duration-[0.2s] ease-out scale-y-0 group-hover:scale-y-100 group-hover:-translate-x-16 flex p-2 hover:p-3 bg-green-300 scale-100 hover:bg-green-400 text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z"
        />
      </svg>
    </div> -->

    <!-- sub top -->
    <div
      class="absolute rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-16 flex p-2 hover:p-3 bg-green-200 scale-100 hover:bg-green-400 text-white"
      @click="isDark = !isDark"
    >
      <svg
        v-if="isDark"
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5"
        viewBox="0 0 20 20"
      >
        <path
          fill="#888888"
          d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2m0 13a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15m0-8a3 3 0 1 0 0 6a3 3 0 0 0 0-6m5.657-1.596a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06zm-9.193 9.192a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06zM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10M5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10m9.596 5.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06zM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="size-6"
        viewBox="0 0 20 20"
      >
        <path
          fill="#888888"
          fill-rule="evenodd"
          d="M7.455 2.004a.75.75 0 0 1 .26.77a7 7 0 0 0 9.958 7.967a.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <!-- sub middle -->
    <div
      class="absolute rounded-full transition-all duration-[0.3s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-14 group-hover:-translate-x-14 flex p-2 hover:p-3 bg-yellow-200 hover:bg-yellow-400 hover:cursor-pointer text-white"
      @click="isOpen = !isOpen"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-6"
        viewBox="0 0 20 20"
      >
        <path
          fill="#888888"
          fill-rule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11M2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9"
          clip-rule="evenodd"
        />
      </svg>

      <UModal v-model="isOpen" :transition="false" prevent-close>
        <UButton
          color="white"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="my-1 flex justify-end"
          @click="handelCloseModal"
        />

        <div class="p-5">
          <UInput
            :loading="isLoading"
            icon="i-heroicons-magnifying-glass-20-solid"
            v-model="search"
            color="white"
            variant="outline"
            placeholder="Searching..."
          />
          <span class="flex justify-center mt-2" v-if="isLoading"
            >loading...</span
          >
          <div
            v-if="searchList.length"
            class="mt-5 h-[400px] overflow-auto w-full mx-auto"
          >
            <div
              class="flex flex-col p-2 dark:bg-inherit"
              v-for="search in searchList"
              :key="search.id"
            >
              <div
                @click="handelSelectSearch(search.id)"
                v-if="search"
                class="text-back hover:cursor-pointer hover:text-blue-300 transition-all duration-200 scale-90 hover:scale-95 hover:font-semibold"
              >
                {{ ` ${search.title} ` }}
              </div>
            </div>
          </div>
          <div
            v-if="searchList.length === 0 && search.length > 0"
            class="flex justify-center mt-5"
          >
            No data found!
          </div>
          <div v-if="search === ''" class="flex justify-center mt-5">
            Search something...
          </div>
        </div>
      </UModal>
    </div>
  </div>
</template>

<style scoped></style>
