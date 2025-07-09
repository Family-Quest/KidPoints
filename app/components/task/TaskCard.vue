<!-- components/tasks/TaskCard.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-md p-5 flex flex-col cursor-pointer hover:shadow-xl transition-shadow"
    :class="statusBgClass"
  >
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-semibold truncate">
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

    <p class="text-gray-600 mb-4 truncate">
      {{ task.description }}
    </p>

    <div class="flex flex-row justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold select-none"
          :class="childAvatarClasses"
        >
          {{ childInitials }}
        </div>
        <span class="font-medium truncate">{{ task.task_assignments?.[0]?.child?.name || $t('task.unassigned') }}</span>
      </div>
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold select-none bg-purple-200 text-purple-700 mt-4">
        {{ task.points }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const avatarBgMap: Record<string, string> = {
  red: 'bg-red-200 text-red-700',
  blue: 'bg-blue-200 text-blue-700',
  green: 'bg-green-200 text-green-700',
  yellow: 'bg-yellow-200 text-yellow-700',
  purple: 'bg-purple-200 text-purple-700',
  pink: 'bg-pink-200 text-pink-700',
  gray: 'bg-gray-200 text-gray-700',
  orange: 'bg-orange-200 text-orange-700',
}

const statusBgClass = statusBgMap[props.task.status] || 'bg-gray-100'
const statusTextClass = statusTextMap[props.task.status] || 'text-gray-700'

const childAvatarClasses = computed(() => {
  const color = props.task.task_assignments?.[0]?.child?.avatar_color || 'gray'
  return avatarBgMap[color] || avatarBgMap.gray
})

const childInitials = computed(() => {
  const name = props.task.task_assignments?.[0]?.child?.name || ''
  if (!name) return ''
  const parts = name.trim().split(' ')
  if (parts.length === 1 && parts[0]) return parts[0].substring(0, 2).toUpperCase()
  if (parts.length >= 2 && parts[0] && parts[1]) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return ''
})
</script>
