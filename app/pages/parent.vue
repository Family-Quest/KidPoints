<template>
  <div class="max-w-4xl mx-auto mt-10 space-y-8">
    <!-- Profil Parent -->
    <ParentProfileUpdate />

    <!-- Enfants -->
    <ChildrensUpdate />

    <!-- Tâches -->
    <TasksUpdate />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'parent' })
</script>
