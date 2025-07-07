<template>
  <header>
    Header content
  </header>
  <NuxtPage />
  <footer>
    Footer content
  </footer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    'auth',
  ],
});
</script>