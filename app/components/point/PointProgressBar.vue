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
const points = toRef(props, 'points')
const level = toRef(props, 'level')

function pointsForLevel(level: number): number {
  return 2 * (level - 1) ** 2
}

const pointsCurrentLevel = computed(() => pointsForLevel(level.value))
const pointsNextLevel = computed(() => pointsForLevel(level.value + 1))

const pointsInCurrentLevel = computed(() => Math.max(0, points.value - pointsCurrentLevel.value))
const pointsNeededForNextLevel = computed(() => pointsNextLevel.value - pointsCurrentLevel.value)

const progress = computed(() => {
  const range = pointsNeededForNextLevel.value
  const progressPoints = pointsInCurrentLevel.value
  return Math.min(100, Math.max(0, (progressPoints / range) * 100))
})
</script>
