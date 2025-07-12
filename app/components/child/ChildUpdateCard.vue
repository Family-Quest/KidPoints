<template>
  <div
    class="p-5 rounded-2xl shadow-md relative hover:shadow-lg transition-shadow space-y-4 border border-gray-100"
    :style="getAvatarFadeBg(child.avatar_color as AvatarColor)"
  >
    <!-- Nom de l’enfant -->
    <div>
      <input
        v-model="name"
        :placeholder="$t('child.name')"
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
        :key="color"
        :style="getAvatarFadeBg(color)"
        :value="color"
      >
        {{ $t(`colors.${color}`) }}
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

import { avatarColors, childUpdateSchema, getAvatarFadeBg } from '~/types/child'
import type { AvatarColor, Child, ChildUpdate } from '~/types/child'

const { useDeleteChildMutation, useUpdateChildMutation } = useChild()
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
