<!-- components/children/ChildCard.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-xl transition-shadow cursor-pointer"
  >
    <div
      class="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-4 select-none"
      :class="avatarClasses"
    >
      {{ initials }}
    </div>
    <h3 class="text-xl font-semibold mb-1 truncate">
      {{ child.name }}
    </h3>
    <p class="text-purple-600 font-medium mb-1">
      {{ $t('child.points') }} : {{ child.points }}
    </p>
    <p class="text-gray-500 text-sm">
      {{ $t('child.level') }} : {{ child.level }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Child } from '~/types/child'

const props = defineProps<{
  child: Child
}>()

const initials = computed(() => {
  if (!props.child.name) return ''
  const parts = props.child.name.trim().split(' ')
  if (parts.length === 1 && parts[0]) return parts[0].substring(0, 2).toUpperCase()
  if (parts.length >= 2 && parts[0] && parts[1]) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return ''
})

const avatarClasses = computed(() => {
  const color = props.child.avatar_color
  const colorBgMap: Record<string, string> = {
    red: 'bg-red-200',
    blue: 'bg-blue-200',
    green: 'bg-green-200',
    yellow: 'bg-yellow-200',
    purple: 'bg-purple-200',
    pink: 'bg-pink-200',
    gray: 'bg-gray-200',
    orange: 'bg-orange-200',
  }
  const colorTextMap: Record<string, string> = {
    red: 'text-red-700',
    blue: 'text-blue-700',
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    purple: 'text-purple-700',
    pink: 'text-pink-700',
    gray: 'text-gray-700',
    orange: 'text-orange-700',
  }

  return `${colorBgMap[color] || 'bg-gray-200'} ${colorTextMap[color] || 'text-gray-700'}`
})
</script>
