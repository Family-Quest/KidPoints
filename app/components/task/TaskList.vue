<template>
  <section>
    <!-- Titre principal -->
    <h2 class="text-2xl font-semibold mb-4 border-b-2 border-purple-400 pb-2">
      📋 {{ $t('task.list.title') }}
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

    <!-- Pas de tâches -->
    <div
      v-else-if="allTasks?.length === 0"
      class="text-gray-400 italic text-center py-8"
    >
      {{ $t('task.list.no_tasks_found') }}
    </div>

    <!-- Tâches actives -->
    <div v-else>
      <!-- Section : À faire ou en cours -->
      <div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <!-- Colonne TODO -->
          <div>
            <h4 class="text-lg font-semibold text-gray-600 mb-2">
              {{ $t('task.status_todo') }}
            </h4>
            <div
              v-if="todoTasks.length"
              class="flex flex-col gap-4"
            >
              <TaskCard
                v-for="task in todoTasks"
                :key="task.id"
                :task="task"
              />
            </div>
            <div
              v-else
              class="text-sm italic text-gray-400"
            >
              {{ $t('task.list.no_todo_tasks_found') }}
            </div>
          </div>

          <!-- Colonne IN_PROGRESS -->
          <div>
            <h4 class="text-lg font-semibold text-gray-600 mb-2">
              {{ $t('task.status_in_progress') }}
            </h4>
            <div
              v-if="inProgressTasks.length"
              class="flex flex-col gap-4"
            >
              <TaskCard
                v-for="task in inProgressTasks"
                :key="task.id"
                :task="task"
              />
            </div>
            <div
              v-else
              class="text-sm italic text-gray-400"
            >
              {{ $t('task.list.no_in_progress_tasks_found') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Section : Tâches complétées -->
      <div
        v-if="completedTasks?.length"
        class="mt-6"
      >
        <h4 class="text-lg font-semibold text-gray-600 mb-2">
          {{ $t('task.list.completed') }}
        </h4>

        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-2 opacity-90"
        >
          <TaskCard
            v-for="task in visibleCompletedTasks"
            :key="task.id"
            :task="task"
            compact
            class="opacity-70"
          />
        </div>

        <!-- Toggle button -->
        <div
          v-if="otherCompletedTasks?.length"
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

          <!-- Section : Tâches complétées -->
          <transition name="fade-slide">
            <div
              v-if="showCompleted && otherCompletedTasks?.length"
              class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 opacity-90"
            >
              <TaskCard
                v-for="task in otherCompletedTasks"
                :key="task.id"
                :task="task"
                compact
                class="opacity-70"
              />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TaskStatusEnum } from '~/types/task'

const { useTasksQuery } = useTask()
const user = useSupabaseUser()

const showCompleted = ref(false)

const { data: allTasks, isLoading } = useTasksQuery(user)

const todoTasks = computed(() =>
  allTasks.value?.filter(task => task.status === TaskStatusEnum.TODO) ?? [],
)

const inProgressTasks = computed(() =>
  allTasks.value?.filter(task => task.status === TaskStatusEnum.IN_PROGRESS) ?? [],
)

const completedTasks = computed(() => allTasks.value?.filter(task => task.status === TaskStatusEnum.DONE))
const visibleCompletedTasks = computed(() => completedTasks.value?.slice(0, 3))
const otherCompletedTasks = computed(() => completedTasks.value?.slice(3))
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
