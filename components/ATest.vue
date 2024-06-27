<script setup lang="ts">
const emit = defineEmits<{
  (event: "customChange", val: string): void;
}>();

const handleChange = (event: any) => {
  emit("customChange", event.target.value.toUpperCase());
};
</script>

<template>
  <div>
    <label>My Custom Input</label>
    <input type="text" placeholder="Custom input!" @input="handleChange" />
  </div>
</template>

<style scoped></style>
