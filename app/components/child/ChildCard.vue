<template>
  <div
    class="relative rounded-2xl border-2 p-4 flex flex-col items-center text-center hover:scale-[1.02] hover:shadow-xl transition-transform duration-300 gap-2 bg-white"
    :class="borderColorClasses"
  >
    <div class="flex justify-between w-full mb-2">
      <span>
        {{ getAvatarEmoji(child.avatar_color) }}
      </span>
      <div class="text-xs font-bold bg-yellow-200 text-gray-900 px-2 py-1 rounded-full shadow">
        🏅 {{ $t('child.level') }} {{ child.level }}
      </div>
    </div>

    <div
      class="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-2 text-white shadow-inner"
      :class="avatarClasses"
    >
      <span>{{ getInitials(child.name) }}</span>
    </div>

    <div class="flex justify-between w-full">
      <!-- Nom -->
      <h3 class="font-semibold truncate text-gray-800 items-center">
        {{ child.name }}
      </h3>

      <!-- Points -->
      <p class="text-purple-600 font-medium">
        {{ $t('child.points') }} {{ child.points }}
      </p>
    </div>

    <!-- Barre d'XP -->
    <PointProgressBar
      :points="child.points"
      :level="child.level"
    />
  </div>
</template>

<script setup lang="ts">
import type { AvatarColor, Child } from '~/types/child'
import { getAvatarClasses, getInitials, getAvatarEmoji, getAvatarBorderColor } from '~/types/child'

const props = defineProps<{ child: Child }>()
const child = toRef(props, 'child')
const avatarClasses = computed(() => getAvatarClasses(child.value.avatar_color as AvatarColor))
const borderColorClasses = computed(() => getAvatarBorderColor(child.value.avatar_color as AvatarColor))
</script>
