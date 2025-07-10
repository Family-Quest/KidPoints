import type { Enums } from './database'

export type AppLanguage = Enums<'languages'>

export const appLanguagesValues = ['fr', 'en'] as const satisfies readonly AppLanguage[]

export const flags: Record<AppLanguage, string> = {
  fr: '/flags/fr.png',
  en: '/flags/en.png',
}
