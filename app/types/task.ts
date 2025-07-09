// types/user.ts
import type { Enums, Tables, TablesInsert, TablesUpdate } from '~/types/database'
import { z } from 'zod'
import type { Child } from './child'

export type TaskStatus = Enums<'task_status'>
export const TaskStatusEnum = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
} as const

export const taskStatusValues = [
  TaskStatusEnum.TODO,
  TaskStatusEnum.IN_PROGRESS,
  TaskStatusEnum.DONE,
] as const

export type Task = Tables<'tasks'>
export type TaskInsert = TablesInsert<'tasks'>
export type TaskUpdate = TablesUpdate<'tasks'>

export type TaskAssignment = Tables<'task_assignments'> & {
  child?: Child | null
}

export type ActiveTask = Task & {
  assignment: TaskAssignment | null
}

export const taskInsertSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  points: z.number().min(0).optional(),
  status: z.enum(taskStatusValues).default(TaskStatusEnum.TODO),
})

export const taskUpdateSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  points: z.number().min(0).optional(),
  status: z.enum(taskStatusValues).optional(),
  user_id: z.string().uuid().optional(),
})
