// types/user.ts
import type { Tables, TablesUpdate } from '~/types/database'

export type User = Tables<'users'>
export type UserProfile = User & {
  email: string
}
export type UserUpdate = TablesUpdate<'users'>
