import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.dev) {
    const { VueQueryDevtools } = await import('@tanstack/vue-query-devtools')
    nuxtApp.vueApp.component('VueQueryDevtools', VueQueryDevtools)
  }
})
