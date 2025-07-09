// types/user.ts
import type { Tables, TablesUpdate, Enums } from '~/types/database'
import { z } from 'zod'

export type Parent = Tables<'parents'>
export type ParentUpdate = TablesUpdate<'parents'>

export type ParentLanguages = Enums<'languages'>

export const parentLanguagesValues = ['fr', 'en'] as const satisfies readonly ParentLanguages[]

export const parentUpdateSchema = z.object({
  name: z.string().min(2, 'validation.parent_name_required').max(100, 'validation.parent_name_max_length'),
  language: z.enum(parentLanguagesValues).default('fr'),
})
