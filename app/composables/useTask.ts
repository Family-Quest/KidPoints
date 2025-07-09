import type { User } from '@supabase/supabase-js'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Database } from '~/types/database'
import type { ActiveTask, TaskInsert, TaskUpdate } from '~/types/task'

export const useTask = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()

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
          assignment:task_assignments (
            child_id,
            task_id,
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

        const tasksWithChild = (req.data ?? []).map(task => ({
          ...task,
          child: task.assignment?.child ?? null,
        }))

        return tasksWithChild
      },
    })
  }

  function useCreateTaskMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (task: TaskInsert) => {
        if (!userRef.value?.id) throw new Error('User ID is required for creating tasks')
        return await supabase
          .from('tasks')
          .insert(task)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
        queryClient.invalidateQueries({ queryKey: ['get-active-tasks', userRef] })
      },
    })
  }

  function useUpdateTaskMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (task: TaskUpdate) => {
        if (!userRef.value?.id) throw new Error('User ID is required for updating tasks')
        if (!task.id) throw new Error('Task ID is required for updating tasks')
        await supabase
          .from('tasks')
          .update(task)
          .eq('id', task.id)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
        queryClient.invalidateQueries({ queryKey: ['get-active-tasks', userRef] })
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
        queryClient.invalidateQueries({ queryKey: ['get-active-tasks', userRef] })
      },
    })
  }

  function useDeleteAssignationMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (taskId: string) => {
        if (!userRef.value?.id) throw new Error('User ID is required for deleting task assignments')
        await supabase
          .from('task_assignments')
          .delete()
          .eq('task_id', taskId)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-active-tasks', userRef] })
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
      },
    })
  }

  function useUpsertTaskAssignmentMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (payload: {
        task_id: string
        child_id: string
      }) => {
        if (!userRef.value?.id) throw new Error('User ID is required for task assignment')
        const { task_id, child_id } = payload
        if (!task_id) throw new Error('Task ID is required')
        await supabase
          .from('task_assignments')
          .upsert(
            { task_id, child_id },
            { onConflict: 'task_id' },
          )
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-active-tasks', userRef] })
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
      },
    })
  }

  function useValidateTaskMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)

    return useMutation({
      mutationFn: async (taskId: string) => {
        if (!userRef.value?.id) throw new Error('Not logged in')
        const { error } = await supabase.rpc('validate_task', { p_task_id: taskId })
        if (error) throw error
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-active-tasks', userRef] })
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
        queryClient.invalidateQueries({ queryKey: ['get-children', userRef] })
      },
    })
  }

  return {
    useActiveTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useValidateTaskMutation,
    useUpsertTaskAssignmentMutation,
    useDeleteAssignationMutation,
  }
}
