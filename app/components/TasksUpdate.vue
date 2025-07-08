<template>
  <div class="bg-white shadow rounded-2xl p-6">
    <!-- Titre section -->
    <h2 class="text-xl font-bold text-purple-700 mb-6">
      {{ $t('parent.tasks') }}
    </h2>

    <!-- Chargement -->
    <div
      v-if="isLoading"
      class="text-gray-500 text-center py-10"
    >
      {{ $t('dashboard.loading') }}
    </div>

    <!-- Liste des tâches -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <!-- Cartes de tâches -->
      <TaskUpdateCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
      />

      <!-- Bouton d’ajout stylisé -->
      <button
        class="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 hover:border-purple-500 rounded-xl transition-colors text-gray-500 hover:text-purple-600 text-sm font-medium focus:outline-none"
        :disabled="isPending"
        @click="createTask"
      >
        <span class="text-3xl font-bold mb-1">+</span>
        <span>{{ $t('task.add') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { useTasksQuery, useCreateTaskMutation } = useTask()
const user = useSupabaseUser()

const { data: tasks, isLoading } = useTasksQuery(user)
const { mutate: addTask, isPending } = useCreateTaskMutation(user)

const createTask = () => {
  if (!user.value?.id) return
  addTask({
    created_by: user.value.id,
  })
}
</script>
