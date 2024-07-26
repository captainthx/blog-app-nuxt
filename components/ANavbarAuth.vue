<script setup lang="ts">
import { useAuthStore } from "~/store/authStore";
import { useProfileStore } from "~/store/profileStore";

const { logout } = useAuthStore();
const { removeProfile } = useProfileStore();
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
      avatar: {
        src: "https://avatars.githubusercontent.com/u/739984?v=4",
      },
      click: () => {
        router.push({ name: "profile" });
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
const isOpenModal = ref<boolean>(false);
const query = ref<string>("");
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

<template>
  <div
    class="fixed w-full top-0 p-3 bg-transparent items-center max-h-10 flex flex-row justify-between bg-opacity-60 border-b-2"
  >
    <div class="flex flex-row gap-4">
      <ULink
        class="flex items-center gap-2"
        v-for="item in links"
        :key="item.label"
        :to="{ name: item.to }"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
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
    <div class="flex flex-row gap-2 mr-5 items-center">
      <div>
        <ClientOnly>
          <UButton
            class="hover:bg-opacity-0 dark:hover:bg-opacity-0"
            :icon="
              isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
            "
            color="gray"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
          />
        </ClientOnly>
      </div>
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <UIcon name="i-heroicons-user" />
      </UDropdown>
    </div>
  </div>
</template>
