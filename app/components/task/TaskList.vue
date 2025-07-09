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
        <h3 class="text-xl font-semibold mb-2 text-purple-700">
          {{ $t('task.list.active') }}
        </h3>
        <div
          v-if="activeTasks?.length"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <TaskCard
            v-for="task in activeTasks"
            :key="task.id"
            :task="task"
          />
        </div>
        <div
          v-else-if="activeTasks?.length === 0"
          class="text-gray-400 italic text-center py-8"
        >
          {{ $t('task.list.no_active_tasks_found') }}
        </div>
      </div>

      <!-- Completed tasks toggle -->
      <div
        v-if="completedTasks?.length"
        class="mt-6 text-center"
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

      <!-- Section : Tâches complétées -->
      <transition name="fade-slide">
        <div
          v-if="showCompleted && completedTasks?.length"
          class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 opacity-90"
        >
          <TaskCard
            v-for="task in completedTasks"
            :key="task.id"
            :task="task"
            compact
            class="opacity-70 grayscale transition hover:grayscale-0"
          />
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TaskStatusEnum } from '~/types/task'

const { useActiveTasksQuery } = useTask()
const user = useSupabaseUser()

const showCompleted = ref(false)

const { data: allTasks, isLoading } = useActiveTasksQuery(user)

const activeTasks = computed(() => allTasks.value?.filter(task => task.status === TaskStatusEnum.TODO || task.status === TaskStatusEnum.IN_PROGRESS))
const completedTasks = computed(() => allTasks.value?.filter(task => task.status === TaskStatusEnum.DONE))
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
