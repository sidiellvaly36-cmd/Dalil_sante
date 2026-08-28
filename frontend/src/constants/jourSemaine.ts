import type { JourSemaine, SelectOption } from '@/types'

/** ترتيب أيام الأسبوع بدءًا من الاثنين، بأسماء java.time.DayOfWeek الحرفية (إنجليزية) كقيم */
export const JOUR_SEMAINE_OPTIONS: SelectOption[] = [
  { label: 'Lundi', value: 'MONDAY' },
  { label: 'Mardi', value: 'TUESDAY' },
  { label: 'Mercredi', value: 'WEDNESDAY' },
  { label: 'Jeudi', value: 'THURSDAY' },
  { label: 'Vendredi', value: 'FRIDAY' },
  { label: 'Samedi', value: 'SATURDAY' },
  { label: 'Dimanche', value: 'SUNDAY' },
]

/** تسميات الأيام بالفرنسية للعرض */
export const JOUR_SEMAINE_LABELS: Record<JourSemaine, string> = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
  SUNDAY: 'Dimanche',
}

/** ترتيب الأيام رقميًا لأغراض الفرز في الجداول */
export const JOUR_SEMAINE_ORDER: Record<JourSemaine, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
}
