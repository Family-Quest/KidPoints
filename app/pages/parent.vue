<template>
  <div class="max-w-4xl mx-auto mt-10 space-y-8">
    <!-- Profil Parent -->
    <ParentProfileUpdate />

    <!-- Enfants -->
    <ChildrensUpdate />

    <!-- Tâches -->
    <div class="bg-white shadow rounded-xl p-6">
      <h2 class="text-xl font-bold text-purple-700 mb-4">
        {{ $t('parent.tasks') }}
      </h2>
      <ul class="space-y-2">
        <li
          v-for="task in tasks"
          :key="task.id"
          class="p-2 bg-gray-100 rounded"
        >
          <strong>{{ task.title }}</strong> — {{ task.points }} pts
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const { useTasksQuery } = useTask()

const user = useSupabaseUser()

const { data: tasks } = useTasksQuery(user)

definePageMeta({ middleware: 'auth', layout: 'parent' })
</script>
