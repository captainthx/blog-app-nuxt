<script lang="ts" setup>
import ANavbarAuth from "~/components/ANavbarAuth.vue";
</script>
.
<template>
  <ALoadingBar :duration="10000" />
  <ANavbarAuth />
  <UContainer class="w-screen max-h-[100dvh] mt-12 p-4">
    <UNotifications />
    <NuxtPage />
  </UContainer>
</template>
