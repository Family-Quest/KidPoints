<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-6">
    <h1 class="text-2xl font-bold text-center text-purple-600">
      {{ $t('onboarding.title') }}
    </h1>

    <!-- Formulaire principal -->
    <form @submit.prevent="submit" class="space-y-6">
      <!-- Champ nom -->
      <div>
        <input
          v-model="lastName"
          :placeholder="$t('onboarding.lastName')"
          class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      <!-- Liste enfants -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-purple-500">
          {{ $t('onboarding.childrenTitle') }}
        </h2>

        <div
          v-for="(child, index) in childrens"
          :key="index"
          class="border p-4 rounded bg-gray-50 space-y-2 flex gap-2"
        >
          <input
            v-model="child.name"
            :placeholder="$t('onboarding.childName')"
            class="border rounded p-2 flex-1"
          />
          <select
            v-model="child.avatar_color"
            class="border rounded p-2"
          >
            <option
              v-for="color in avatarColors"
              :key="color.value"
              :value="color.value"
            >
              {{ color.label }}
            </option>
          </select>
          <button
            type="button"
            @click="removeChild(index)"
            class="text-sm text-red-500"
          >
            {{ $t('onboarding.removeChild') }}
          </button>
        </div>

        <button
          type="button"
          class="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded"
          @click="addChild"
        >
          + {{ $t('onboarding.addChild') }}
        </button>
      </div>

      <!-- Bouton submit -->
      <button
        type="submit"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
        :disabled="loading"
      >
        {{ $t('onboarding.save') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '~/composables/useUser'
import type { ChildrenInsert } from '~/types/children'

const { updateUserProfile, loading, getUserProfile } = useUser()
const { avatarColors, addChildrens } = useChildren()

const userProfile = await getUserProfile()
const lastName = ref(userProfile.name || '')
const childrens = ref<ChildrenInsert[]>([
  { name: '', avatar_color: 'red', points: 0, level: 1, user_id: userProfile.id }
])

const addChild = () => {
  childrens.value.push({ name: '', avatar_color: 'red', points: 0, level: 1, user_id: userProfile.id })
}

const removeChild = (index: number) => {
  childrens.value.splice(index, 1)
}

const submit = async () => {
  try {
    // Mise à jour du profil utilisateur
    await updateUserProfile({ name: lastName.value })
    // Send only not empty children
    const validChildrens = childrens.value.filter(child => child.name.trim() !== '')
    // Ajout des enfants
    await addChildrens(validChildrens)
    navigateTo('/dashboard')
  } catch (err: any) {
    console.error(err)
    alert(err.message)
  }
}

definePageMeta({
  middleware: 'auth',
  layout: 'parent',
})
</script>
