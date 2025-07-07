<template>
  <div class="text-center space-y-6">
    <h1 class="text-3xl font-bold text-purple-700">Bienvenue sur KidPoints !</h1>

    <p class="text-gray-700 max-w-xl mx-auto">
      Suivez les tâches de vos enfants, attribuez des points, faites-les évoluer par niveaux… le tout de manière ludique 🌟
    </p>

    <div>
      <NuxtLink
        v-if="user"
        to="/dashboard"
        class="inline-block bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
      >
        Accéder au tableau de bord
      </NuxtLink>

      <NuxtLink
        v-else
        to="/login"
        class="inline-block bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
      >
        Se connecter
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
definePageMeta({
  layout: 'parent',
})
</script>
