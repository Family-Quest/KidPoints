<template>
  <div class="relative inline-block text-left">
    <button
      class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none gap-2"
      type="button"
      aria-haspopup="true"
      :aria-expanded="open"
      @click="toggleOpen"
    >
      <img
        :src="flags[modelValue]"
        alt=""
        class="w-5 h-5 rounded-sm"
        aria-hidden="true"
      >
      <span>{{ $t(`language.${modelValue}`) }}</span>
      <svg
        class="-mr-1 ml-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <transition name="fade">
      <ul
        v-if="open"
        class="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        tabindex="-1"
        role="menu"
        aria-orientation="vertical"
      >
        <li
          v-for="lang in appLanguagesValues"
          :key="lang"
          class="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-purple-600 hover:text-white text-gray-800"
          role="menuitem"
          :aria-current="modelValue === lang ? 'true' : undefined"
          @click="selectLanguage(lang)"
        >
          <img
            :src="flags[lang]"
            alt=""
            class="w-5 h-5 rounded-sm"
            aria-hidden="true"
          >
          <span>{{ $t(`language.${lang}`) }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { appLanguagesValues, flags } from '~/types/lang'
import type { AppLanguage } from '~/types/lang'

const user = useSupabaseUser()

const { useParentMutation } = useParent()

const { mutate } = useParentMutation(user)

const LS_KEY = 'parent_language'
const nuxtApp = useNuxtApp()

const modelValue = ref<AppLanguage>('fr') // Valeur par défaut
const open = ref(false)

// Init depuis localStorage au montage
const langFromStorage = localStorage.getItem(LS_KEY) as AppLanguage | null
if (langFromStorage && langFromStorage !== nuxtApp.$i18n.locale.value) {
  await nuxtApp.$i18n.setLocale(langFromStorage) // <-- attendre le chargement
  modelValue.value = langFromStorage as AppLanguage
}
else {
  modelValue.value = nuxtApp.$i18n.locale.value as AppLanguage
}

function toggleOpen() {
  open.value = !open.value
}

async function selectLanguage(lang: AppLanguage) {
  if (lang === modelValue.value) {
    open.value = false
    return
  }

  if (user.value) {
    mutate({
      id: user.value.id,
      language: lang,
    })
  }

  modelValue.value = lang
  await nuxtApp.$i18n.setLocale(lang) // <-- attendre le chargement
  localStorage.setItem(LS_KEY, lang)
  open.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
