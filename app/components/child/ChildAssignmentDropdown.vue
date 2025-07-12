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
        {{ task.child?.name || $t('task.unassigned') }}
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
            :class="getAvatarClasses(child.avatar_color as AvatarColor)"
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
import { getAvatarClasses, getInitials } from '~/types/child'
import type { AvatarColor } from '~/types/child'
import type { TaskAssignment } from '~/types/task'

const props = defineProps<{
  task: TaskAssignment
}>()

const task = toRef(props, 'task')

const selectedChildId = ref<string | null>(task.value.child?.id || null)
const isDisabled = computed(() => task.value.status === 'done')
const avatarClasses = computed(() => getAvatarClasses(task.value.child?.avatar_color as AvatarColor || 'gray' as AvatarColor))

const { useChildrenQuery } = useChild()
const { useUpsertTaskAssignmentMutation, useDeleteAssignationMutation } = useTask()

const user = useSupabaseUser()
const { data: children } = useChildrenQuery(user)
const { mutate: updateAssignation } = useUpsertTaskAssignmentMutation(user)
const { mutate: deleteAssignation } = useDeleteAssignationMutation(user)

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const selectedInitials = computed(() => task.value.child ? getInitials(task.value.child.name) : '?')

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
  if (!task.value) return

  if (childId === null) {
    selectedChildId.value = null
    deleteAssignation(task.value.id)
  }
  else {
    selectedChildId.value = childId
    updateAssignation({
      task_id: task.value.id,
      child_id: childId,
    })
  }

  dropdownOpen.value = false
}

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>
