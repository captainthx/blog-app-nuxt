<script setup lang="ts">
const uppercase = ref("");

function handleCustomChange(s: string) {
  uppercase.value = s;
}
</script>

<template>
  <h1>about page</h1>
  <ATest @custom-change="handleCustomChange" />
  <p>Uppercase: {{ uppercase }}</p>
</template>
