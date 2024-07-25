<script setup lang="ts">
import { useAuthStore } from "~/store/authStore";

const { logout } = useAuthStore();
const router = useRouter();
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

const items = [
  [
    {
      label: "Profile",
      avatar: {
        src: "https://avatars.githubusercontent.com/u/739984?v=4",
      },
      click: () => {
        router.push("/profile");
      },
    },
  ],
  [
    {
      label: "Write",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        router.push("/blog/write");
      },
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-start-on-rectangle-solid",
      click: () => {
        logout();
        router.push("/login");
      },
    },
  ],
];
const isOpenModal = ref<boolean>(false);
const query = ref<string>("");
</script>

<template>
  <div
    class="fixed w-full top-0 p-3 items-center h-10 flex flex-row justify-between bg-white/30 bg-opacity-60 border-b-2"
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
    <div class="flex flex-col items-center">
      <UIcon
        class="cursor-pointer"
        name="i-heroicons-magnifying-glass-20-solid"
        @click="isOpenModal = !isOpenModal"
      >
      </UIcon>
      <UModal v-model="isOpenModal">
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
        >
          <template #header>
            <div class="flex flex-row gap-5">
              <UInput
                class="w-full mx-auto"
                type="text"
                placeholder="Search..."
              />
            </div>
          </template>
          content
        </UCard>
      </UModal>
    </div>
    <div class="flex flex-row gap-2 mr-5">
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <UIcon name="i-heroicons-user" />
      </UDropdown>
    </div>
  </div>
</template>
