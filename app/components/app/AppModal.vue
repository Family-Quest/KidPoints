<!-- components/Modal.vue -->
<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      @click.self="close"
    >
      <div
        class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 relative"
        tabindex="0"
        @keydown.esc="close"
      >
        <!-- Bouton fermer -->
        <button
          type="button"
          aria-label="Close modal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
          @click="close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Contenu -->
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>({
  type: Boolean,
  default: false,
})

function close() {
  modelValue.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
