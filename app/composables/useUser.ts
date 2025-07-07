import { ref } from 'vue'
import type { Database } from '~/types/database'
import type { User, UserUpdate } from '~/types/user'

export const useUser = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const loading = ref(false)
  const error = ref<Error | null>(null)

  const getUserProfile = async (): Promise<User> => {
    loading.value = true
    error.value = null
    if (!user.value) {
      throw new Error('User not authenticated')
    }
    try {
      const { data, error: err } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.value.id)
        .single()
      if (err) throw err
      return data
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const updateUserProfile = async (updates: UserUpdate) => {
    loading.value = true
    error.value = null
    if (!user.value) {
      throw new Error('User not authenticated')
    }
    try {
      const { error: err } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.value.id)
      if (err) throw err
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getUserProfile,
    updateUserProfile,
  }
}
