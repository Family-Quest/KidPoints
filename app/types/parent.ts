// types/user.ts
import type { Tables, TablesUpdate, Enums } from '~/types/database'
import { z } from 'zod'

export type Parent = Tables<'parent'>
export type ParentUpdate = TablesUpdate<'parent'>

export type ParentLanguages = Enums<'languages'>

export const parentLanguagesValues = ['fr', 'en'] as const satisfies readonly ParentLanguages[]

export const parentUpdateSchema = z.object({
  name: z.string().min(2, 'Parent name is required').max(100, 'Parent name must be less than 100 characters'),
  language: z.enum(parentLanguagesValues).default('fr'),
})
