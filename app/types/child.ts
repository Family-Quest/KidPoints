// types/user.ts
import type { Tables, TablesInsert, TablesUpdate } from '~/types/database'
import { z } from 'zod'

export type Child = Tables<'children'>
export type ChildInsert = TablesInsert<'children'>
export type ChildUpdate = TablesUpdate<'children'>

export const childUpdateSchema = z.object({
  name: z.string().min(1, 'validation.child_name_required').max(100, 'validation.child_name_max_length').optional(),
  avatar_color: z.string().optional(),
  points: z.number().optional(),
  level: z.number().optional(),
  user_id: z.string().uuid().optional(),
})

const randomNames = ['Léo', 'Emma', 'Milo', 'Lina', 'Tom', 'Sacha', 'Zoé', 'Noah', 'Jade', 'Lucas']

export const getRandomName = () => randomNames[Math.floor(Math.random() * randomNames.length)]

export enum AvatarColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  PURPLE = 'purple',
  ORANGE = 'orange',
  PINK = 'pink',
  YELLOW = 'yellow',
  GRAY = 'gray',
  BROWN = 'brown',
}

export const avatarColors = Object.values(AvatarColor)

type ColorKey = Uppercase<AvatarColor>

type ChildAvatarColor = {
  [key in ColorKey]: {
    label: `colors.${Lowercase<key>}`
    bg: `bg-${Lowercase<key>}-200`
    text: `text-${Lowercase<key>}-700`
    border: `border-${Lowercase<key>}-300`
    fadeBg: string
    emoji: string
  }
}

// Définir ici les fadeBg Tailwind-like
const fadeBgMap: Record<AvatarColor, string> = {
  red: 'rgba(239, 68, 68, 0.15)', // red-500
  blue: 'rgba(59, 130, 246, 0.15)', // blue-500
  green: 'rgba(34, 197, 94, 0.15)', // green-500
  yellow: 'rgba(234, 179, 8, 0.15)', // yellow-500
  purple: 'rgba(168, 85, 247, 0.15)', // purple-500
  pink: 'rgba(236, 72, 153, 0.15)', // pink-500
  gray: 'rgba(107, 114, 128, 0.15)', // gray-500
  orange: 'rgba(249, 115, 22, 0.15)', // orange-500
  brown: 'rgba(150, 90, 50, 0.15)', // approximation
}

const emojiMap: Record<AvatarColor, string> = {
  red: '🍓',
  blue: '💧',
  green: '🍀',
  yellow: '🌟',
  purple: '🪄',
  pink: '🌸',
  gray: '🎈',
  orange: '🍊',
  brown: '🧸',
}

const childAvatarColors = Object.fromEntries(
  avatarColors.map(color => [
    color.toUpperCase(),
    {
      label: `colors.${color}` as const,
      bg: `bg-${color}-200` as const,
      text: `text-${color}-700` as const,
      border: `border-${color}-300` as const,
      fadeBg: fadeBgMap[color],
      emoji: emojiMap[color],
    },
  ]),
) as unknown as ChildAvatarColor

export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ')
  if (parts.length === 1 && parts[0]) return parts[0].substring(0, 2).toUpperCase()
  if (parts.length >= 2 && parts[0] && parts[1]) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return ''
}

export const getRandomColor = (): AvatarColor => {
  return avatarColors[Math.floor(Math.random() * avatarColors.length)] as AvatarColor
}

export const getAvatarClasses = (color: string): string => {
  const c = (color ?? 'gray').toLowerCase() as AvatarColor
  const avatarColor = childAvatarColors[c.toUpperCase() as ColorKey]
  if (!avatarColor) return 'bg-gray-200 text-gray-700'
  return `${avatarColor.bg} ${avatarColor.text}`
}

export const getAvatarFadeBg = (color: AvatarColor): { backgroundColor: string } => {
  return { backgroundColor: childAvatarColors[color.toUpperCase() as ColorKey].fadeBg }
}

export const getAvatarEmoji = (color: string): string => {
  const c = (color ?? 'gray').toLowerCase() as AvatarColor
  return childAvatarColors[c.toUpperCase() as ColorKey]?.emoji ?? '🎈'
}

export const getAvatarBorderColor = (color: string): string => {
  const c = (color ?? 'gray').toLowerCase() as AvatarColor
  return childAvatarColors[c.toUpperCase() as ColorKey]?.border ?? 'border-gray-300'
}
