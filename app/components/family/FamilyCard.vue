<template>
  <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md mx-auto min-h-19">
    <h2 class="text-2xl font-extrabold text-purple-700 mb-6 text-center">
      {{ $t('family.title', { family: familyStore.name || '...' }) }}
    </h2>

    <div
      v-if="isLoading"
      class="text-center text-gray-400 italic"
    >
      {{ $t('dashboard.loading') }}
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <!-- Code famille -->
      <div>
        <label class="block mb-1 font-semibold text-gray-700">
          {{ $t('family.code') }}
        </label>
        <div class="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 gap-4">
          <span class="font-mono text-purple-700 font-semibold text-lg">{{ familyStore.code }}</span>
          <button
            class="text-sm text-purple-600 hover:text-purple-800 transition font-medium"
            @click="copyCode"
          >
            <component
              :is="copied ? CheckIcon : ClipboardIcon"
              class="w-5 h-5"
            />
          </button>
        </div>
      </div>

      <!-- Liste des parents -->
      <div>
        <label class="block mb-2 font-semibold text-gray-700">
          {{ $t('family.members') }}
        </label>

        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <li
            v-for="parent in parents"
            :key="parent.id"
            class="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm"
          >
            <div class="text-purple-600 text-xl">
              👤
            </div>
            <span class="font-medium text-gray-800 truncate">
              {{ parent.name }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { ClipboardIcon, CheckIcon } from '@heroicons/vue/24/outline'

const user = useSupabaseUser()
const { useParentsByFamilyQuery } = useParent()
const { data: parents, isLoading } = useParentsByFamilyQuery(user)
const familyStore = useFamilyStore()

// On copie l'ID de la famille
const { copy, copied } = useClipboard()
const copyCode = () => {
  if (familyStore.code) {
    copy(familyStore.code)
  }
}
</script>
