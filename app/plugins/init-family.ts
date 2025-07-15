import type { Database } from '~/types/database'

export default defineNuxtPlugin(async () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient<Database>()
  const familyStore = useFamilyStore()

  // On attend que l'utilisateur soit prêt
  await until(user).toBeTruthy()

  if (!user.value) return

  // Ne refait pas la requête si la famille est déjà stockée
  if (familyStore.id) return

  // On récupère la famille du parent connecté
  const { data, error } = await supabase
    .from('family_parents')
    .select(`
    families:families (
      id,
      join_code,
      name
    )
  `)
    .eq('parent_id', user.value.id)
    .maybeSingle()

  if (error) {
    console.error('[init-family] Erreur chargement famille :', error.message)
    return
  }

  const family = data?.families
  if (family) {
    familyStore.setId(family.id)
    familyStore.setCode(family.join_code)
    familyStore.setName(family.name)
  }
  else {
    console.warn('[init-family] Aucune famille liée à cet utilisateur')
  }
})
