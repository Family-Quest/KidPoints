import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Child, ChildInsert, ChildUpdate } from '~/types/child'
import type { Database } from '~/types/database'
import type { User } from '@supabase/supabase-js'

export const useChild = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()

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
        queryClient.invalidateQueries({ queryKey: ['get-children', userRef] })
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
        queryClient.invalidateQueries({ queryKey: ['get-children', userRef] })
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
        queryClient.invalidateQueries({ queryKey: ['get-children', userRef] })
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
