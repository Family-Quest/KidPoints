// types/user.ts
import type { Enums, Tables, TablesInsert, TablesUpdate } from '~/types/database'
import { z } from 'zod'

export type TaskStatus = Enums<'task_status'>

export const taskStatusValues = ['todo', 'in_progress', 'done'] as const satisfies readonly TaskStatus[]

export type Task = Tables<'tasks'>
export type TaskInsert = TablesInsert<'tasks'>
export type TaskUpdate = TablesUpdate<'tasks'>

export const taskInsertSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  points: z.number().min(0).optional(),
  status: z.enum(taskStatusValues).default('todo'),
})

export const taskUpdateSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  points: z.number().min(0).optional(),
  status: z.enum(taskStatusValues).optional(),
  user_id: z.string().uuid().optional(),
})
