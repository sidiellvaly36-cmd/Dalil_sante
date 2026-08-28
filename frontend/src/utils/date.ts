import dayjs from 'dayjs'

/** ينسّق تاريخًا ISO إلى صيغة عرض فرنسية قصيرة (مثال: 03/08/2026) */
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—'
  return dayjs(isoDate).format('DD/MM/YYYY')
}

/** ينسّق تاريخًا ووقتًا ISO إلى صيغة عرض فرنسية كاملة (مثال: 03/08/2026 14:30) */
export function formatDateTime(isoDate: string | null | undefined): string {
  if (!isoDate) return '—'
  return dayjs(isoDate).format('DD/MM/YYYY HH:mm')
}

/** يحوّل تاريخًا إلى صيغة نسبية بسيطة (اليوم، أمس، أو التاريخ) */
export function formatRelativeDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—'
  const date = dayjs(isoDate)
  const now = dayjs()

  if (date.isSame(now, 'day')) return "Aujourd'hui"
  if (date.isSame(now.subtract(1, 'day'), 'day')) return 'Hier'
  return formatDate(isoDate)
}
