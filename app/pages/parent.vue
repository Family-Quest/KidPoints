<template>
  <div class="max-w-4xl mx-auto mt-10 space-y-8">
    <!-- Profil Parent -->
    <div class="bg-white shadow rounded-xl p-6">
      <h2 class="text-xl font-bold text-purple-700 mb-4">
        {{ $t('parent.profile') }}
      </h2>
      <form
        class="space-y-4"
        @submit.prevent="submitProfile"
      >
        <div>
          <label class="block text-sm text-gray-600">{{ $t('form.name') }}</label>
          <input
            v-model="name"
            class="w-full border p-2 rounded"
          >
        </div>
        <div>
          <label class="block text-sm text-gray-600">{{ $t('form.language') }}</label>
          <select
            v-model="language"
            class="w-full border p-2 rounded"
          >
            <option value="fr">
              Français
            </option>
            <option value="en">
              English
            </option>
          </select>
        </div>
        <button
          type="submit"
          class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {{ $t('form.save') }}
        </button>
      </form>
    </div>

    <!-- Enfants -->
    <div class="bg-white shadow rounded-xl p-6">
      <h2 class="text-xl font-bold text-purple-700 mb-4">
        {{ $t('parent.children') }}
      </h2>
      <form
        class="space-y-4"
        @submit.prevent="addChild"
      >
        <input
          v-model="newChild.name"
          class="w-full border p-2 rounded"
          :placeholder="$t('form.childName')"
        >
        <button class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          {{ $t('form.add') }}
        </button>
      </form>
      <ul class="mt-4 space-y-2">
        <li
          v-for="child in children"
          :key="child.id"
          class="flex justify-between items-center bg-gray-100 p-2 rounded"
        >
          <span>{{ child.name }}</span>
          <button
            class="text-sm text-red-500 hover:underline"
            @click="removeChild(child.id)"
          >
            {{ $t('form.delete') }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Tâches (lecture seule pour l'instant) -->
    <div class="bg-white shadow rounded-xl p-6">
      <h2 class="text-xl font-bold text-purple-700 mb-4">
        {{ $t('parent.tasks') }}
      </h2>
      <ul class="space-y-2">
        <li
          v-for="task in tasks"
          :key="task.id"
          class="p-2 bg-gray-100 rounded"
        >
          <strong>{{ task.title }}</strong> — {{ task.points }} pts
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTask } from '~/composables/useTask'
import type { Children } from '~/types/children'
import type { Task } from '~/types/task'

const { getUserProfile, updateUserProfile } = useUser()
const { getChildrens, addChildrens, deleteChildren } = useChildren()
const { getUserTasks } = useTask()

const name = ref('')
const language = ref('fr')
const children = ref<Children[]>([])
const tasks = ref<Task[]>([])
const newChild = ref({ name: '' })
const user = await getUserProfile()

const loadData = async () => {
  name.value = user.name
  language.value = user.language || 'fr'
  children.value = await getChildrens(user.id)
  tasks.value = await getUserTasks(user.id)
}

const submitProfile = async () => {
  await updateUserProfile({ name: name.value, language: language.value })
  await loadData()
}

const addChild = async () => {
  if (!newChild.value.name) return
  await addChildrens([{ name: newChild.value.name, user_id: user.id, level: 1, points: 0 }])
  newChild.value.name = ''
  await loadData()
}

const removeChild = async (id: string) => {
  await deleteChildren(id)
  await loadData()
}

onMounted(() => {
  loadData()
})

definePageMeta({ middleware: 'auth', layout: 'parent' })
</script>
