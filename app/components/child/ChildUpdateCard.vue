<template>
  <div
    class="p-5 rounded-2xl shadow-md relative hover:shadow-lg transition-shadow space-y-4 border border-gray-100"
    :style="fadeBackgroundStyle"
  >
    <!-- Nom de l’enfant -->
    <div>
      <input
        v-model="name"
        :placeholder="$t('onboarding.childName')"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
      <p
        v-if="nameErrorMessage"
        class="mt-1 text-xs text-red-600 font-medium"
      >
        {{ $t(nameErrorMessage) }}
      </p>
    </div>

    <!-- Sélecteur de couleur avatar -->
    <select
      v-model="avatarColor"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
    >
      <option
        v-for="color in avatarColors"
        :key="color.value"
        :value="color.value"
      >
        {{ color.label }}
      </option>
    </select>

    <!-- Points et niveau -->
    <div class="flex justify-between text-sm text-gray-600 font-medium">
      <div>
        <span class="text-purple-500 font-semibold">⭐ {{ child.points }}</span>
        <span class="ml-1">{{ $t('parent.child.points') }}</span>
      </div>
      <div>
        <span class="">{{ $t('parent.child.level') }}</span>
        <span class="text-green-500 font-semibold ml-1">{{ child.level }} ⬆️ </span>
      </div>
    </div>

    <!-- Boutons -->
    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
      <button
        class="text-sm text-red-500 hover:text-red-700 transition"
        @click="onRemove"
      >
        <TrashIcon class="w-4 h-4 inline" />
        {{ $t('form.delete') }}
      </button>

      <button
        class="bg-purple-600 text-white text-sm px-4 py-1.5 rounded hover:bg-purple-700"
        :disabled="isPending"
        @click="onSubmit"
      >
        {{ $t('form.save') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { toTypedSchema } from '@vee-validate/zod'

import { childUpdateSchema } from '~/types/child'
import type { Child, ChildUpdate } from '~/types/child'

const { avatarColors, useDeleteChildMutation, useUpdateChildMutation } = useChild()
const user = useSupabaseUser()

const { mutate: deleteChild } = useDeleteChildMutation(user)
const { mutate: updateChild, isPending } = useUpdateChildMutation(user)

const props = defineProps<{
  child: Child
}>()

const child = toRef(props, 'child')

const { values, handleSubmit } = useForm<ChildUpdate>({
  validationSchema: toTypedSchema(childUpdateSchema),
  initialValues: {
    ...child.value,
  },
})

const { value: name, errorMessage: nameErrorMessage } = useField<string>('name')
const { value: avatarColor } = useField<string>('avatar_color')

const fadeBackgroundStyle = computed(() => {
  const colorMap: Record<string, string> = {
    red: 'rgba(239, 68, 68, 0.07)', // Tailwind red-500
    blue: 'rgba(59, 130, 246, 0.07)', // Tailwind blue-500
    green: 'rgba(34, 197, 94, 0.07)', // Tailwind green-500
    yellow: 'rgba(234, 179, 8, 0.07)', // Tailwind yellow-500
    purple: 'rgba(168, 85, 247, 0.07)', // Tailwind purple-500
    pink: 'rgba(236, 72, 153, 0.07)', // Tailwind pink-500
    gray: 'rgba(107, 114, 128, 0.07)', // Tailwind gray-500
    orange: 'rgba(249, 115, 22, 0.07)', // Tailwind orange-500
  }

  return {
    backgroundColor: colorMap[avatarColor.value] ?? 'rgba(0,0,0,0.03)',
  }
})

const onSubmit = handleSubmit(() => {
  updateChild({
    ...child.value,
    ...values,
  })
})

const onRemove = () => {
  if (!child.value.id) return
  deleteChild(child.value.id)
}
</script>
