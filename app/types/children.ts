// types/user.ts
import type { Tables, TablesInsert, TablesUpdate } from '~/types/database'
import { z } from 'zod'

export type Children = Tables<'children'>
export type ChildrenInsert = TablesInsert<'children'>
export type ChildrenUpdate = TablesUpdate<'children'>

export const childrensInsertSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  avatar_color: z.string(),
  points: z.number().default(0),
  level: z.number().default(1),
  user_id: z.string().uuid(),
})

export const childrensUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  avatar_color: z.string().optional(),
  points: z.number().optional(),
  level: z.number().optional(),
  user_id: z.string().uuid().optional(),
})
