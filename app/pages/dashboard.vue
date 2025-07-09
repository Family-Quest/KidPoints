<template>
  <div class="max-w-5xl flex flex-col gap-4 md:justify-center">
    <ChildList />
    <TaskList />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'parent' })
</script>
