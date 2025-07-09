<template>
  <div
    class="p-5 rounded-2xl shadow-md relative transition-all duration-300 border border-gray-100 bg-gradient-to-br from-purple-50 to-white hover:shadow-xl space-y-4"
  >
    <!-- Titre -->
    <input
      v-model="title"
      :placeholder="$t('task.title')"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold text-gray-700 shadow-inner"
    >

    <!-- Description -->
    <textarea
      v-model="description"
      :placeholder="$t('task.description')"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-sm text-gray-600 shadow-inner"
      rows="3"
    />

    <!-- Statut -->
    <label class="flex items-center gap-2">
      <TaskStatusIcon :status="status" />
      <select
        v-model="status"
        class="px-2 py-1 border border-gray-300 rounded bg-white"
      >
        <option value="todo">{{ $t('task.status_todo') }}</option>
        <option value="in_progress">{{ $t('task.status_in_progress') }}</option>
        <option value="done">{{ $t('task.status_done') }}</option>
      </select>
    </label>

    <!-- Points -->
    <label class="flex items-center gap-2">
      <input
        v-model.number="points"
        type="number"
        min="0"
        class="w-16 px-2 py-1 border border-gray-300 rounded text-center"
      >
      <span>{{ $t('task.points') }}</span>
      <span class="text-purple-500 font-semibold">⭐</span>
    </label>

    <!-- Boutons -->
    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
      <button
        class="text-sm text-red-500 hover:text-red-700 transition"
        @click="onRemove"
      >
        <TrashIcon class="w-4 h-4 inline" />
        {{ $t('form.delete') }}
      </button>

      <button
        class="bg-purple-600 text-white text-sm px-4 py-1.5 rounded hover:bg-purple-700 transition"
        :disabled="isPending"
        @click="onSubmit"
      >
        {{ $t('form.save') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/solid'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import { taskUpdateSchema } from '~/types/task'
import type { Task, TaskUpdate } from '~/types/task'

const { useUpdateTaskMutation, useDeleteTaskMutation } = useTask()
const user = useSupabaseUser()

const props = defineProps<{
  task: Task
}>()

const task = toRef(props, 'task')

const { mutate: updateTask, isPending } = useUpdateTaskMutation(user)
const { mutate: deleteTask } = useDeleteTaskMutation(user)

const { values, handleSubmit } = useForm<TaskUpdate>({
  validationSchema: toTypedSchema(taskUpdateSchema),
  initialValues: { ...task.value },
})

const { value: title } = useField<string>('title')
const { value: description } = useField<string>('description')
const { value: points } = useField<number>('points')
const { value: status } = useField<'todo' | 'in_progress' | 'done'>('status')

const onSubmit = handleSubmit(() => {
  updateTask({
    ...task.value,
    ...values,
  })
})

const onRemove = () => {
  if (!task.value.id) return
  deleteTask(task.value.id)
}
</script>
