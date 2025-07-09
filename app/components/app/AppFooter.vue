<template>
  <footer class="bg-purple-50 text-gray-600 text-sm py-4 mt-12 border-t">
    <div class="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
      <p>© {{ year }} KidPoints. Tous droits réservés.</p>
      <NuxtLink
        to="/about"
        class="hover:underline"
      >À propos</NuxtLink>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
