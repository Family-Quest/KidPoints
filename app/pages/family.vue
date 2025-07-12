<template>
  <div class="max-w-4xl mx-auto mt-10 space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FamilyCard />
      <ParentProfileUpdate />
    </div>
    <ChildUpdateList />
    <TaskUpdateList />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'parent' })
</script>
