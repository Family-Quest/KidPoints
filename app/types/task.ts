// types/user.ts
import type { Tables, TablesInsert, TablesUpdate } from '~/types/database'

export type Task = Tables<'tasks'>
export type TaskInsert = TablesInsert<'tasks'>
export type TaskUpdate = TablesUpdate<'tasks'>
