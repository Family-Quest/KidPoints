<template>
  <div class="max-w-5xl flex flex-col md:flex-row gap-4 md:justify-center">
    <!-- Profil du parent -->
    <section class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-bold text-purple-600 mb-4">
        {{ $t('dashboard.parentInfo') }}
      </h2>
      <div
        v-if="isLoadingParent"
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
        <p><strong>{{ $t('dashboard.name') }}:</strong> {{ parent?.name }}</p>
        <p><strong>{{ $t('dashboard.email') }}:</strong> {{ user?.email }}</p>
        <p><strong>{{ $t('dashboard.language') }}:</strong> {{ $t(`language.${parent?.language}`) || $t('dashboard.unknown') }}</p>
      </div>
    </section>

    <!-- Liste des enfants -->
    <section class="bg-white rounded-xl shadow p-6 md:min-w-[300px]">
      <h2 class="text-xl font-bold text-purple-600 mb-4">
        {{ $t('dashboard.childrenTitle') }}
      </h2>
      <div
        v-if="isLoadingChildren"
        class="text-gray-500"
      >
        {{ $t('dashboard.loading') }}
      </div>
      <div
        v-else-if="children?.length === 0"
        class="text-gray-500 italic"
      >
        {{ $t('dashboard.noChildren') }}
      </div>

      <div class="grid gap-4">
        <div
          v-for="child in children"
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
const { useParentQuery } = useParent()
const { useChildrenQuery } = useChild()

const user = useSupabaseUser()

const { data: parent, isLoading: isLoadingParent, error: errorParent } = useParentQuery(user)
const { data: children, isLoading: isLoadingChildren, error: errorChildren } = useChildrenQuery(user)

const error = computed(() => errorParent.value?.message || errorChildren.value?.message || null)

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

definePageMeta({ middleware: 'auth', layout: 'parent' })
</script>
