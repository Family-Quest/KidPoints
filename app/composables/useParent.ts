import type { Database } from '~/types/database'
import type { Parent, ParentUpdate } from '~/types/parent'
import type { User } from '@supabase/supabase-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const useParent = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()
  const familyStore = useFamilyStore()

  function useParentQuery(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    const enabled = computed(() => !!userRef.value?.id && !!familyStore.id)
    return useQuery({
      queryKey: ['get-parent', userRef],
      enabled,
      queryFn: async () => {
        if (!userRef.value?.id) throw new Error('User ID is required for fetching profile')
        const { data: parent, error } = await supabase
          .from('parents')
          .select('*')
          .eq('id', userRef.value.id)
          .single()
        if (error) throw error
        return parent as Parent
      },
    })
  }

  function useParentsByFamilyQuery(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    const enabled = computed(() => !!userRef.value?.id)

    return useQuery<Parent[]>({
      queryKey: ['get-family-parents', userRef],
      enabled,
      queryFn: async () => {
        if (!userRef.value?.id) throw new Error('User ID is required to fetch family parents')

        const { data, error } = await supabase
          .from('parents')
          .select('id, name, language, created_at')

        if (error) throw error
        return data ?? []
      },
    })
  }

  function useParentMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (parent: ParentUpdate) => {
        if (!userRef.value?.id) throw new Error('User ID is required for updating profile')
        const { error } = await supabase.from('parents').update(parent).eq('id', userRef.value.id)
        if (error) throw error
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['get-parent', userRef],
        })
        queryClient.invalidateQueries({
          queryKey: ['get-family-parents', userRef],
        })
      },
    })
  }

  return {
    useParentQuery,
    useParentsByFamilyQuery,
    useParentMutation,
  }
}
