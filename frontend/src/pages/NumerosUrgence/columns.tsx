import { Button, Space, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { NumeroUrgence } from '@/types'

interface GetNumerosUrgenceColumnsParams {
  onEdit: (record: NumeroUrgence) => void
  onDelete: (record: NumeroUrgence) => void
}

export function getNumerosUrgenceColumns({
  onEdit,
  onDelete,
}: GetNumerosUrgenceColumnsParams): ColumnsType<NumeroUrgence> {
  return [
    { title: 'Nom', dataIndex: 'nom', key: 'nom', sorter: true },
    { title: 'Numéro', dataIndex: 'numero', key: 'numero' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Établissement de santé',
      key: 'etablissement',
      render: (_, record) => record.etablissementNom ?? 'Numéro général',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title="Modifier">
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} aria-label="Modifier" />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              aria-label="Supprimer"
            />
          </Tooltip>
        </Space>
      ),
    },
  ]
}