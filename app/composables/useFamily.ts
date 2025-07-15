import type { Database } from '~/types/database'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { User } from '@supabase/supabase-js'

export const useFamily = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()
  const familyStore = useFamilyStore()

  function useFamilyQuery(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    const enabled = computed(() => !!userRef.value?.id && !!familyStore.id)

    return useQuery({
      queryKey: ['get-family', userRef.value?.id],
      enabled,
      queryFn: async () => {
        if (!userRef.value?.id) throw new Error('User ID is required to fetch family')

        const { data, error } = await supabase
          .from('families')
          .select('*, family_parents!inner(*)')
          .eq('family_parents.parent_id', userRef.value.id)
          .single()
        if (error) throw error
        familyStore.setId(data.id)
        familyStore.setCode(data.join_code)
        familyStore.setName(data.name)
        return data
      },
    })
  }

  // Créer une famille et lier le parent
  function useCreateFamilyMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)
    return useMutation({
      mutationFn: async (payload: { familyName: string }) => {
        if (!userRef.value?.id) throw new Error('User not logged in')

        const { data: family, error: errorInsertFamily } = await supabase
          .from('families')
          .insert({ name: payload.familyName })
          .select()
          .single()

        if (errorInsertFamily) throw errorInsertFamily

        const { error: errorInsertFamilyParent } = await supabase
          .from('family_parents')
          .insert({
            family_id: family.id,
            parent_id: userRef.value.id,
          })

        if (errorInsertFamilyParent) throw errorInsertFamilyParent

        familyStore.setId(family.id)
        familyStore.setCode(family.join_code)
        familyStore.setName(family.name)

        return family
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-family', userRef.value?.id] })
      },
    })
  }

  // Rejoindre une famille via code
  function useJoinFamilyMutation(user: MaybeRef<User | null>) {
    const userRef = toRef(user)

    return useMutation({
      mutationFn: async (payload: { code: string }) => {
        if (!userRef.value?.id) throw new Error('User not logged in')

        const fullCode = `FAMILY-${payload.code.trim().toUpperCase()}`

        const { data: family, error: errorFetchFamilyByCode } = await supabase
          .rpc('get_family_by_code', { code_input: fullCode })
          .single()

        if (errorFetchFamilyByCode) throw errorFetchFamilyByCode
        if (!family) throw new Error('Family not found')

        const { error: errorInsertFamilyParent } = await supabase
          .from('family_parents')
          .insert({
            family_id: family.id,
            parent_id: userRef.value.id,
          })

        if (errorInsertFamilyParent) throw errorInsertFamilyParent

        familyStore.setId(family.id)
        familyStore.setCode(family.join_code)
        familyStore.setName(family.name)

        return family
      },

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-family', userRef.value?.id] })
      },
    })
  }

  return {
    useFamilyQuery,
    useCreateFamilyMutation,
    useJoinFamilyMutation,
  }
}
