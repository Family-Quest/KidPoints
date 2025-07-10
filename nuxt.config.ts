// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
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
  supabase: {
    redirect: false,
  },
})
