import type { User } from '@supabase/supabase-js'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Database } from '~/types/database'
import type { ActiveTask, Task, TaskInsert, TaskUpdate } from '~/types/task'

export const useTask = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()

  function useTasksQuery(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    const enabled = computed(() => !!userRef.value?.id)
    return useQuery({
      queryKey: ['get-tasks', userRef],
      enabled,
      queryFn: async () => {
        if (!userRef.value?.id) throw new Error('User ID is required for fetching tasks')
        // Fetch tasks for the user
        const req = await supabase
          .from('tasks')
          .select('*')
          .eq('created_by', userRef.value.id)
          .order('order', { ascending: true })
        return req.data as Task[]
      },
    })
  }

  function useActiveTasksQuery(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    const enabled = computed(() => !!userRef.value?.id)
    return useQuery<ActiveTask[]>({
      queryKey: ['get-active-tasks', userRef],
      enabled,
      queryFn: async () => {
        if (!userRef.value?.id) throw new Error('User ID is required for fetching tasks')
        const req = await supabase
          .from('tasks')
          .select(`
            *,
            task_assignments:task_assignments (
              id,
              child_id,
              task_id,
              status,
              date,
              validated_at,
              child:children (
                id,
                name,
                avatar_color,
                level,
                points,
                user_id
              )
            )
          `)
          .eq('created_by', userRef.value.id)
          .eq('is_active', true)
          .order('order', { ascending: true })

        // Si tu veux transformer le résultat pour récupérer par tâche un enfant (ex: le premier) :
        const tasksWithSingleChild = (req.data ?? []).map(task => ({
          ...task,
          child: Array.isArray(task.task_assignments) && task.task_assignments.length > 0
            ? task.task_assignments[0]?.child
            : null,
        }))

        return tasksWithSingleChild
      },
    })
  }

  function useCreateTaskMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (task: TaskInsert) => {
        if (!userRef.value?.id) throw new Error('User ID is required for creating tasks')
        const req = await supabase
          .from('tasks')
          .insert(task)
          .select()
          .single()
        return req
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
      },
    })
  }

  function useUpdateTaskMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (task: TaskUpdate) => {
        if (!userRef.value?.id) throw new Error('User ID is required for updating tasks')
        if (!task.id) throw new Error('Task ID is required for updating tasks')
        const req = await supabase
          .from('tasks')
          .update(task)
          .eq('id', task.id)
        return req
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
      },
    })
  }

  function useDeleteTaskMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (taskId: string) => {
        if (!userRef.value?.id) throw new Error('User ID is required for deleting tasks')
        await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
      },
    })
  }

  return {
    useTasksQuery,
    useActiveTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
  }
}
