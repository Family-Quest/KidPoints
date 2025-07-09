// types/user.ts
import type { Tables, TablesInsert, TablesUpdate } from '~/types/database'
import { z } from 'zod'

export type Child = Tables<'children'>
export type ChildInsert = TablesInsert<'children'>
export type ChildUpdate = TablesUpdate<'children'>

export const childUpdateSchema = z.object({
  name: z.string().min(1, 'validation.child_name_required').max(100, 'validation.child_name_max_length').optional(),
  avatar_color: z.string().optional(),
  points: z.number().optional(),
  level: z.number().optional(),
  user_id: z.string().uuid().optional(),
})

const randomNames = ['Léo', 'Emma', 'Milo', 'Lina', 'Tom', 'Sacha', 'Zoé', 'Noah', 'Jade', 'Lucas']

export const getRandomName = () => randomNames[Math.floor(Math.random() * randomNames.length)]

const avatarColors = ['red', 'blue', 'green', 'purple', 'orange', 'pink']

export const getRandomColor = () => avatarColors[Math.floor(Math.random() * avatarColors.length)]
