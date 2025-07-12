<template>
  <footer class="bg-purple-50 text-gray-600 text-sm py-4 mt-12 border-t">
    <div class="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center sm:gap-0 gap-2">
      <!-- Bloc gauche -->
      <div class="sm:w-1/3 text-center sm:text-left">
        <p>© {{ year }} KidPoints. {{ $t('footer.rights') }}</p>
      </div>

      <!-- Bloc centre : version + lien -->
      <div class="sm:w-1/3 text-center text-gray-400 text-xs flex items-center justify-center gap-1">
        <a
          href="https://github.com/mon-org/kidpoints"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577v-2.04c-3.338.726-4.033-1.61-4.033-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.082-.73.082-.73 1.205.086 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.76-1.604-2.665-.3-5.466-1.334-5.466-5.932 0-1.31.467-2.382 1.235-3.222-.123-.302-.535-1.522.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.655 1.654.243 2.874.12 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.805 5.628-5.475 5.922.43.37.823 1.102.823 2.222v3.293c0 .32.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          <span>v{{ version }}</span>
        </a>
      </div>

      <!-- Bloc droite -->
      <div class="sm:w-1/3 text-center sm:text-right">
        <NuxtLink
          to="/about"
          class="hover:underline"
        >
          {{ $t('footer.about') }}
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
const config = useRuntimeConfig()
const version = config.public.version
</script>
