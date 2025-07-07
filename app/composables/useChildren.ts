import { ref } from 'vue'
import type { ChildrenInsert } from '~/types/children'
import type { Database } from '~/types/database'

export const useChildren = () => {
  const supabase = useSupabaseClient<Database>()
  const error = ref<Error | null>(null)
  const loading = ref(false)
  const { t } = useI18n()

  const avatarColors = [
    { value: 'red', label: t('colors.red') },
    { value: 'blue', label: t('colors.blue') },
    { value: 'green', label: t('colors.green') },
    { value: 'yellow', label: t('colors.yellow') },
    { value: 'purple', label: t('colors.purple') },
    { value: 'pink', label: t('colors.pink') },
    { value: 'orange', label: t('colors.orange') },
    { value: 'brown', label: t('colors.brown') },
    { value: 'gray', label: t('colors.gray') },
  ]

  const addChildrens = async (childs: ChildrenInsert[]) => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('children').insert(childs)
      if (err) throw err
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const getChildrens = async (userId: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('children')
        .select('*')
        .eq('user_id', userId)
      if (err) throw err
      return data || []
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    avatarColors,
    addChildrens,
    getChildrens
  }
}
