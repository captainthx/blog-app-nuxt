<script setup lang="ts">
import { useAuthStore } from "~/store/authStore";

const links = [
  {
    label: "Home",
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "Blog",
    icon: "i-heroicons-pencil-square-20-solid",
    to: "/blog/write",
  },
];

const isOpenModal = ref<boolean>(false);
const query = ref<string>("");
</script>

<template>
  <div
    class="fixed w-full top-0 p-3 h-10 flex flex-row items-center justify-between bg-white/30 bg-opacity-60 border-b-2"
  >
    <div class="flex flex-row gap-4">
      <ULink
        class="flex items-center gap-2"
        v-for="item in links"
        :key="item.label"
        :to="item.to"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <UIcon :name="item.icon" />
        {{ item.label }}
      </ULink>
    </div>
    <div class="flex flex-row gap-2 mr-5">
      <ULink
        to="/login"
        class="flex items-center gap-2"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <UIcon name="i-heroicons-arrow-left-on-rectangle-solid" />
        login
      </ULink>
    </div>
  </div>
</template>
