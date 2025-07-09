<!-- components/tasks/MixedTaskList.vue -->
<template>
  <div class="bg-white shadow rounded-2xl p-6">
    <h2 class="text-xl font-bold text-purple-700 mb-6">
      {{ $t('task.list.title') }}
    </h2>

    <!-- Chargement -->
    <div
      v-if="isLoading"
      class="flex flex-col gap-4"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="animate-pulse bg-gray-100 rounded-xl h-28"
      />
    </div>

    <!-- Tâches actives -->
    <div v-else>
      <h3 class="text-xl font-semibold mb-2 text-purple-700">
        {{ $t('task.list.active') }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-if="activeTasks.length">
          <TaskUpdateCard
            v-for="task in activeTasks"
            :key="task.id"
            :task="task"
          />
        </template>

        <div class="h-full">
          <button
            class="w-full h-full min-h-[22rem] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-500 rounded-xl transition-colors text-gray-500 hover:text-purple-600 text-sm font-medium focus:outline-none"
            :disabled="isPending"
            @click="onAddTask"
          >
            <span class="text-3xl font-bold mb-1">+</span>
            <span>{{ $t('task.add') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toggle des tâches terminées -->
    <div
      v-if="completedTasks.length"
      class="mt-4 text-center"
    >
      <button
        class="inline-flex items-center gap-1 text-purple-700 font-medium hover:underline"
        @click="showCompleted = !showCompleted"
      >
        <span>
          {{ showCompleted ? $t('task.list.hide_completed') : $t('task.list.show_completed') }}
        </span>
        <svg
          class="w-4 h-4 transform transition-transform duration-200"
          :class="{ 'rotate-180': showCompleted }"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    <transition name="fade-slide">
      <div
        v-if="showCompleted"
        class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 opacity-60"
      >
        <TaskCard
          v-for="task in completedTasks"
          :key="task.id"
          :task="task"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { getRandomTask, TaskStatusEnum } from '~/types/task'
import type { TaskStatus } from '~/types/task'

const { useActiveTasksQuery, useCreateTaskMutation } = useTask()
const user = useSupabaseUser()

const { data: allTasks, isLoading } = useActiveTasksQuery(user)
const { mutate: createTask, isPending } = useCreateTaskMutation(user)

const showCompleted = ref(false)

const activeTasks = computed(() =>
  allTasks.value?.filter(task =>
    ([
      TaskStatusEnum.TODO,
      TaskStatusEnum.IN_PROGRESS,
    ] as TaskStatus[]).includes(task.status),
  ) || [],
)

const completedTasks = computed(() =>
  allTasks.value?.filter(task => task.status === TaskStatusEnum.DONE) || [],
)

const onAddTask = () => {
  if (!user.value?.id) return
  const task = getRandomTask()
  createTask({
    created_by: user.value.id,
    ...task,
  })
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
