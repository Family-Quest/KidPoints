<template>
  <div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow space-y-6">
    <h1 class="text-2xl font-bold text-center text-purple-600">
      {{ $t('auth.login_title') }}
    </h1>

    <form
      class="space-y-4"
      @submit.prevent="handleLogin"
    >
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >

      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >

      <button
        type="submit"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
        :disabled="loading"
      >
        {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
      </button>
    </form>

    <p class="text-sm text-center">
      {{ $t('auth.no_account') }}
      <NuxtLink
        to="/signup"
        class="text-purple-600 underline hover:opacity-80"
      >
        {{ $t('auth.signup') }}
      </NuxtLink>
    </p>

    <p
      v-if="error"
      class="text-red-500 text-center"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/database'

const familyStore = useFamilyStore()
const supabase = useSupabaseClient<Database>()

const user = useSupabaseUser()

onMounted(async () => {
  if (user.value) navigateTo('/dashboard')
})

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const { login } = useAuth()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await login(email.value, password.value)
    if (!familyStore.id) {
      await loadFamilyData()
    }
    navigateTo('/dashboard')
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    }
    else {
      error.value = 'Erreur lors de la connexion.'
    }
  }
  finally {
    loading.value = false
  }
}

async function loadFamilyData() {
  if (!user.value?.id) return
  const { data, error } = await supabase
    .from('families')
    .select('*, family_parents!inner(*)')
    .eq('family_parents.parent_id', user.value?.id)
    .maybeSingle()

  if (error) throw error
  if (data) {
    familyStore.setId(data.id)
    familyStore.setCode(data.join_code)
    familyStore.setName(data.name)
  }
}

definePageMeta({ layout: 'auth' })
</script>
