<template>
  <div class="space-y-1">
    <div class="relative">
      <input
        :type="show ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
        @input="onInput"
      >
      <button
        type="button"
        class="absolute right-2 top-2 text-gray-500 text-sm"
        @click="show = !show"
      >
        {{ show ? '👁️' : '🙈' }}
      </button>
    </div>

    <!-- Barre de force conditionnelle -->
    <div>
      <div class="h-2 w-full bg-gray-200 rounded overflow-hidden mt-1">
        <div
          class="h-full transition-all duration-300"
          :class="strengthBarClass"
          :style="{ width: `${strength * 25}%` }"
        />
      </div>
      <p class="text-xs text-gray-600 mt-1">
        Force du mot de passe : <strong>{{ strengthLabel }}</strong>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | undefined
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const show = ref(false)

const strength = computed(() => {
  const pwd = props.modelValue || ''
  let score = 0
  if (pwd.length >= 8) score += 1
  if (/[A-Z]/.test(pwd)) score += 1
  if (/[0-9]/.test(pwd)) score += 1
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1
  return score
})

const strengthBarClass = computed(() => {
  return ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-500'][strength.value]
})

const strengthLabel = computed(() => {
  return ['Très faible', 'Faible', 'Moyen', 'Bon', 'Excellent'][strength.value]
})

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (target) {
    emit('update:modelValue', target.value)
  }
}
</script>
