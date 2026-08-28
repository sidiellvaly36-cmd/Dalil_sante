/**
 * أنواع عامة (Common Types) لا علاقة لها بأي DTO/Entity محدد من الـ Backend.
 * تُستخدم فقط لأغراض الواجهة (Pagination من جانب العميل، فلترة، فرز محلي...).
 */

/** اتجاه الترتيب في جداول Ant Design */
export type SortOrder = 'ascend' | 'descend' | null

/** معاملات جدول من جانب العميل (Client-side Pagination/Search/Sort) */
export interface TableQueryParams {
  page: number
  pageSize: number
  search?: string
  sortField?: string
  sortOrder?: SortOrder
}

/** نتيجة قائمة مقسّمة لصفحات من جانب العميل (لا علاقة لها بأي Pagination من الـ Backend) */
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/** خيار عام يُستخدم في مكونات Select / Radio / Checkbox */
export interface SelectOption {
  label: string
  value: string
}

/** يطابق حرفيًا dto/IdNomResponse.java - كائن مصغّر (id + nom) داخل استجابات أخرى لتفادي التكرار الكامل والعلاقات المتداخلة */
export interface IdNomResponse {
  id: number
  nom: string
}
