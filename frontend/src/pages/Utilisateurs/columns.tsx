import { Button, Space, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { StatusTag } from '@/components'
import { formatDate } from '@/utils'
import type { Utilisateur } from '@/types'

interface GetUsersColumnsParams {
  onEdit: (record: Utilisateur) => void
  onDelete: (record: Utilisateur) => void
}

export function getUsersColumns({ onEdit, onDelete }: GetUsersColumnsParams): ColumnsType<Utilisateur> {
  return [
    {
      title: 'Nom complet',
      key: 'fullName',
      sorter: true,
      render: (_, record) => `${record.prenom} ${record.nom}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: 'Statut',
      dataIndex: 'actif',
      key: 'actif',
      render: (actif: boolean) => <StatusTag actif={actif} />,
    },
    {
      title: 'Créé le',
      dataIndex: 'dateCreation',
      key: 'dateCreation',
      sorter: true,
      render: (date: string) => formatDate(date),
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
