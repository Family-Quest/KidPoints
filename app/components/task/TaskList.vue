<!-- components/tasks/TaskList.vue -->
<template>
  <section>
    <h2 class="text-2xl font-semibold mb-4 border-b-2 border-purple-400 pb-2">
      📋 {{ $t('task.list.title') }}
    </h2>

    <div
      v-if="isLoading"
      class="flex flex-col gap-4"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="animate-pulse bg-gray-100 rounded-xl h-28"
      />
    </div>

    <div
      v-else-if="tasks?.length === 0"
      class="text-gray-400 italic text-center py-8"
    >
      {{ $t('task.list.no_tasks_found') }}
    </div>

    <div
      v-else
      class="flex flex-col gap-4"
    >
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const { useActiveTasksQuery } = useTask()
const user = useSupabaseUser()

const { data: tasks, isLoading } = useActiveTasksQuery(user)
</script>
