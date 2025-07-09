<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 px-6 py-12">
    <div class="max-w-5xl mx-auto text-center space-y-10">
      <!-- Logo / Titre -->
      <h1 class="text-5xl font-bold text-purple-700 font-title">
        {{ $t('home.title') }}
      </h1>

      <!-- Sous-titre -->
      <p class="text-xl text-gray-700 max-w-2xl mx-auto">
        {{ $t('home.subtitle') }}
      </p>

      <!-- Illustration -->
      <img
        src="/images/kids_welcome.svg"
        alt="Enfants heureux"
        class="w-full max-w-md mx-auto drop-shadow-md"
      >

      <!-- Appels à l'action -->
      <div class="flex justify-center gap-4 flex-wrap">
        <NuxtLink
          to="/signup"
          class="btn-primary"
        >
          {{ $t('home.cta_register') }}
        </NuxtLink>
        <NuxtLink
          to="/login"
          class="btn-secondary"
        >
          {{ $t('home.cta_login') }}
        </NuxtLink>
      </div>

      <!-- Avantages -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
        <div class="bg-white rounded-2xl shadow p-6">
          <img
            src="/icons/star.svg"
            class="w-10 h-10 mx-auto mb-4"
          >
          <h3 class="font-bold text-lg text-purple-700">
            {{ $t('home.features.rewards') }}
          </h3>
          <p class="text-gray-600 text-sm">
            {{ $t('home.features.rewards_desc') }}
          </p>
        </div>
        <div class="bg-white rounded-2xl shadow p-6">
          <img
            src="/icons/tasks.svg"
            class="w-10 h-10 mx-auto mb-4"
          >
          <h3 class="font-bold text-lg text-purple-700">
            {{ $t('home.features.tasks') }}
          </h3>
          <p class="text-gray-600 text-sm">
            {{ $t('home.features.tasks_desc') }}
          </p>
        </div>
        <div class="bg-white rounded-2xl shadow p-6">
          <img
            src="/icons/parent.svg"
            class="w-10 h-10 mx-auto mb-4"
          >
          <h3 class="font-bold text-lg text-purple-700">
            {{ $t('home.features.parents') }}
          </h3>
          <p class="text-gray-600 text-sm">
            {{ $t('home.features.parents_desc') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'parent',
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600&display=swap');

.font-title {
  font-family: 'Baloo 2', cursive;
}
.btn-primary {
  @apply bg-purple-600 text-white px-6 py-3 rounded-xl shadow hover:bg-purple-700 transition;
}
.btn-secondary {
  @apply border border-purple-600 text-purple-700 px-6 py-3 rounded-xl hover:bg-purple-100 transition;
}
</style>
