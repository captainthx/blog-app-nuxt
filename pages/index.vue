<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";
import type { Tabs } from "~/types";

const authStore = useAuthStore();
const like = ref<boolean>(false);

const handleLike = () => {
  like.value = !like.value;
};
</script>

<template>
  <div class="max-w-full">
    <h1>index page</h1>
    <P>หน้าแรก</P>
    <div class="grid grid-cols-4 gap-2">
      <UCard v-for="i in 10" :key="i">
        <template #header>
          <h1>post name</h1>
          tag
        </template>
        <NuxtImg
          src="https://nextui.org/images/hero-card-complete.jpeg"
        ></NuxtImg>

        <template #footer>
          <div class="flex flex-row justify-between items-center">
            <UIcon
              :name="
                like === false ? 'i-heroicons-heart' : 'i-heroicons-heart-solid'
              "
              size="sm"
              class="text-red-500"
              @click="handleLike"
            />
            <UButton
              icon="i-heroicons-chat-bubble-left-ellipsis"
              variant="ghost"
            />
            <UButton
              icon="i-heroicons-pencil-square"
              size="sm"
              variant="ghost"
            />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
