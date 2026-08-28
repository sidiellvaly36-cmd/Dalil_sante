import { Button, Space,  Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'

import { StatusTag } from '@/components'
import type { OrientationQuestion } from '@/types'

interface GetOrientationQuestionsColumnsParams {
  onEdit: (record: OrientationQuestion) => void
  onDelete: (record: OrientationQuestion) => void
}

export function getOrientationQuestionsColumns({
  onEdit,
  onDelete,
}: GetOrientationQuestionsColumnsParams): ColumnsType<OrientationQuestion> {
  return [
    {
      title: 'Question',
      dataIndex: 'questionText',
      key: 'questionText',
      sorter: true,
      ellipsis: true,
    },

    {
      title: 'Ordre',
      dataIndex: 'questionOrder',
      key: 'questionOrder',
      sorter: true,
      width: 100,
    },

    {
      title: 'Statut',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <StatusTag actif={active} />
      ),
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