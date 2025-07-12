<template>
  <div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow space-y-6">
    <h1 class="text-2xl font-bold text-center text-purple-600">
      {{ $t('signup.title') }}
    </h1>

    <form
      class="space-y-4"
      @submit.prevent="onSubmit"
    >
      <!-- Email -->
      <div>
        <input
          v-model="email"
          type="email"
          :placeholder="$t('signup.email')"
          :class="[
            'w-full border rounded p-2 focus:outline-none focus:ring-2',
            errors.email ? 'border-red-500 ring-red-300' : 'focus:ring-purple-400',
          ]"
        >
        <p
          v-if="errors.email"
          class="text-red-500 text-sm mt-1"
        >
          {{ errors.email }}
        </p>
      </div>

      <!-- Password -->
      <div>
        <InputPassword
          v-model="password"
          :placeholder="$t('signup.password')"
          :class="{ 'ring-red-300': errors.password }"
        />
        <p
          v-if="errors.password"
          class="text-red-500 text-sm mt-1"
        >
          {{ errors.password }}
        </p>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading || emailSent"
      >
        {{ emailSent ? $t('signup.checkEmail') : (loading ? $t('signup.loading') : $t('signup.submit')) }}
      </button>
    </form>

    <p
      v-if="emailSent"
      class="text-green-700 bg-green-100 border border-green-300 rounded p-3 text-center text-base flex items-center justify-center gap-2 mt-4 animate-fadeIn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
      {{ $t('signup.emailSent') }}
    </p>

    <p class="text-sm text-center">
      {{ $t('signup.alreadyAccount') }}
      <NuxtLink
        to="/login"
        class="text-purple-600 underline hover:opacity-80"
      >
        {{ $t('signup.loginLink') }}
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '#imports'

const { t } = useI18n()
const loading = ref(false)
const emailSent = ref(false)
const { signup } = useAuth()

// Schema simplifié
const schema = z.object({
  email: z.string().email(t('signup.errors.email')),
  password: z.string().min(8, t('signup.errors.password')),
})

const { handleSubmit, errors } = useForm({ validationSchema: toTypedSchema(schema) })

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await signup(values.email, values.password)
    emailSent.value = true
  }
  catch (err) {
    console.error('Erreur signup:', err)
  }
  finally {
    loading.value = false
  }
})

definePageMeta({ layout: 'auth' })
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in forwards;
}
</style>
