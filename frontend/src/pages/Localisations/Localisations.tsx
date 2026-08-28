import { useState } from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, FormDrawer, PageHeader } from '@/components'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'
import {
  useCreateLocalisation,
  useDeleteLocalisation,
  useEtablissementsQuery,
  useLocalisationsQuery,
  useUpdateLocalisation,
} from '@/hooks/useLocalisations'
import { getLocalisationsColumns } from './columns'
import { localisationFormSchema, type LocalisationFormValues } from './localisationFormSchema'
import type { Localisation } from '@/types'

const emptyValues: LocalisationFormValues = {
  etablissementId: 0,
  adresse: '',
  ville: '',
  quartier: '',
  latitude: 0,
  longitude: 0,
}

function Localisations() {
  const { data, isLoading } = useLocalisationsQuery()
  const { data: etablissements, isLoading: isLoadingEtablissements } = useEtablissementsQuery()
  const { mutate: createLocalisation, isPending: isCreating } = useCreateLocalisation()
  const { mutate: updateLocalisation, isPending: isUpdating } = useUpdateLocalisation()
  const { mutate: deleteLocalisation } = useDeleteLocalisation()
  const confirmDelete = useConfirmDelete()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingLocalisation, setEditingLocalisation] = useState<Localisation | null>(null)
  const isEditMode = editingLocalisation !== null

  const { control, handleSubmit, reset, formState: { errors } } = useForm<LocalisationFormValues>({
    resolver: zodResolver(localisationFormSchema),
    defaultValues: emptyValues,
  })

  const openCreateDrawer = () => {
    setEditingLocalisation(null)
    reset(emptyValues)
    setDrawerOpen(true)
  }

  const openEditDrawer = (record: Localisation) => {
    setEditingLocalisation(record)
    reset({
      etablissementId: record.etablissementId,
      adresse: record.adresse,
      ville: record.ville ?? '',
      quartier: record.quartier ?? '',
      latitude: record.latitude,
      longitude: record.longitude,
    })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingLocalisation(null)
  }

  const onSubmit = (values: LocalisationFormValues) => {
    const { etablissementId, ...payload } = values
    if (isEditMode && editingLocalisation) {
      updateLocalisation({ id: editingLocalisation.id, payload }, { onSuccess: closeDrawer })
      return
    }
    createLocalisation({ etablissementId, payload }, { onSuccess: closeDrawer })
  }

  const handleDelete = (record: Localisation) => {
    const etablissementNom =
      etablissements?.find((etablissement) => etablissement.id === record.etablissementId)?.nom ??
      'cet etablissement'

    confirmDelete({
      title: `Supprimer la localisation de "${etablissementNom}" ?`,
      content: 'Cette action est irreversible.',
      onConfirm: () => deleteLocalisation(record.id),
    })
  }

  const columns = getLocalisationsColumns({
    etablissements: etablissements ?? [],
    onEdit: openEditDrawer,
    onDelete: handleDelete,
  })

  return (
    <div>
      <PageHeader
        title="Localisations"
        subtitle="Gerez les adresses et coordonnees des etablissements de sante."
        actionLabel="Ajouter une localisation"
        onAction={openCreateDrawer}
      />

      <DataTable<Localisation>
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        rowKey="id"
        searchableFields={['adresse', 'ville', 'quartier']}
        searchPlaceholder="Rechercher une localisation..."
        emptyDescription="Aucune localisation trouvee"
      />

      <FormDrawer
        title={isEditMode ? 'Modifier la localisation' : 'Ajouter une localisation'}
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

          <Form.Item label="Adresse" validateStatus={errors.adresse ? 'error' : ''} help={errors.adresse?.message}>
            <Controller name="adresse" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>
          <Form.Item label="Ville" validateStatus={errors.ville ? 'error' : ''} help={errors.ville?.message}>
            <Controller name="ville" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>
          <Form.Item label="Quartier" validateStatus={errors.quartier ? 'error' : ''} help={errors.quartier?.message}>
            <Controller name="quartier" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>
          <Form.Item label="Latitude" validateStatus={errors.latitude ? 'error' : ''} help={errors.latitude?.message}>
            <Controller name="latitude" control={control} render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} />} />
          </Form.Item>
          <Form.Item label="Longitude" validateStatus={errors.longitude ? 'error' : ''} help={errors.longitude?.message}>
            <Controller name="longitude" control={control} render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} />} />
          </Form.Item>
        </Form>
      </FormDrawer>
    </div>
  )
}

export default Localisations
