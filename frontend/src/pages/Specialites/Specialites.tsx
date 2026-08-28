import { useState } from 'react'
import { Form, Input, Switch } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, FormDrawer, PageHeader } from '@/components'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'
import {
  useCreateSpecialite,
  useDeleteSpecialite,
  useSpecialitesQuery,
  useUpdateSpecialite,
} from '@/hooks/useSpecialites'
import { specialiteFormSchema, type SpecialiteFormValues } from './specialiteFormSchema'
import { getSpecialitesColumns } from './columns'
import type { SpecialiteMedicale } from '@/types'

const { TextArea } = Input

const emptyValues: SpecialiteFormValues = {
  nom: '',
  description: '',
  actif: true,
}

function Specialites() {
  const { data, isLoading } = useSpecialitesQuery()
  const { mutate: createSpecialite, isPending: isCreating } = useCreateSpecialite()
  const { mutate: updateSpecialite, isPending: isUpdating } = useUpdateSpecialite()
  const { mutate: deleteSpecialite } = useDeleteSpecialite()
  const confirmDelete = useConfirmDelete()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingSpecialite, setEditingSpecialite] = useState<SpecialiteMedicale | null>(null)
  const isEditMode = editingSpecialite !== null

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpecialiteFormValues>({
    resolver: zodResolver(specialiteFormSchema),
    defaultValues: emptyValues,
  })

  const openCreateDrawer = () => {
    setEditingSpecialite(null)
    reset(emptyValues)
    setDrawerOpen(true)
  }

  const openEditDrawer = (record: SpecialiteMedicale) => {
    setEditingSpecialite(record)
    reset({ nom: record.nom, description: record.description, actif: record.actif })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingSpecialite(null)
  }

  const onSubmit = (values: SpecialiteFormValues) => {
    if (isEditMode && editingSpecialite) {
      updateSpecialite(
        { id: editingSpecialite.id, payload: values },
        { onSuccess: closeDrawer },
      )
    } else {
      createSpecialite(values, { onSuccess: closeDrawer })
    }
  }

  const handleDelete = (record: SpecialiteMedicale) => {
    confirmDelete({
      title: `Supprimer la spécialité "${record.nom}" ?`,
      content: 'Cette action est irréversible.',
      onConfirm: () => deleteSpecialite(record.id),
    })
  }

  const columns = getSpecialitesColumns({ onEdit: openEditDrawer, onDelete: handleDelete })

  return (
    <div>
      <PageHeader
        title="Spécialités médicales"
        subtitle="Gérez la liste des spécialités médicales disponibles sur la plateforme."
        actionLabel="Ajouter une spécialité"
        onAction={openCreateDrawer}
      />

      <DataTable<SpecialiteMedicale>
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        rowKey="id"
        searchableFields={['nom', 'description']}
        searchPlaceholder="Rechercher une spécialité..."
        emptyDescription="Aucune spécialité trouvée"
      />

      <FormDrawer
        title={isEditMode ? 'Modifier la spécialité' : 'Ajouter une spécialité'}
        open={drawerOpen}
        onClose={closeDrawer}
        onSubmit={handleSubmit(onSubmit)}
        loading={isCreating || isUpdating}
        submitLabel={isEditMode ? 'Enregistrer' : 'Créer'}
      >
        <Form layout="vertical">
          <Form.Item label="Nom" validateStatus={errors.nom ? 'error' : ''} help={errors.nom?.message}>
            <Controller name="nom" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item
            label="Description"
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => <TextArea {...field} rows={4} />}
            />
          </Form.Item>

          <Form.Item label="Statut actif">
            <Controller
              name="actif"
              control={control}
              render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />}
            />
          </Form.Item>
        </Form>
      </FormDrawer>
    </div>
  )
}

export default Specialites
