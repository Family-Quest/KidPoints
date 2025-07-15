import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Child, ChildInsert, ChildUpdate } from '~/types/child'
import type { Database } from '~/types/database'
import type { User } from '@supabase/supabase-js'
import { toast } from 'vue-sonner'

export const useChild = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()

  const { t } = useI18n()

  function useChildrenQuery(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    const enabled = computed(() => !!userRef.value?.id)
    return useQuery({
      queryKey: ['get-children', userRef],
      enabled,
      queryFn: async () => {
        if (!userRef.value?.id) throw new Error('User ID is required for fetching children')
        const { data: children, error } = await supabase
          .from('children')
          .select('*')
        if (error) throw error
        return children as Child[]
      },
    })
  }

  function useAddChildMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (child: ChildInsert) => {
        const { error } = await supabase
          .from('children')
          .insert(child)
        if (error) throw error
      },
      onSuccess: () => {
        toast.success(t('child.creation_success'))
        queryClient.invalidateQueries({ queryKey: ['get-children', userRef] })
      },
      onError: (error) => {
        toast.error(t('child.creation_error'))
        console.error('Error creating child:', error)
      },
    })
  }

  function useUpdateChildMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (child: ChildUpdate) => {
        if (!userRef.value?.id) throw new Error('User ID is required for updating')
        if (!child.id) throw new Error('Child ID is required for updating')
        const { error } = await supabase
          .from('children')
          .update(child)
          .eq('id', child.id)
        if (error) throw error
      },
      onSuccess: () => {
        toast.success(t('child.update_success'))
        queryClient.invalidateQueries({ queryKey: ['get-children', userRef] })
      },
      onError: (error) => {
        toast.error(t('child.update_error'))
        console.error('Error updating child:', error)
      },
    })
  }

  function useDeleteChildMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (childId: string) => {
        if (!userRef.value?.id) throw new Error('User ID is required for deleting child')
        const { error } = await supabase
          .from('children')
          .delete()
          .eq('id', childId)
        if (error) throw error
      },
      onSuccess: () => {
        toast.success(t('child.deletion_success'))
        queryClient.invalidateQueries({ queryKey: ['get-children', userRef] })
      },
      onError: (error) => {
        toast.error(t('child.deletion_error'))
        console.error('Error deleting child:', error)
      },
    })
  }

  return {
    useChildrenQuery,
    useAddChildMutation,
    useUpdateChildMutation,
    useDeleteChildMutation,
  }
}
