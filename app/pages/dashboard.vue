<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4">
    <h1 class="text-2xl font-bold text-purple-600">
      {{ $t('dashboard.title') }}
    </h1>

    <div v-if="loading" class="text-gray-500">
      {{ $t('dashboard.loading') }}
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ $t('dashboard.error') }}
    </div>

    <div v-else-if="profile" class="space-y-2">
      <p><strong>{{ $t('dashboard.name') }}:</strong> {{ profile.name }}</p>
      <p><strong>{{ $t('dashboard.email') }}:</strong> {{ profile.email }}</p>
    </div>

    <ul>
      <li v-for="child in childrens || []" :key="child.id" class="border p-4 rounded bg-gray-50 flex flex-col gap-2">
        <p><strong>{{ $t('dashboard.childName') }}:</strong> {{ child.name }}</p>
        <p><strong>{{ $t('dashboard.childPoints') }}:</strong> {{ child.points }}</p>
        <p><strong>{{ $t('dashboard.childLevel') }}:</strong> {{ child.level }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '~/composables/useUser'
import type { Children } from '~/types/children'
import type { User } from '~/types/user'

const { getUserProfile } = useUser()
const { getChildrens } = useChildren()

const profile = ref<User & { email: string | undefined } | null>(null)
const childrens = ref<Children[] | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const authUser = useSupabaseUser()
    const userProfile = await getUserProfile()
    childrens.value = await getChildrens(userProfile.id)
    profile.value = { ...userProfile, email: authUser.value?.email || undefined }
  } catch (err: any) {
    error.value = err.message || 'Erreur inconnue'
  } finally {
    loading.value = false
  }
})

definePageMeta({ middleware: 'auth', layout: 'parent' })
</script>
