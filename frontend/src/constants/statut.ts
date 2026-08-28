import type { SelectOption } from '@/types'

/**
 * حالة التفعيل العامة (Actif/Inactif) - في الـ Backend هي دائمًا Boolean وليست enum نصية،
 * هذه الثوابت تُستخدم فقط للعرض والفلاتر في الواجهة.
 */
export const ACTIF_OPTIONS: SelectOption[] = [
  { label: 'Actif', value: 'true' },
  { label: 'Inactif', value: 'false' },
]

export function getActifLabel(actif: boolean): string {
  return actif ? 'Actif' : 'Inactif'
}

export function getActifColor(actif: boolean): string {
  return actif ? 'success' : 'default'
}
