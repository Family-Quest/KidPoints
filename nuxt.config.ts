// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
  ],
  ssr: false,
  devtools: {
    vueDevTools: true,
    enabled: true,
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  compatibilityDate: '2025-05-15',
  eslint: {
    config: {
      stylistic: true,
    },
  },
  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    strategy: 'no_prefix',
    defaultLocale: 'fr',
    detectBrowserLanguage: false,
    langDir: 'locales',
    locales: [
      { code: 'fr', file: 'fr.json', name: 'Français' },
      { code: 'en', file: 'en.json', name: 'English' },
    ],
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  supabase: {
    redirect: false,
  },
  tailwindcss: {
    config: {
      safelist: [
        // Task status bg + text
        'bg-red-100', 'bg-blue-100', 'bg-green-100',
        'text-red-700', 'text-blue-700', 'text-green-700',

        // Avatar colors bg + text (enfants)
        'bg-red-200', 'text-red-700',
        'bg-blue-200', 'text-blue-700',
        'bg-green-200', 'text-green-700',
        'bg-purple-200', 'text-purple-700',
        'bg-orange-200', 'text-orange-700',
        'bg-pink-200', 'text-pink-700',
        'bg-yellow-200', 'text-yellow-700',
        'bg-gray-200', 'text-gray-700',
        'bg-brown-200', 'text-brown-700',

        // Autres bg/text/hover/border/shadow etc. (ta liste actuelle)
        'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
        'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-gray-400',
        'text-white',
        'bg-gray-100', 'border-gray-300', 'text-gray-400',
        'bg-white', 'border-purple-500', 'hover:shadow-md', 'hover:border-purple-700',
        'text-purple-800', 'text-purple-600',
        'bg-gray-300', 'text-gray-600', 'hover:bg-purple-100',
        'shadow-lg', 'border',
        'bg-purple-200', 'text-purple-700', 'border-purple-300',
        'cursor-not-allowed', 'cursor-pointer',
        'rounded-full', 'rounded-md',
        'shadow-md', 'shadow-xl',
        'transition-shadow',
        'font-semibold', 'font-medium', 'font-bold',
        'capitalize', 'select-none', 'line-clamp-2',
      ],
    },
  },
})
