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

onMounted(async () => {
  const user = useSupabaseUser()
  const familyStore = useFamilyStore()

  if (!user.value) return

  if (!familyStore.id) {
    const { useFamilyQuery } = useFamily()
    const { data: family } = await useFamilyQuery(user).refetch()

    if (family?.id) {
      familyStore.setId(family.id)
      familyStore.setCode(family.join_code)
      familyStore.setName(family.name)
    }
  }
})
</script>
