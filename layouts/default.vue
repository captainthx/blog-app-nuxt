<script lang="ts" setup></script>
.
<template>
  <ALoadingBar :duration="10000" />
  <ANavbar />
  <UContainer class="w-full max-h-[100dvh] mt-20 p-4">
    <UNotifications />
    <NuxtPage />
  </UContainer>
</template>

<style scoped>
body {
  font-family: Roboto, sans-serif;
}
</style>
