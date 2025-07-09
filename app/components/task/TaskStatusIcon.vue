<template>
  <component
    :is="icon"
    class="w-5 h-5"
    :class="{
      'text-yellow-500': status === 'todo',
      'text-blue-500 animate-spin': status === 'in_progress',
      'text-green-500': status === 'done',
    }"
  />
</template>

<script setup lang="ts">
import {
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps<{ status: 'todo' | 'in_progress' | 'done' }>()

const icon = computed(() => {
  switch (props.status) {
    case 'todo':
      return ClockIcon
    case 'in_progress':
      return ArrowPathIcon
    case 'done':
      return CheckCircleIcon
    default:
      return ClockIcon
  }
})
</script>
