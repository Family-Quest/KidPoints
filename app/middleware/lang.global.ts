import type { AppLanguage } from '~/types/lang'
import type { Parent } from '~/types/parent'

const LS_KEY = 'parent_language'

export default defineNuxtRouteMiddleware(async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const nuxtApp = useNuxtApp()

  if (user.value) {
    const { data, error } = await supabase
      .from('parents')
      .select('language')
      .eq('id', user.value.id) // Vérifie bien ta colonne
      .single<Parent>()

    if (error) {
      console.error('Erreur récupération langue parent:', error)
    }

    if (data?.language && nuxtApp.$i18n.locale.value !== data.language) {
      nuxtApp.$i18n.locale.value = data.language
      localStorage.setItem(LS_KEY, data.language)
      return
    }
  }

  // Si pas connecté ou pas de langue en base, essaye localStorage
  const langFromStorage = localStorage.getItem(LS_KEY) as AppLanguage | null
  if (langFromStorage && nuxtApp.$i18n.locale.value !== langFromStorage) {
    nuxtApp.$i18n.locale.value = langFromStorage
  }
})
