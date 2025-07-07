import { type User, createClient } from '@supabase/supabase-js'

export const useAuth = () => {
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )

  const user = useState<User | null>('user', () => null)

  const fetchUser = async () => {
    const { data } = await supabase?.auth.getUser()
    user.value = data.user
  }

  const login = async (email: string, password: string) => {
    const { error } = await supabase?.auth.signInWithPassword({ email, password })
    if (error) throw error
    await fetchUser()
  }

  const signup = async (email: string, password: string) => {
    const { error } = await supabase?.auth.signUp({ email, password })
    if (error) throw error
    await fetchUser()
  }

  const logout = async () => {
    const { error } = await supabase?.auth.signOut()
    if (error) throw error
    user.value = null
  }

  supabase?.auth?.onAuthStateChange((_, session) => {
    user.value = session?.user || null
  })

  onMounted(() => {
    fetchUser()
  })

  return { user, login, signup, logout }
}