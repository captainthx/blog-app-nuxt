<script setup lang="ts">
import { useAuthStore } from "~/store/authStore";

const authStore = useAuthStore();
const links = [
  {
    label: "Home",
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "About",
    icon: "i-heroicons-exclamation-circle",
    to: "/about",
  },
  {
    label: "Contact",
    icon: "i-heroicons-device-phone-mobile",
    to: "/contact",
  },
];

const items = [
  [
    {
      label: "Profile",
      avatar: {
        src: "https://avatars.githubusercontent.com/u/739984?v=4",
      },
    },
  ],
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-start-on-rectangle-solid",
      click: () => authStore.logout(),
    },
  ],
];
</script>

<template>
  <div
    class="fixed w-full top-0 p-3 items-center h-10 flex flex-row justify-between bg-slate-100"
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
    <div>
      <UDropdown
        v-if="authStore.isAuthenticated"
        :items="items"
        :popper="{ placement: 'bottom-start' }"
      >
        <UIcon name="i-heroicons-user-solid" />
      </UDropdown>
      <ULink
        v-else
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

<style scoped></style>
