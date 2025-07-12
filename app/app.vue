<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
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
    }
  }
})
</script>
