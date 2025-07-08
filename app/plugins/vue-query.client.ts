// plugins/vue-query.client.ts
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient()

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
  })

  console.log('[VueQuery] plugin loaded')
})
