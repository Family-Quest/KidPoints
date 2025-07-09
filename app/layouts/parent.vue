<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <AppHeader />

    <main class="flex-1 p-6 max-w-5xl mx-auto w-full">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '~/components/app/AppHeader.vue'
import AppFooter from '~/components/app/AppFooter.vue'
</script>
