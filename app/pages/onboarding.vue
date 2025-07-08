<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-6">
    <h1 class="text-2xl font-bold text-center text-purple-600">
      {{ $t('onboarding.title') }}
    </h1>

    <form
      class="space-y-6"
      @submit.prevent="submit"
    >
      <!-- Champ nom -->
      <div>
        <input
          v-model="parent.name"
          :placeholder="$t('onboarding.lastName')"
          class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
      </div>

      <!-- Liste enfants -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-purple-500">
          {{ $t('onboarding.childrenTitle') }}
        </h2>

        <div
          v-for="(child, index) in childrens"
          :key="index"
          class="border p-4 rounded bg-gray-50 space-y-2 flex gap-2"
        >
          <input
            v-model="child.value.name"
            :placeholder="$t('onboarding.childName')"
            class="border rounded p-2 flex-1"
          >
          <select
            v-model="child.value.avatar_color"
            class="border rounded p-2"
          >
            <option
              v-for="color in avatarColors"
              :key="color.value"
              :value="color.value"
            >
              {{ color.label }}
            </option>
          </select>
          <button
            type="button"
            class="text-sm text-red-500"
            @click="removeChild(index)"
          >
            {{ $t('onboarding.removeChild') }}
          </button>
        </div>

        <button
          type="button"
          class="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded"
          @click="addChild"
        >
          + {{ $t('onboarding.addChild') }}
        </button>
      </div>

      <!-- Bouton submit -->
      <button
        type="submit"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
        :disabled="isPending"
      >
        {{ $t('onboarding.save') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useFieldArray, useForm } from 'vee-validate'
import { z } from 'zod'
import { childrensInsertSchema } from '~/types/children'
import type { ChildrenInsert } from '~/types/children'
import { parentUpdateSchema } from '~/types/parent'
import type { ParentUpdate } from '~/types/parent'

const { useParentMutation, useParentQuery } = useParent()
const { avatarColors, useAddChildrenMutation, useChildrenQuery } = useChildren()

const user = useSupabaseUser()
const { data: currentParent } = useParentQuery(user)
const { data: currentChildrens } = useChildrenQuery(user)
const { mutate: mutateParent, isPending: isPendingParent } = useParentMutation(user)
const { mutate: mutateChildrens, isPending: isPendingChildrens } = useAddChildrenMutation(user)

const isPending = computed(() => isPendingParent.value || isPendingChildrens.value)

const defaultParent = computed(() => ({
  name: currentParent.value?.name ?? '',
  language: currentParent.value?.language ?? 'fr',
}))

const defaultChildrens = computed(() => currentChildrens.value ?? [])

const schema = z.object({
  parent: parentUpdateSchema.required(),
  childrens: z.array(childrensInsertSchema).default([]),
})

type FormSchema = z.infer<typeof schema>

const { values, handleSubmit } = useForm<FormSchema>({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    parent: {
      name: defaultParent.value.name,
      language: defaultParent.value.language,
    },
    childrens: defaultChildrens.value,
  },
})
const { fields: childrens, remove, push } = useFieldArray<ChildrenInsert>('childrens')
const { value: parent } = useField<ParentUpdate>('parent')

const addChild = () => {
  if (!currentParent.value) return
  push({ name: '', avatar_color: 'red', points: 0, level: 1, user_id: currentParent.value.id })
}

const removeChild = (index: number) => {
  remove(index)
}

const submit = handleSubmit(() => {
  const validChildrens = values.childrens.filter(child => child.name.trim() !== '')
  mutateChildrens(validChildrens)
  mutateParent(values.parent)
  navigateTo('/dashboard')
})

definePageMeta({
  middleware: 'auth',
  layout: 'parent',
})
</script>
