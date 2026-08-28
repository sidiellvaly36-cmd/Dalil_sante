import { Button, Space, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { JOUR_SEMAINE_LABELS, JOUR_SEMAINE_ORDER } from '@/constants'
import type { EtablissementSante, Horaire } from '@/types'

interface GetHorairesColumnsParams {
  etablissements: EtablissementSante[]
  onEdit: (record: Horaire) => void
  onDelete: (record: Horaire) => void
}

export function getHorairesColumns({
  etablissements,
  onEdit,
  onDelete,
}: GetHorairesColumnsParams): ColumnsType<Horaire> {
  return [
    {
      title: 'Etablissement',
      key: 'etablissement',
      render: (_, record) =>
        etablissements.find((etablissement) => etablissement.id === record.etablissementId)?.nom ?? '-',
    },
    {
      title: 'Jour', dataIndex: 'jourSemaine', key: 'jourSemaine', sorter: (a, b) => JOUR_SEMAINE_ORDER[a.jourSemaine] - JOUR_SEMAINE_ORDER[b.jourSemaine],
      render: (jourSemaine: Horaire['jourSemaine']) => JOUR_SEMAINE_LABELS[jourSemaine],
    },
    { title: "Ouverture", dataIndex: 'heureOuverture', key: 'heureOuverture', render: (heure: string, record) => record.ferme ? '-' : heure },
    { title: 'Fermeture', dataIndex: 'heureFermeture', key: 'heureFermeture', render: (heure: string, record) => record.ferme ? '-' : heure },
    { title: 'Statut', dataIndex: 'ferme', key: 'ferme', render: (ferme: boolean) => <Tag color={ferme ? 'default' : 'green'}>{ferme ? 'Ferme' : 'Ouvert'}</Tag> },
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
