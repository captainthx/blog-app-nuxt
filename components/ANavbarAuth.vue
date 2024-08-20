<script setup lang="ts">
import { getFile } from "~/service/file";
import { useAuthStore } from "~/store/authStore";
import { useProfileStore } from "~/store/profileStore";
import type { AccountResponse } from "~/types";

const { logout } = useAuthStore();
const { removeProfile, profile } = useProfileStore() as {
  profile: AccountResponse;
  removeProfile: () => void;
};
const avatarUrl = ref<string>("");
const router = useRouter();
const links = [
  {
    label: "Home",
    icon: "i-heroicons-home",
    to: "index",
  },
  {
    label: "Blog",
    icon: "i-heroicons-pencil-square-20-solid",
    to: "blog-write",
  },
];

const items = [
  [
    {
      label: "Profile",
      slot: "profile",
      click: () => {
        router.push({ name: "profile" });
      },
    },
  ],
  [
    {
      label: "Favorite",
      icon: "i-heroicons-bookmark-20-solid",
      click: () => {
        router.push({ name: "favorire" });
      },
    },
  ],
  [
    {
      label: "Write",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        router.push({ name: "blog-write" });
      },
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-start-on-rectangle-solid",
      click: () => {
        logout();
        removeProfile();
        router.push({ name: "login" });
      },
    },
  ],
];

const loadAvatar = async () => {
  if (profile) {
    const res = await getFile(profile.avatar);
    avatarUrl.value = URL.createObjectURL(res.data);
  }
};

onBeforeMount(() => {
  if (profile) {
    loadAvatar();
  }
});
</script>

<template>
  <div
    class="fixed w-full top-0 p-3 bg-transparent z-40 items-center max-h-12 flex flex-row justify-between bg-opacity-60 border-b-2"
  >
    <div class="flex flex-row gap-2">
      <ULink
        class="flex items-center gap-1 hover:bg-gray-100 p-1 rounded-lg dark:hover:bg-gray-600"
        v-for="item in links"
        :key="item.label"
        :to="{ name: item.to }"
        active-class="text-primary  "
        inactive-class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <UIcon :name="item.icon" />
        {{ item.label }}
      </ULink>
    </div>
    <div class="flex flex-row gap-2 mr-5 items-center">
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <UIcon name="i-heroicons-user" />
        <template #profile="{ item }">
          <div
            class="flex justify-center gap-2 items-center"
            v-motion
            :initial="{
              y: 100,
              opacity: 0,
            }"
            :enter="{
              y: 0,
              opacity: 1,
              transition: {
                type: 'spring',
                stiffness: 250,
                damping: 25,
                mass: 0.5,
              },
            }"
          >
            <UAvatar :src="avatarUrl" size="xs" alt="avatar" />
            {{ item.label }}
          </div>
        </template>
      </UDropdown>
    </div>
    <AFloatButton />
  </div>
</template>
