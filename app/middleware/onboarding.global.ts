export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  if (!user.value) {
    return
  }

  if (to.path === '/onboarding') {
    return
  }

  const { data: familyParents, error } = await supabase
    .from('family_parents')
    .select('family_id')
    .eq('parent_id', user.value.id)

  if (error) {
    console.error('Erreur chargement famille', error)
    return
  }

  if (!familyParents || familyParents.length === 0) {
    return navigateTo('/onboarding')
  }
})
