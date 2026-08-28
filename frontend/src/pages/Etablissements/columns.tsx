import { Button, Space, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { StatusTag } from '@/components'
import type { EtablissementSante, Localisation } from '@/types'

interface GetEtablissementsColumnsParams {
  localisations: Localisation[]
  onEdit: (record: EtablissementSante) => void
  onDelete: (record: EtablissementSante) => void
}

export function getEtablissementsColumns({ localisations, onEdit, onDelete }: GetEtablissementsColumnsParams): ColumnsType<EtablissementSante> {
  return [
    { title: 'Nom', dataIndex: 'nom', key: 'nom', sorter: true },
    { title: 'Type', key: 'typeEtablissement', render: (_, record) => record.typeEtablissementNom ?? '-' },
    { title: 'Téléphone', dataIndex: 'telephone', key: 'telephone' },
    { title: 'E-mail', dataIndex: 'email', key: 'email', ellipsis: true },
    {
      title: 'Localisation',
      key: 'localisation',
      render: (_, record) => {
        const localisation = localisations.find((item) => item.etablissementId === record.id)
        return localisation ? `${localisation.ville}${localisation.quartier ? `, ${localisation.quartier}` : ''}` : '-'
      },
    },
    { title: '24h/24', dataIndex: 'ouvert24h', key: 'ouvert24h', render: (ouvert24h: boolean) => <Tag color={ouvert24h ? 'green' : 'default'}>{ouvert24h ? 'Oui' : 'Non'}</Tag> },
    { title: 'Statut', dataIndex: 'actif', key: 'actif', render: (actif: boolean) => <StatusTag actif={actif} /> },
    {
      title: 'Actions', key: 'actions', fixed: 'right', width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title="Modifier"><Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} aria-label="Modifier" /></Tooltip>
          <Tooltip title="Supprimer"><Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} aria-label="Supprimer" /></Tooltip>
        </Space>
      ),
    },
  ]
}
