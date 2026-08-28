import { Button, Space, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { StatusTag } from '@/components'
import type { ServiceMedical } from '@/types'

interface GetServicesColumnsParams {
  onEdit: (record: ServiceMedical) => void
  onDelete: (record: ServiceMedical) => void
}

export function getServicesColumns({
  onEdit,
  onDelete,
}: GetServicesColumnsParams): ColumnsType<ServiceMedical> {
  return [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Statut',
      dataIndex: 'actif',
      key: 'actif',
      render: (actif: boolean) => <StatusTag actif={actif} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title="Modifier">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              aria-label="Modifier"
            />
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
