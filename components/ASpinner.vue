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
const initial = {
  y: 500,
  opacity: 0,
  transition: {
    stiffness: 250,
  },
};
const enter = {
  y: 0,
  opacity: 1,
  transition: {
    type: "spring",
    ease: "easeInOut",
  },
};
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
      v-motion
      :initial="initial"
      :enter="enter"
      :delay="200"
      class="text-pretty text-2xl text-green-600 dark:text-white"
      v-if="hideSpinner"
      >Loading...</span
    >
  </div>
</template>

<style scoped></style>
