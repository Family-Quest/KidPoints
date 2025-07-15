<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster
      rich-colors
      close-button
    />
    <ClientOnly>
      <VueQueryDevtools :initial-is-open="false" />
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>
