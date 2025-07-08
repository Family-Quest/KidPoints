import { ref } from 'vue'
import type { Database } from '~/types/database'
import type { Task, TaskInsert, TaskUpdate } from '~/types/task'

export const useTask = () => {
  const supabase = useSupabaseClient<Database>()

  const loading = ref(false)
  const error = ref<Error | null>(null)

  const getUserTasks = async (userId: string): Promise<Task[]> => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
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

  const createTask = async (task: TaskInsert): Promise<Task> => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('tasks')
        .insert([task])
        .select()
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

  const deleteTask = async (taskId: string): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
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

  const updateTask = async (taskId: string, task: TaskUpdate): Promise<Task> => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', taskId)
        .select()
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

  return {
    loading,
    error,
    getUserTasks,
    createTask,
    deleteTask,
    updateTask,
  }
}
