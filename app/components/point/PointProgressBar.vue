<template>
  <div class="w-full bg-gray-200 rounded-full h-2">
    <div
      class="bg-purple-500 h-2 rounded-full"
      :style="{ width: `${progress}%` }"
    />
  </div>
  <div class="text-xs text-gray-600 mt-1">
    {{ pointsInCurrentLevel }} / {{ pointsNeededForNextLevel }} XP
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ points: number, level: number }>()

function pointsForLevel(level: number): number {
  return 2 * (level - 1) ** 2
}

const pointsCurrentLevel = pointsForLevel(props.level)
const pointsNextLevel = pointsForLevel(props.level + 1)

const pointsInCurrentLevel = Math.max(0, props.points - pointsCurrentLevel)
const pointsNeededForNextLevel = pointsNextLevel - pointsCurrentLevel

const progress = computed(() => {
  const range = pointsNeededForNextLevel
  const progressPoints = pointsInCurrentLevel
  return Math.min(100, Math.max(0, (progressPoints / range) * 100))
})
</script>
