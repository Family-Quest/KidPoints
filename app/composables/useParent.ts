import type { Database } from '~/types/database'
import type { Parent, ParentUpdate } from '~/types/parent'
import type { User } from '@supabase/supabase-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const useParent = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()

  function useParentQuery(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    const enabled = computed(() => !!userRef.value?.id)
    return useQuery({
      queryKey: ['get-parent', userRef],
      enabled,
      queryFn: async () => {
        if (!userRef.value?.id) throw new Error('User ID is required for fetching profile')
        const req = await supabase
          .from('parent')
          .select('*')
          .eq('id', userRef.value.id)
          .single()
        return req.data as Parent
      },
    })
  }

  function useParentMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (parent: ParentUpdate) => {
        if (!userRef.value?.id) throw new Error('User ID is required for updating profile')
        await supabase.from('parent').update(parent).eq('id', userRef.value.id)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['get-parent', userRef],
        })
      },
    })
  }

  return {
    useParentQuery,
    useParentMutation,
  }
}
