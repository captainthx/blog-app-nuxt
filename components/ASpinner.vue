<script setup lang="ts">
const spinnerRef = ref<HTMLElement | null>(null);
const hideSpinner = ref<boolean>(false);
onMounted(() => {
  setTimeout(() => {
    if (spinnerRef.value) {
      spinnerRef.value.style.display = "none";
      hideSpinner.value = true;
    }
  }, 2000);
});
</script>

<template>
  <div class="flex justify-center items-center w-full min-h-[80dvh]">
    <div
      ref="spinnerRef"
      class="animate-spin w-10 h-10 border-[3px] border-current border-t-transparent text-green-600 rounded-full dark:text-white"
      role="status"
      aria-label="loading"
    ></div>
    <span
      class="animate-bounce text-pretty text-2xl text-green-600 dark:text-white"
      v-if="hideSpinner"
      >Loading...</span
    >
  </div>
</template>

<style scoped></style>
