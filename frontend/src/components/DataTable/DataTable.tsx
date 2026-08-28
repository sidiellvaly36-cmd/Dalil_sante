import { useMemo, useState } from 'react'
import { Empty, Input, Table } from 'antd'
import type { TableProps } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { filterBySearch, paginateItems, sortItems } from '@/utils'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants'
import type { SortOrder } from '@/types'
import styles from './DataTable.module.scss'

interface DataTableProps<T> {
  columns: TableProps<T>['columns']
  data: T[]
  loading?: boolean
  rowKey: string | ((record: T) => string)
  searchableFields?: (keyof T)[]
  searchPlaceholder?: string
  emptyDescription?: string
}

/**
 * جدول موحّد لكل صفحات الـ CRUD. يطبّق البحث/الفرز/التقسيم لصفحات (Pagination)
 * من جانب العميل بالكامل، لأن الـ Backend الحقيقي يُرجع القوائم كاملة (List<T>)
 * بدون أي Pagination من جهته.
 */
function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  rowKey,
  searchableFields = [],
  searchPlaceholder = 'Rechercher...',
  emptyDescription = 'Aucune donnée disponible',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [sortField, setSortField] = useState<string | undefined>(undefined)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const filtered = useMemo(
    () => filterBySearch(data, search, searchableFields),
    [data, search, searchableFields],
  )

  const sorted = useMemo(
    () => sortItems(filtered, sortField, sortOrder),
    [filtered, sortField, sortOrder],
  )

  const paginated = useMemo(
    () => paginateItems(sorted, { page, pageSize, search, sortField, sortOrder }),
    [sorted, page, pageSize, search, sortField, sortOrder],
  )

  return (
    <div>
      {searchableFields.length > 0 && (
        <div className={styles.toolbar}>
          <Input
            allowClear
            className={styles.search}
            prefix={<SearchOutlined />}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(DEFAULT_PAGE)
            }}
          />
        </div>
      )}

      {/*
        Conteneur de défilement horizontal explicite : quelle que soit la
        largeur réellement disponible autour de ce composant (partagé par
        toutes les pages CRUD ADMIN), tout débordement du tableau reste
        contenu ici via overflow-x, au lieu de se propager à la page entière.
        scroll.x="max-content" (plutôt que `true`) force AntD à calculer une
        largeur de table concrète, condition nécessaire pour que ce
        confinement fonctionne de façon fiable.
      */}
      <div className={styles.tableScrollWrapper}>
        <Table<T>
          columns={columns}
          dataSource={paginated.items}
          rowKey={rowKey}
          loading={loading}
          locale={{
            emptyText: <Empty description={emptyDescription} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
          onChange={(_pagination, _filters, sorter) => {
            const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter
            setSortField(singleSorter?.field as string | undefined)
            setSortOrder((singleSorter?.order as SortOrder) ?? null)
          }}
          pagination={{
            current: page,
            pageSize,
            total: paginated.total,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
            showTotal: (total) => `${total} élément(s)`,
            onChange: (newPage, newPageSize) => {
              setPage(newPage)
              setPageSize(newPageSize)
            },
          }}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  )
}

export default DataTable
