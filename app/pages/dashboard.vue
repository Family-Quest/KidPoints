<template>
  <div class="max-w-5xl flex gap-4 justify-center">
    <!-- Profil du parent -->
    <section class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-bold text-purple-600 mb-4">
        {{ $t('dashboard.parentInfo') }}
      </h2>
      <div
        v-if="loading"
        class="text-gray-500"
      >
        {{ $t('dashboard.loading') }}
      </div>
      <div
        v-else-if="error"
        class="text-red-500"
      >
        {{ error }}
      </div>
      <div
        v-else
        class="space-y-2"
      >
        <p><strong>{{ $t('dashboard.name') }}:</strong> {{ userProfile?.name }}</p>
        <p><strong>{{ $t('dashboard.email') }}:</strong> {{ userProfile?.email }}</p>
        <p><strong>{{ $t('dashboard.language') }}:</strong> {{ $t(`language.${userProfile?.language}`) || $t('dashboard.unknown') }}</p>
      </div>
    </section>

    <!-- Liste des enfants -->
    <section class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-bold text-purple-600 mb-4">
        {{ $t('dashboard.childrenTitle') }}
      </h2>

      <div
        v-if="childrens.length === 0"
        class="text-gray-500 italic"
      >
        {{ $t('dashboard.noChildren') }}
      </div>

      <div class="grid gap-4 min-[]">
        <div
          v-for="child in childrens"
          :key="child.id"
          class="border rounded-lg p-4 shadow hover:shadow-md transition"
        >
          <div class="flex items-center space-x-3 mb-2">
            <div
              class="w-8 h-8 rounded-full border"
              :style="{ backgroundColor: getColorFromName(child.avatar_color) }"
              title="Avatar color"
            />
            <h3 class="font-semibold text-lg">
              {{ child.name }}
            </h3>
          </div>
          <p class="text-sm">
            {{ $t('dashboard.level') }}: {{ child.level ?? 1 }}
          </p>
          <p class="text-sm">
            {{ $t('dashboard.points') }}: {{ child.points ?? 0 }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '~/composables/useUser'
import { useChildren } from '~/composables/useChildren'
import type { UserProfile } from '~/types/user'
import type { Children } from '~/types/children'

const { getUserProfile } = useUser()
const { getChildrens } = useChildren()

const userProfile = ref<UserProfile | null>(null)
const user = useSupabaseUser()
const childrens = ref<Children[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const getColorFromName = (color: string | null) => {
  const map: Record<string, string> = {
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#FACC15',
    purple: '#A855F7',
    pink: '#EC4899',
    orange: '#F97316',
    brown: '#92400E',
    gray: '#9CA3AF',
  }
  return map[color || 'gray'] || '#D1D5DB'
}

onMounted(async () => {
  try {
    const publicUser = await getUserProfile()
    userProfile.value = {
      ...publicUser,
      email: user.value?.email || '',
    }

    const kids = await getChildrens(publicUser.id)
    childrens.value = kids
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message || 'Erreur inconnue'
    }
    else {
      error.value = 'Erreur inconnue'
    }
  }
  finally {
    loading.value = false
  }
})

definePageMeta({ middleware: 'auth', layout: 'parent' })
</script>
