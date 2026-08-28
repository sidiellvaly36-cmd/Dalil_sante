import { Button, Space, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { EtablissementSante, Localisation } from '@/types'

interface GetLocalisationsColumnsParams {
  etablissements: EtablissementSante[]
  onEdit: (record: Localisation) => void
  onDelete: (record: Localisation) => void
}

export function getLocalisationsColumns({
  etablissements,
  onEdit,
  onDelete,
}: GetLocalisationsColumnsParams): ColumnsType<Localisation> {
  return [
    {
      title: 'Etablissement',
      key: 'etablissement',
      render: (_, record) =>
        etablissements.find((etablissement) => etablissement.id === record.etablissementId)?.nom ?? '-',
    },
    { title: 'Adresse', dataIndex: 'adresse', key: 'adresse', ellipsis: true },
    { title: 'Ville', dataIndex: 'ville', key: 'ville', sorter: true },
    { title: 'Quartier', dataIndex: 'quartier', key: 'quartier' },
    { title: 'Coordonnees', key: 'coordinates', render: (_, record) => `${record.latitude}, ${record.longitude}` },
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
