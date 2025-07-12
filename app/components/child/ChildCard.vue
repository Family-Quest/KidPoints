<!-- components/children/ChildCard.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-xl transition-shadow gap-2"
  >
    <div
      class="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-4 select-none"
      :class="avatarClasses"
    >
      {{ getInitials(child.name) }}
    </div>
    <h3 class="text-xl font-semibold truncate">
      {{ child.name }}
    </h3>
    <p class="text-purple-600 font-medium">
      {{ $t('child.points') }} {{ child.points }}
    </p>
    <p class="text-gray-500 text-sm">
      {{ $t('child.level') }} {{ child.level }}
    </p>
    <PointProgressBar
      :points="child.points"
      :level="child.level"
    />
  </div>
</template>

<script setup lang="ts">
import type { AvatarColor, Child } from '~/types/child'
import { getAvatarClasses, getInitials } from '~/types/child'

const props = defineProps<{
  child: Child
}>()

const child = toRef(props, 'child')

const avatarClasses = computed(() => getAvatarClasses(child.value.avatar_color as AvatarColor))
</script>
