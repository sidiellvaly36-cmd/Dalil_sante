import { useState } from 'react'
import { Form, Input, Select, Switch } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, FormDrawer, PageHeader } from '@/components'
import { JOUR_SEMAINE_OPTIONS } from '@/constants'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'
import { useEtablissementsQuery } from '@/hooks/useLocalisations'
import { useCreateHoraire, useDeleteHoraire, useHorairesQuery, useUpdateHoraire } from '@/hooks/useHoraires'
import { getHorairesColumns } from './columns'
import { horaireFormSchema, type HoraireFormValues } from './horaireFormSchema'
import type { Horaire } from '@/types'

const emptyValues: HoraireFormValues = {
  etablissementId: 0,
  jourSemaine: 'MONDAY',
  heureOuverture: '',
  heureFermeture: '',
  ferme: false,
}

function LocalTimeInput({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled: boolean }) {
  return <Input type="time" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} />
}

function Horaires() {
  const { data, isLoading } = useHorairesQuery()
  const { data: etablissements, isLoading: isLoadingEtablissements } = useEtablissementsQuery()
  const { mutate: createHoraire, isPending: isCreating } = useCreateHoraire()
  const { mutate: updateHoraire, isPending: isUpdating } = useUpdateHoraire()
  const { mutate: deleteHoraire } = useDeleteHoraire()
  const confirmDelete = useConfirmDelete()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingHoraire, setEditingHoraire] = useState<Horaire | null>(null)
  const isEditMode = editingHoraire !== null

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<HoraireFormValues>({
    resolver: zodResolver(horaireFormSchema),
    defaultValues: emptyValues,
  })
  const isClosed = watch('ferme')

  const openCreateDrawer = () => {
    setEditingHoraire(null)
    reset(emptyValues)
    setDrawerOpen(true)
  }

  const openEditDrawer = (record: Horaire) => {
    setEditingHoraire(record)
    reset({
      etablissementId: record.etablissementId,
      jourSemaine: record.jourSemaine,
      heureOuverture: record.heureOuverture?.slice(0, 5) ?? '',
      heureFermeture: record.heureFermeture?.slice(0, 5) ?? '',
      ferme: record.ferme,
    })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingHoraire(null)
  }

  const onSubmit = (values: HoraireFormValues) => {
    const { etablissementId, ...payload } = values
    if (isEditMode && editingHoraire) {
      updateHoraire({ id: editingHoraire.id, payload }, { onSuccess: closeDrawer })
      return
    }
    createHoraire({ etablissementId, payload }, { onSuccess: closeDrawer })
  }

  const handleDelete = (record: Horaire) => {
    const etablissementNom =
      etablissements?.find((etablissement) => etablissement.id === record.etablissementId)?.nom ??
      'cet etablissement'

    confirmDelete({
      title: `Supprimer l'horaire de "${etablissementNom}" ?`,
      content: 'Cette action est irreversible.',
      onConfirm: () => deleteHoraire(record.id),
    })
  }

  const columns = getHorairesColumns({
    etablissements: etablissements ?? [],
    onEdit: openEditDrawer,
    onDelete: handleDelete,
  })

  return (
    <div>
      <PageHeader
        title="Horaires"
        subtitle="Gerez les horaires d'ouverture des etablissements de sante."
        actionLabel="Ajouter un horaire"
        onAction={openCreateDrawer}
      />

      <DataTable<Horaire>
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        rowKey="id"
        searchableFields={['jourSemaine']}
        searchPlaceholder="Rechercher un jour..."
        emptyDescription="Aucun horaire trouve"
      />

      <FormDrawer
        title={isEditMode ? "Modifier l'horaire" : 'Ajouter un horaire'}
        open={drawerOpen}
        onClose={closeDrawer}
        onSubmit={handleSubmit(onSubmit)}
        loading={isCreating || isUpdating}
        submitLabel={isEditMode ? 'Enregistrer' : 'Creer'}
      >
        <Form layout="vertical">
          <Form.Item label="Etablissement" validateStatus={errors.etablissementId ? 'error' : ''} help={errors.etablissementId?.message}>
            <Controller
              name="etablissementId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={etablissements?.map((etablissement) => ({ value: etablissement.id, label: etablissement.nom }))}
                  placeholder="Selectionnez un etablissement"
                  loading={isLoadingEtablissements}
                  disabled={isEditMode}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Jour" validateStatus={errors.jourSemaine ? 'error' : ''} help={errors.jourSemaine?.message}>
            <Controller name="jourSemaine" control={control} render={({ field }) => <Select {...field} options={JOUR_SEMAINE_OPTIONS} />} />
          </Form.Item>

          <Form.Item label="Etablissement ferme ce jour">
            <Controller name="ferme" control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />} />
          </Form.Item>

          <Form.Item label="Heure d'ouverture" validateStatus={errors.heureOuverture ? 'error' : ''} help={errors.heureOuverture?.message}>
            <Controller name="heureOuverture" control={control} render={({ field }) => <LocalTimeInput {...field} disabled={isClosed} />} />
          </Form.Item>

          <Form.Item label="Heure de fermeture" validateStatus={errors.heureFermeture ? 'error' : ''} help={errors.heureFermeture?.message}>
            <Controller name="heureFermeture" control={control} render={({ field }) => <LocalTimeInput {...field} disabled={isClosed} />} />
          </Form.Item>
        </Form>
      </FormDrawer>
    </div>
  )
}

export default Horaires
