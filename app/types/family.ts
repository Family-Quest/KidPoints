// types/user.ts
import type { Tables, TablesInsert, TablesUpdate } from '~/types/database'
import { z } from 'zod'

export type Family = Tables<'families'>
export type FamilyInsert = TablesInsert<'families'>
export type FamilyUpdate = TablesUpdate<'families'>

export const FamilyCreateSchema = z.object({
  familyName: z.string().min(2, 'validation.family_name_required').max(100, 'validation.family_name_max_length'),
})

export const FamilyJoinSchema = z.object({
  code: z.string().length(6, 'validation.code_required'),
})

export type FamilyJoin = z.infer<typeof FamilyJoinSchema>
