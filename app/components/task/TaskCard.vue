<!-- components/tasks/TaskCard.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-md p-4 flex cursor-pointer hover:shadow-xl transition-shadow gap-4 items-center"
    :class="statusBgClass"
  >
    <!-- Bouton validation à gauche -->
    <TaskValidator
      v-if="task.status === TaskStatusEnum.IN_PROGRESS"
      :task="task"
    />

    <!-- Contenu de la carte -->
    <div class="flex flex-col flex-1 gap-2">
      <!-- En-tête -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold truncate max-w-[65%]">
          {{ task.title }}
        </h3>
        <div class="flex items-center gap-2">
          <TaskStatusIcon :status="task.status" />
          <span
            :class="statusTextClass"
            class="font-medium capitalize select-none"
          >
            {{ $t(`task.status_${task.status}`) }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <p class="text-gray-600 line-clamp-2">
        {{ task.description }}
      </p>

      <!-- Bas de la carte -->
      <div class="flex items-center justify-between gap-3">
        <ChildAssignmentDropdown
          class="min-w-0 flex-shrink"
          :task="task"
          :task-assignment="task.assignment"
        />
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold select-none bg-purple-200 text-purple-700"
        >
          {{ task.points }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TaskStatusEnum } from '~/types/task'
import type { ActiveTask } from '~/types/task'

const props = defineProps<{
  task: ActiveTask
}>()

const statusBgMap: Record<string, string> = {
  todo: 'bg-yellow-50',
  doing: 'bg-blue-50',
  done: 'bg-green-50',
}

const statusTextMap: Record<string, string> = {
  todo: 'text-yellow-700',
  doing: 'text-blue-700',
  done: 'text-green-700',
}

const statusBgClass = statusBgMap[props.task.status] || 'bg-gray-100'
const statusTextClass = statusTextMap[props.task.status] || 'text-gray-700'
</script>
