<template>
  <div
    class="rounded-xl border border-gray-500 shadow-md p-4 flex flex-col gap-4 hover:shadow-xl transition-shadow"
    :class="statusBgClass"
  >
    <!-- Contenu principal -->
    <div class="flex flex-col flex-1 gap-2">
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

      <!-- Affectation + Points -->
      <div class="flex items-center justify-between gap-3">
        <ChildAssignmentDropdown
          class="min-w-0 flex-shrink"
          :task="task"
        />
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold select-none bg-purple-200 text-purple-700 border border-purple-300"
        >
          {{ task.points }}
        </div>
      </div>

      <!-- ✅ Bouton de validation en bas -->
      <div
        v-if="task.status === TaskStatusEnum.IN_PROGRESS"
        class="pt-2 flex justify-center"
      >
        <TaskValidator :task="task" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TaskStatusEnum, taskStatusStyles, taskStatusValues } from '~/types/task'
import type { TaskAssignment, TaskStatus } from '~/types/task'

const props = defineProps<{
  task: TaskAssignment
}>()

const normalizedStatus = computed(() => {
  const status = props.task.status
  return taskStatusValues.includes(status as TaskStatus)
    ? (status as TaskStatus)
    : null
})

const statusStyles = computed(() =>
  normalizedStatus.value
    ? taskStatusStyles[normalizedStatus.value]
    : {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
      },
)

const statusBgClass = computed(() => statusStyles.value.bg)
const statusTextClass = computed(() => statusStyles.value.text)
</script>
