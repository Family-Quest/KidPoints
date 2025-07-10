<!-- components/tasks/TaskCard.vue -->
<template>
  <div
    class="rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4 cursor-pointer hover:shadow-xl transition-shadow"
    :class="statusBgClass"
  >
    <!-- TaskValidator : bas centré sur mobile, à gauche centré verticalement sur md+ -->
    <div class="order-2 md:order-1 flex-shrink-0 flex justify-center md:justify-start md:items-center">
      <TaskValidator
        v-if="task.status === TaskStatusEnum.IN_PROGRESS"
        :task="task"
      />
    </div>

    <!-- Contenu de la carte -->
    <div class="flex flex-col flex-1 gap-2 order-1 md:order-2">
      <!-- En-tête -->
      <div class="flex justify-between items-center">
        <h3
          class="text-lg font-semibold break-words max-w-[65%] line-clamp-2 leading-snug"
          :title="task.title"
        >
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
      <p
        class="text-gray-600 line-clamp-2"
        :title="task.description"
      >
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
          class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold select-none bg-purple-200 text-purple-700 border border-purple-300"
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
  todo: 'bg-red-100',
  in_progress: 'bg-blue-100',
  done: 'bg-green-100',
}

const statusTextMap: Record<string, string> = {
  todo: 'text-red-700',
  in_progress: 'text-blue-700',
  done: 'text-green-700',
}

const statusBgClass = computed(() => statusBgMap[props.task.status] || 'bg-gray-100')
const statusTextClass = computed(() => statusTextMap[props.task.status] || 'text-gray-700')
</script>
