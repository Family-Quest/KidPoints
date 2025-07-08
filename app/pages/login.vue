<template>
  <div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow space-y-6">
    <h1 class="text-2xl font-bold text-center text-purple-600">
      Connexion parent
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
      Pas encore de compte ?
      <NuxtLink
        to="/signup"
        class="text-purple-600 underline hover:opacity-80"
      >
        Créez un compte ici
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
const { useParentQuery } = useParent()

const user = useSupabaseUser()

const { data: parent } = useParentQuery(user)

function redirect() {
  if (!parent.value?.name) navigateTo('/onboarding')
  navigateTo('/dashboard')
}

onMounted(async () => {
  if (user.value) redirect()
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
    redirect()
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

definePageMeta({ layout: 'auth' })
</script>
