<template>
  <div class="w-full bg-gray-200 rounded-full h-2">
    <div
      class="bg-purple-500 h-2 rounded-full"
      :style="{ width: `${progress}%` }"
    />
  </div>
  <div class="text-xs text-gray-600 mt-1">
    {{ points }} / {{ nextLevel }} XP
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ points: number, level: number }>()
const nextLevel = computed(() => 10 + props.level * 10)
const progress = computed(() =>
  Math.min(100, (props.points / nextLevel.value) * 100),
)
</script>
