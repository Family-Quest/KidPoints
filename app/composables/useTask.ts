import type { User } from '@supabase/supabase-js'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { Database } from '~/types/database'
import type { TaskInsert, TaskUpdate, TaskAssignment } from '~/types/task'

export const useTask = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()
  const familyStore = useFamilyStore()

  const { t } = useI18n()

  function useTasksQuery(user: MaybeRef<User | null>) {
    const userRef = toRef(user)

    const enabled = computed(() => {
      return !!userRef.value && familyStore.id !== undefined
    })

    return useQuery<TaskAssignment[]>({
      queryKey: ['get-tasks', userRef],
      enabled,
      queryFn: async () => {
        if (!familyStore.id) throw new Error('Family ID is required for fetching tasks')

        const { data: tasks, error } = await supabase
          .from('tasks')
          .select(`
            id,
            family_id,
            title,
            description,
            points,
            status,
            is_active,
            sort_order,
            validated_at,
            created_at,
            created_by,
            assignment:task_assignments (
              child:children (*)
            )
          `)
          .eq('family_id', familyStore.id)
          .order('created_at', { ascending: true })

        if (error) throw error

        return (tasks ?? []).map((task) => {
          const { assignment, ...rest } = task
          return {
            ...rest,
            child: assignment?.child ?? null,
          }
        })
      },
    })
  }

  function useCreateTaskMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (task: TaskInsert) => {
        if (!userRef.value?.id) throw new Error('User ID is required for creating tasks')
        const { data, error } = await supabase
          .from('tasks')
          .insert(task)
        if (error) throw error
        return data
      },
      onSuccess: () => {
        toast.success(t('task.creation_success'))
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
      },
      onError: (error) => {
        toast.error(t('task.creation_error'))
        console.error('Error creating task:', error)
      },
    })
  }

  function useUpdateTaskMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)

    return useMutation({
      mutationFn: async (task: TaskUpdate) => {
        if (!userRef.value?.id) throw new Error('User ID is required for updating tasks')
        if (!task.id) throw new Error('Task ID is required for updating tasks')
        const { data, error } = await supabase
          .from('tasks')
          .update(task)
          .eq('id', task.id)
        if (error) throw error
        return data
      },
      onSuccess: () => {
        toast.success(t('task.update_success'))
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
      },
      onError: (error) => {
        toast.error(t('task.update_error'))
        console.error('Error updating task:', error)
      },
    })
  }

  function useDeleteTaskMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)

    return useMutation({
      mutationFn: async (taskId: string) => {
        if (!userRef.value?.id) throw new Error('User ID is required for deleting tasks')
        const { data, error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId)
        if (error) throw error
        return data
      },
      onSuccess: () => {
        toast.success(t('task.deletion_success'))
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
      },
      onError: (error) => {
        toast.error(t('task.deletion_error'))
        console.error('Error deleting task:', error)
      },
    })
  }

  function useDeleteAssignationMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)

    return useMutation({
      mutationFn: async (taskId: string) => {
        if (!userRef.value?.id) throw new Error('User ID is required for deleting task assignments')
        const { data, error } = await supabase
          .from('task_assignments')
          .delete()
          .eq('task_id', taskId)
        if (error) throw error
        return data
      },
      onSuccess: () => {
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
        const { data, error } = await supabase
          .from('task_assignments')
          .upsert(
            { task_id, child_id },
            { onConflict: 'task_id' },
          )
        if (error) throw error
        return data
      },
      onSuccess: () => {
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
        toast.success(t('task.validated_success'))
        queryClient.invalidateQueries({ queryKey: ['get-tasks', userRef] })
        queryClient.invalidateQueries({ queryKey: ['get-children', userRef] })
      },
      onError: (error) => {
        toast.error(t('task.validated_error'))
        console.error('Error validating task:', error)
      },
    })
  }

  return {
    useTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useValidateTaskMutation,
    useUpsertTaskAssignmentMutation,
    useDeleteAssignationMutation,
  }
}
