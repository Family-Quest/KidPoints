<template>
  <div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow space-y-6">
    <h1 class="text-2xl font-bold text-center text-purple-600">
      {{ $t('onboarding.title') }}
    </h1>

    <!-- Nom du parent -->
    <div>
      <input
        v-model="parentName"
        type="text"
        :placeholder="$t('onboarding.name_placeholder')"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
      <p
        v-if="parentNameErrorMessage"
        class="text-red-500 text-sm mt-1"
      >
        {{ $t(parentNameErrorMessage) }}
      </p>
    </div>

    <!-- Onglets pour choisir le mode -->
    <div class="flex justify-center border-b border-gray-300 mb-2">
      <button
        type="button"
        :class="[
          'px-6 py-2 -mb-px font-semibold text-sm transition',
          mode === 'create'
            ? 'border-b-4 border-purple-600 text-purple-600'
            : 'text-gray-500 hover:text-purple-600',
        ]"
        @click="mode = 'create'"
      >
        {{ $t('onboarding.create') }}
      </button>
      <button
        type="button"
        :class="[
          'px-6 py-2 -mb-px font-semibold text-sm transition',
          mode === 'join'
            ? 'border-b-4 border-purple-600 text-purple-600'
            : 'text-gray-500 hover:text-purple-600',
        ]"
        @click="mode = 'join'"
      >
        {{ $t('onboarding.join') }}
      </button>
    </div>

    <!-- Famille - création -->
    <div v-if="mode === 'create'">
      <input
        v-model="familyName"
        type="text"
        :placeholder="$t('onboarding.family_name_placeholder')"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
      <p
        v-if="familyNameErrorMessage"
        class="text-red-500 text-sm mt-1"
      >
        {{ $t(familyNameErrorMessage) }}
      </p>
    </div>

    <!-- Famille - rejoindre -->
    <div v-if="mode === 'join'">
      <div class="flex items-center w-full border rounded overflow-hidden focus-within:ring-2 focus-within:ring-purple-400">
        <span class="bg-gray-100 px-3 py-2 text-sm text-gray-600 font-mono select-none">
          FAMILY-
        </span>
        <input
          v-model="joinCode"
          type="text"
          maxlength="8"
          :placeholder="$t('onboarding.code_placeholder')"
          class="flex-1 px-3 py-2 text-sm uppercase placeholder-gray-400 focus:outline-none uppercase"
        >
      </div>
      <p
        v-if="joinCodeErrorMessage"
        class="text-red-500 text-sm mt-1"
      >
        {{ $t(joinCodeErrorMessage) }}
      </p>
    </div>

    <!-- Validation -->
    <button
      class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
      @click="onSubmit"
    >
      {{ $t('onboarding.submit') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { parentOnboardingSchema } from '~/types/parent'
import type { ParentOnboarding } from '~/types/parent'

const user = useSupabaseUser()
const { useParentMutation } = useParent()
const { useCreateFamilyMutation, useJoinFamilyMutation } = useFamily()
const familyStore = useFamilyStore()

const { mutateAsync: updateParent } = useParentMutation(user)
const { mutateAsync: createFamily } = useCreateFamilyMutation(user)
const { mutateAsync: joinFamily } = useJoinFamilyMutation(user)

// Formulaires distincts
const { handleSubmit, values } = useForm<ParentOnboarding>({
  validationSchema: toTypedSchema(parentOnboardingSchema),
  initialValues: {
    mode: 'create',
    familyName: '',
    joinCode: '',
    parentName: '',
  },
})

const { value: mode } = useField<string>('mode')
const { value: familyName, errorMessage: familyNameErrorMessage } = useField<string>('familyName')
const { value: joinCode, errorMessage: joinCodeErrorMessage } = useField<string>('joinCode')
const { value: parentName, errorMessage: parentNameErrorMessage } = useField<string>('parentName')

// Redirection si déjà onboardé
onMounted(() => {
  if (familyStore.id && user.value) {
    navigateTo('/family')
  }
})

// Soumission générique
const onSubmit: ReturnType<typeof handleSubmit> = handleSubmit(async () => {
  try {
    await updateParent({ name: parentName.value })

    if (mode.value === 'create') {
      await createFamily({ familyName: values.familyName })
    }
    else {
      await joinFamily({ code: values.joinCode.toUpperCase() })
    }

    if (mode.value === 'create') {
      await navigateTo('/family')
    }
    else {
      await navigateTo('/dashboard')
    }
  }
  catch (error) {
    console.error('Erreur lors de la soumission:', error)
  }
})

definePageMeta({ layout: 'auth' })
</script>
