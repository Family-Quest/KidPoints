import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Children, ChildrenInsert, ChildrenUpdate } from '~/types/children'
import type { Database } from '~/types/database'
import type { User } from '@supabase/supabase-js'

export const useChildren = () => {
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
      queryKey: ['get-childrens', userRef],
      enabled,
      queryFn: async () => {
        if (!userRef.value?.id) throw new Error('User ID is required for fetching children')
        const req = await supabase
          .from('children')
          .select('*')
          .eq('user_id', userRef.value.id)
        return req.data as Children[]
      },
    })
  }

  function useAddChildrenMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (child: ChildrenInsert) => {
        await supabase
          .from('children')
          .insert(child)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-childrens', userRef] })
      },
    })
  }

  function useUpdateChildrenMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (children: ChildrenUpdate) => {
        if (!userRef.value?.id) throw new Error('User ID is required for updating')
        if (!children.id) throw new Error('Children ID is required for updating')
        await supabase
          .from('children')
          .update(children)
          .eq('id', children.id)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-childrens', userRef] })
      },
    })
  }

  function useDeleteChildrenMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (childrenId: string) => {
        if (!userRef.value?.id) throw new Error('User ID is required for deleting children')
        const req = await supabase
          .from('children')
          .delete()
          .eq('id', childrenId)
        console.log('Delete response:', req)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-childrens', userRef] })
      },
    })
  }

  return {
    avatarColors,
    useChildrenQuery,
    useAddChildrenMutation,
    useUpdateChildrenMutation,
    useDeleteChildrenMutation,
  }
}
