// types/user.ts
import type { Tables, TablesUpdate } from '~/types/database'
import { z } from 'zod'

export type Parent = Tables<'parents'>
export type ParentUpdate = TablesUpdate<'parents'>

export type ParentOnboarding = {
  mode: 'create' | 'join'
  familyName: string
  joinCode: string
  parentName: string
}

export const baseFields = {
  parentName: z
    .string()
    .min(2, { message: 'validation.parent_name_required' })
    .max(100, { message: 'validation.parent_name_max_length' }),
}

export const parentOnboardingSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('create'),
    familyName: z.string().min(2, { message: 'validation.family_name_required' }).max(100, { message: 'validation.family_name_max_length' }),
    joinCode: z.string().optional(),
    ...baseFields,
  }),
  z.object({
    mode: z.literal('join'),
    joinCode: z
      .string()
      .trim()
      .transform(val => val.toUpperCase().slice(-8))
      .refine(val => /^[A-Z0-9]{8}$/.test(val), {
        message: 'validation.code_required',
      }),
    familyName: z.string().optional(),
    ...baseFields,
  }),
])

export const parentUpdateSchema = z.object({
  name: z.string().min(2, 'validation.parent_name_required').max(100, 'validation.parent_name_max_length'),
})
