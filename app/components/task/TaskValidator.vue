<template>
  <div>
    <!-- Bouton de validation -->
    <button
      class="flex items-center gap-2 px-3 py-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition border border-green-700"
      :title="$t('task.validate')"
      @click="openConfirm = true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span>{{ $t('task.validate_short') || 'Valider' }}</span>
    </button>

    <!-- Modal de confirmation -->
    <AppModal v-model="openConfirm">
      <template #title>
        {{ $t('task.validate_confirm_title') }}
      </template>

      <p class="mb-4">
        {{ $t('task.validate_confirm_message') }}
      </p>

      <div class="flex justify-end gap-4">
        <button
          class="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          @click="openConfirm = false"
        >
          {{ $t('cancel') }}
        </button>
        <button
          :disabled="loading"
          class="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          @click="onValidateTask"
        >
          {{ loading ? ($t('validating')) : ($t('confirm')) }}
        </button>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import type { TaskAssignment } from '~/types/task'

const props = defineProps<{
  task: TaskAssignment
}>()

const { useValidateTaskMutation } = useTask()
const user = useSupabaseUser()
const { mutate: validateTask } = useValidateTaskMutation(user)

const openConfirm = ref(false)
const loading = ref(false)

function onValidateTask() {
  loading.value = true
  validateTask(props.task.id, {
    onSettled() {
      loading.value = false
      openConfirm.value = false
    },
  })
}
</script>
