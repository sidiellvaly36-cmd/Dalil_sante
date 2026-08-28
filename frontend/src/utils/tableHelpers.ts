import type { PaginatedResult, TableQueryParams } from '@/types'

/**
 * أدوات مساعدة للـ Pagination/الفرز/البحث من جانب العميل (Client-side).
 * ضرورية لأن كل الـ Endpoints في الـ Backend الحقيقي تُرجع القائمة كاملة
 * (List<T> بدون Pagination من جهة الخادم)، فنقوم نحن بتقسيمها لصفحات في الواجهة.
 */

/**
 * يبحث ضمن قائمة عناصر باستخدام نص بحث حر، عبر مقارنة القيم النصية
 * لكل الحقول المُمرَّرة في searchableFields.
 */
export function filterBySearch<T>(
  items: T[],
  search: string | undefined,
  searchableFields: (keyof T)[],
): T[] {
  if (!search || search.trim() === '') return items

  const normalizedSearch = search.trim().toLowerCase()

  return items.filter((item) =>
    searchableFields.some((field) => {
      const value = item[field]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(normalizedSearch)
    }),
  )
}

/** يفرز قائمة عناصر حسب حقل واتجاه معيّنين */
export function sortItems<T>(
  items: T[],
  sortField: string | undefined,
  sortOrder: 'ascend' | 'descend' | null | undefined,
): T[] {
  if (!sortField || !sortOrder) return items

  const sorted = [...items].sort((a, b) => {
    const aValue = (a as Record<string, unknown>)[sortField]
    const bValue = (b as Record<string, unknown>)[sortField]

    if (aValue === bValue) return 0
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    return aValue > bValue ? 1 : -1
  })

  return sortOrder === 'descend' ? sorted.reverse() : sorted
}

/** يقسّم قائمة عناصر إلى صفحة واحدة حسب معاملات الجدول (Pagination) */
export function paginateItems<T>(items: T[], params: TableQueryParams): PaginatedResult<T> {
  const { page, pageSize } = params
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    items: items.slice(start, end),
    total: items.length,
    page,
    pageSize,
  }
}
