import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Child, ChildInsert, ChildUpdate } from '~/types/child'
import type { Database } from '~/types/database'
import type { User } from '@supabase/supabase-js'

export const useChild = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()
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

  function useChildrenQuery(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    const enabled = computed(() => !!userRef.value?.id)
    return useQuery({
      queryKey: ['get-children', userRef],
      enabled,
      queryFn: async () => {
        if (!userRef.value?.id) throw new Error('User ID is required for fetching children')
        const req = await supabase
          .from('children')
          .select('*')
          .eq('user_id', userRef.value.id)
        return req.data as Child[]
      },
    })
  }

  function useAddChildMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (child: ChildInsert) => {
        await supabase
          .from('children')
          .insert(child)
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
        await supabase
          .from('children')
          .update(child)
          .eq('id', child.id)
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
        await supabase
          .from('children')
          .delete()
          .eq('id', childId)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-children', userRef] })
      },
    })
  }

  return {
    avatarColors,
    useChildrenQuery,
    useAddChildMutation,
    useUpdateChildMutation,
    useDeleteChildMutation,
  }
}
