<script lang="ts" setup>
import { useAuthStore } from "~/store/authStore";
const authStore = useAuthStore();
// const links = [
//   [
//     {
//       label: "Home",
//       icon: "i-heroicons-home",
//       to: "/",
//     },
//     {
//       label: "About",
//       icon: "i-heroicons-exclamation-circle",
//       to: "/about",
//     },
//     {
//       label: "Contact",
//       icon: "i-heroicons-device-phone-mobile",
//       to: "/contact",
//     },
//   ],
//   [
//     {
//       label: "Logout",
//       icon: "i-heroicons-arrow-right-start-on-rectangle-solid",
//       click: () => authStore.logout(),
//     },
//   ],
// ];
</script>
.
<template>
  <ANavbar />
  <UContainer class="w-screen h-screen mt-12 p-4">
    <UNotifications />
    <NuxtPage />
  </UContainer>
</template>
