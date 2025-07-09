<template>
  <div class="max-w-4xl mx-auto mt-10 space-y-8">
    <ParentProfileUpdate />
    <ChildUpdateList />
    <TaskUpdateList />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'parent' })
</script>
