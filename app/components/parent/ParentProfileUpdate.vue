<template>
  <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md mx-auto">
    <h2 class="text-2xl font-extrabold text-purple-700 mb-6 text-center">
      {{ $t('parent.profile') }}
    </h2>

    <div
      v-if="isLoading"
      class="text-center text-gray-400 italic"
    >
      {{ $t('dashboard.loading') }}
    </div>

    <form
      v-else
      class="space-y-6"
      @submit.prevent="submit"
    >
      <!-- Nom -->
      <div>
        <label
          class="block mb-1 font-semibold text-gray-700"
          for="name"
        >
          {{ $t('onboarding.lastName') }}
        </label>
        <input
          id="name"
          v-model="name"
          type="text"
          :placeholder="$t('onboarding.lastName')"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400
                 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-600 transition"
          autocomplete="off"
        >
        <p
          v-if="nameErrorMessage"
          class="mt-1 text-xs text-red-600 font-medium"
        >
          {{ $t(nameErrorMessage) }}
        </p>
      </div>

      <!-- Langue -->
      <div>
        <label
          class="block mb-1 font-semibold text-gray-700"
          for="language"
        >
          {{ $t('form.language') }}
        </label>
        <select
          id="language"
          v-model="language"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-600 transition"
        >
          <option
            v-for="lang in parentLanguagesValues"
            :key="lang"
            :value="lang"
            v-text="$t(`language.${lang}`)"
          />
        </select>
        <p
          v-if="languageErrorMessage"
          class="mt-1 text-sm text-red-600 font-medium"
        >
          {{ $t(languageErrorMessage) }}
        </p>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="isPending"
        class="w-full rounded-xl bg-purple-600 py-3 text-white text-lg font-semibold
               hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ $t('form.save') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { parentUpdateSchema, parentLanguagesValues } from '~/types/parent'
import type { ParentLanguages } from '~/types/parent'

const { useParentMutation, useParentQuery } = useParent()
const user = useSupabaseUser()

const { data: currentParent, isLoading, isFetched } = useParentQuery(user)
const { mutate, isPending } = useParentMutation(user)

const schema = parentUpdateSchema.required()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: name, errorMessage: nameErrorMessage } = useField<string>('name')
const { value: language, errorMessage: languageErrorMessage } = useField<ParentLanguages>('language')

const submit = handleSubmit((formValues) => {
  mutate(formValues)
})

watch(isFetched, () => {
  if (currentParent.value) {
    name.value = currentParent.value.name
    language.value = currentParent.value.language
  }
}, { immediate: true })
</script>
