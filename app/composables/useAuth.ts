import type { Database } from '~/types/database'

export const useAuth = () => {
  const supabase = useSupabaseClient<Database>()

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signup = async (email: string, password: string) => {
    const isProd = process.env.NODE_ENV === 'production'

    const redirectUrl = isProd
      ? 'https://kids-points.netlify.app/login'
      : 'http://localhost:3000/login'

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) throw error
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { login, signup, logout }
}
