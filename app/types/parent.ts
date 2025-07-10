// types/user.ts
import type { Tables, TablesUpdate } from '~/types/database'
import { z } from 'zod'
import { appLanguagesValues } from './lang'

export type Parent = Tables<'parents'>
export type ParentUpdate = TablesUpdate<'parents'>

export const parentUpdateSchema = z.object({
  name: z.string().min(2, 'validation.parent_name_required').max(100, 'validation.parent_name_max_length'),
  language: z.enum(appLanguagesValues).default('fr'),
})
