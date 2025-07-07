<template>
  <header class="bg-purple-600 text-white shadow-md">
    <div class="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
      <NuxtLink
        to="/"
        class="text-2xl font-bold tracking-tight hover:opacity-90"
      >
        KidPoints
      </NuxtLink>

      <nav class="flex items-center gap-4 text-sm">
        <NuxtLink
          to="/"
          class="hover:underline"
        >Accueil</NuxtLink>

        <template v-if="user">
          <NuxtLink
            to="/dashboard"
            class="hover:underline"
          >Dashboard</NuxtLink>
          <button
            class="bg-white text-purple-600 px-3 py-1 rounded hover:bg-purple-100"
            @click="onLogout"
          >
            Déconnexion
          </button>
        </template>

        <template v-else>
          <NuxtLink
            to="/login"
            class="hover:underline"
          >Connexion</NuxtLink>
          <NuxtLink
            to="/signup"
            class="hover:underline"
          >Créer un compte</NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const { logout } = useAuth()

const onLogout = async () => {
  try {
    await logout()
    navigateTo('/login')
  }
  catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>
