<template>
  <div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow space-y-6">
    <h1 class="text-2xl font-bold text-center text-purple-600">
      {{ $t('signup.title') }}
    </h1>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Email -->
      <div>
        <input
          v-model="email"
          type="email"
          :placeholder="$t('signup.email')"
          :class="[
            'w-full border rounded p-2 focus:outline-none focus:ring-2',
            errors.email ? 'border-red-500 ring-red-300' : 'focus:ring-purple-400'
          ]"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <!-- Password -->
      <div>
        <PasswordInput
          v-model="password"
          :placeholder="$t('signup.password')"
          :class="{ 'ring-red-300': errors.password }"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
        :disabled="loading"
      >
        {{ loading ? $t('signup.loading') : $t('signup.submit') }}
      </button>
    </form>

    <p class="text-sm text-center text-gray-600" v-if="emailSent">
      {{ $t('signup.emailSent') }}
    </p>

    <p class="text-sm text-center">
      {{ $t('signup.alreadyAccount') }}
      <NuxtLink to="/login" class="text-purple-600 underline hover:opacity-80">
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
  password: z.string().min(8, t('signup.errors.password'))
})

const { handleSubmit, errors } = useForm({ validationSchema: toTypedSchema(schema) })

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await signup(values.email, values.password)
    emailSent.value = true
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

definePageMeta({ layout: 'auth' })
</script>
