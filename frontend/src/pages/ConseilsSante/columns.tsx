import { Button, Space, Tag, Tooltip, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { CATEGORIE_CONSEIL_LABELS } from '@/constants'
import { formatDate } from '@/utils'
import type { ConseilSante } from '@/types'

const { Text } = Typography

interface GetConseilsSanteColumnsParams {
  onEdit: (record: ConseilSante) => void
  onDelete: (record: ConseilSante) => void
  onTogglePublish: (record: ConseilSante) => void
}

export function getConseilsSanteColumns({
  onEdit,
  onDelete,
  onTogglePublish,
}: GetConseilsSanteColumnsParams): ColumnsType<ConseilSante> {
  return [
    { title: 'Titre', dataIndex: 'titre', key: 'titre', sorter: true, ellipsis: true },
    {
      title: 'Catégorie',
      key: 'categorie',
      render: (_, record) =>
        record.categorie ? <Tag color="blue">{CATEGORIE_CONSEIL_LABELS[record.categorie]}</Tag> : '-',
    },
    {
      title: 'Établissement',
      key: 'etablissement',
      render: (_, record) => record.etablissementNom ?? 'Conseil général',
    },
    {
      title: 'Document',
      key: 'pdf',
      render: (_, record) =>
        record.pdfFileName ? (
          <Tag icon={<FilePdfOutlined />} color="red">
            {record.pdfFileName}
          </Tag>
        ) : (
          <Text type="secondary">Aucun PDF</Text>
        ),
    },
    {
      title: 'Statut',
      dataIndex: 'publie',
      key: 'publie',
      render: (publie: boolean) => <Tag color={publie ? 'success' : 'default'}>{publie ? 'Publié' : 'Brouillon'}</Tag>,
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
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title={record.publie ? 'Dépublier' : 'Publier'}>
            <Button
              type="text"
              icon={record.publie ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => onTogglePublish(record)}
              aria-label={record.publie ? 'Dépublier' : 'Publier'}
            />
          </Tooltip>
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