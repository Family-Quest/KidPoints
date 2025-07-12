<template>
  <div class="max-w-5xl mx-auto flex flex-col gap-6 px-4 py-6">
    <!-- Header famille -->
    <div class="bg-purple-100 px-6 py-4 rounded-xl shadow flex flex-col md:flex-row items-center justify-between gap-2 animate-fadeIn">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🏡</span>
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-purple-800">
            {{ $t('dashboard.title', { family: familyStore.name || '...' }) }}
          </h1>
          <p class="text-sm text-purple-700">
            {{ $t('dashboard.subtitle') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Liste enfants et tâches -->
    <ChildList />
    <TaskList />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'parent' })

const familyStore = useFamilyStore()
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}
</style>
