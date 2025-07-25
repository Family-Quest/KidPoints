// plugins/vue-sonner.ts
import { defineNuxtPlugin } from '#app'
import { Toaster } from 'vue-sonner'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Toaster', Toaster)
})
