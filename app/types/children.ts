// types/user.ts
import type { Tables, TablesInsert } from '~/types/database'

export type Children = Tables<'children'>
export type ChildrenInsert = TablesInsert<'children'>
