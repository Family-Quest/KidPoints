<template>
  <div
    ref="dropdownRef"
    class="relative inline-block"
  >
    <button
      class="flex items-center gap-2 px-3 py-1.5 h-9 rounded-full border shadow-sm transition-all duration-300"
      :class="[
        isDisabled
          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
          : 'bg-white border-purple-500 hover:shadow-md hover:border-purple-700 text-purple-800',
      ]"
      type="button"
      :disabled="isDisabled"
      @click="toggleDropdown"
    >
      <div
        class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold select-none"
        :class="avatarClasses"
      >
        {{ selectedInitials }}
      </div>
      <span class="truncate max-w-[100px] font-semibold">
        {{ selectedChild?.name || $t('task.unassigned') }}
      </span>
      <svg
        v-if="!isDisabled"
        class="w-4 h-4 text-purple-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <transition name="fade">
      <ul
        v-if="dropdownOpen"
        class="absolute top-full mt-2 left-0 z-50 w-48 max-h-60 overflow-auto rounded-md border bg-white shadow-lg"
      >
        <li
          key="unassigned"
          class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-purple-100"
          @click="selectChild(null)"
        >
          <div
            class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 select-none"
          >
            ?
          </div>
          <span>{{ $t('task.unassigned') }}</span>
        </li>

        <li
          v-for="child in children"
          :key="child.id"
          class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-purple-100"
          @click="selectChild(child.id)"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold select-none"
            :class="getAvatarClasses(child.avatar_color ?? 'gray')"
          >
            {{ getInitials(child.name) }}
          </div>
          <span>{{ child.name }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { ActiveTask, TaskAssignment } from '~/types/task'

const props = defineProps<{
  task: ActiveTask
  taskAssignment?: TaskAssignment | null
}>()

const isDisabled = computed(() => props.task.status === 'done')

const { useChildrenQuery } = useChild()
const { useUpsertTaskAssignmentMutation, useDeleteAssignationMutation } = useTask()

const user = useSupabaseUser()
const { data: children } = useChildrenQuery(user)
const { mutate: updateAssignation } = useUpsertTaskAssignmentMutation(user)
const { mutate: deleteAssignation } = useDeleteAssignationMutation(user)

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const selectedChildId = ref<string | null>(props.taskAssignment?.child?.id || null)

const selectedChild = computed(() => children.value?.find(c => c.id === selectedChildId.value) ?? null)

const selectedInitials = computed(() => {
  if (!selectedChild.value?.name) return '?'
  const parts = selectedChild.value.name.trim().split(' ')
  if (parts.length === 1 && parts[0]) return parts[0].substring(0, 2).toUpperCase()
  if (parts.length >= 2 && parts[0] && parts[1]) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return ''
})

const toggleDropdown = () => {
  if (isDisabled.value) return
  dropdownOpen.value = !dropdownOpen.value
}

const onClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}
document.addEventListener('click', onClickOutside)

const selectChild = (childId: string | null) => {
  if (isDisabled.value) return

  if (childId === null) {
    selectedChildId.value = null
    deleteAssignation(props.task.id)
  }
  else {
    selectedChildId.value = childId
    updateAssignation({
      task_id: props.task.id,
      child_id: childId,
    })
  }

  dropdownOpen.value = false
}

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})

const getInitials = (name: string) => {
  const parts = name.trim().split(' ')
  if (parts.length === 1 && parts[0]) return parts[0].substring(0, 2).toUpperCase()
  if (parts.length >= 2 && parts[0] && parts[1]) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return ''
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

const avatarClasses = computed(() => {
  return avatarBgMap[selectedChild.value?.avatar_color || 'gray'] || avatarBgMap.gray
})

const getAvatarClasses = (color: string) => {
  return avatarBgMap[color] ?? avatarBgMap.gray
}
</script>
