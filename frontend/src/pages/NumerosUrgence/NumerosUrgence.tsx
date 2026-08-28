import { useState } from 'react'
import { Form, Input, Select } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, FormDrawer, PageHeader } from '@/components'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'
import {
  useCreateNumeroUrgence,
  useDeleteNumeroUrgence,
  useNumerosUrgenceQuery,
  useUpdateNumeroUrgence,
} from '@/hooks/useNumeroUrgence'
import { useEtablissementsQuery } from '@/hooks/useEtablissements'
import { getNumerosUrgenceColumns } from './columns'
import { numeroUrgenceFormSchema, type NumeroUrgenceFormValues } from './numeroUrgenceFormSchema'
import type { NumeroUrgence, NumeroUrgencePayload } from '@/types'

const { TextArea } = Input

const emptyValues: NumeroUrgenceFormValues = {
  nom: '',
  numero: '',
  description: '',
  etablissementId: null,
}

/**
 * Gestion des Numéros d'urgence (espace ADMIN) - CRUD réel sur
 * /api/numeros-urgence, y compris le rattachement optionnel à un établissement
 * de santé réel (EtablissementSante). Aucune notion de "Médecin" n'existe ni
 * n'est introduite : la seule relation possible est NumeroUrgence →
 * EtablissementSante (ou aucune établissement pour un numéro général comme la
 * Protection Civile).
 */
function NumerosUrgence() {
  const { data, isLoading } = useNumerosUrgenceQuery()
  const { data: etablissements } = useEtablissementsQuery()
  const { mutate: createNumeroUrgence, isPending: isCreating } = useCreateNumeroUrgence()
  const { mutate: updateNumeroUrgence, isPending: isUpdating } = useUpdateNumeroUrgence()
  const { mutate: deleteNumeroUrgence } = useDeleteNumeroUrgence()
  const confirmDelete = useConfirmDelete()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingNumero, setEditingNumero] = useState<NumeroUrgence | null>(null)
  const isEditMode = editingNumero !== null

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NumeroUrgenceFormValues>({
    resolver: zodResolver(numeroUrgenceFormSchema),
    defaultValues: emptyValues,
  })

  const openCreateDrawer = () => {
    setEditingNumero(null)
    reset(emptyValues)
    setDrawerOpen(true)
  }

  const openEditDrawer = (record: NumeroUrgence) => {
    setEditingNumero(record)
    reset({
      nom: record.nom,
      numero: record.numero,
      description: record.description,
      etablissementId: record.etablissementId,
    })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingNumero(null)
  }

  const onSubmit = (values: NumeroUrgenceFormValues) => {
    const payload: NumeroUrgencePayload = values

    if (isEditMode && editingNumero) {
      updateNumeroUrgence({ id: editingNumero.id, payload }, { onSuccess: closeDrawer })
    } else {
      createNumeroUrgence(payload, { onSuccess: closeDrawer })
    }
  }

  const handleDelete = (record: NumeroUrgence) => {
    confirmDelete({
      title: `Supprimer le numéro "${record.nom}" ?`,
      content: 'Cette action est irréversible.',
      onConfirm: () => deleteNumeroUrgence(record.id),
    })
  }

  const columns = getNumerosUrgenceColumns({ onEdit: openEditDrawer, onDelete: handleDelete })

  return (
    <div>
      <PageHeader
        title="Numéros d'urgence"
        subtitle="Gérez les numéros d'urgence, avec un rattachement optionnel à un établissement de santé."
        actionLabel="Ajouter un numéro"
        onAction={openCreateDrawer}
      />

      <DataTable<NumeroUrgence>
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        rowKey="id"
        searchableFields={['nom', 'numero', 'description']}
        searchPlaceholder="Rechercher un numéro d'urgence..."
        emptyDescription="Aucun numéro d'urgence trouvé"
      />

      <FormDrawer
        title={isEditMode ? 'Modifier le numéro' : "Ajouter un numéro d'urgence"}
        open={drawerOpen}
        onClose={closeDrawer}
        onSubmit={handleSubmit(onSubmit)}
        loading={isCreating || isUpdating}
        submitLabel={isEditMode ? 'Enregistrer' : 'Créer'}
      >
        <Form layout="vertical">
          <Form.Item label="Nom" validateStatus={errors.nom ? 'error' : ''} help={errors.nom?.message}>
            <Controller name="nom" control={control} render={({ field }) => <Input {...field} placeholder="SAMU" />} />
          </Form.Item>

          <Form.Item label="Numéro" validateStatus={errors.numero ? 'error' : ''} help={errors.numero?.message}>
            <Controller name="numero" control={control} render={({ field }) => <Input {...field} placeholder="15" />} />
          </Form.Item>

          <Form.Item
            label="Description"
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => <TextArea {...field} rows={3} placeholder="Urgences médicales" />}
            />
          </Form.Item>

          <Form.Item label="Établissement de santé (optionnel)">
            <Controller
              name="etablissementId"
              control={control}
              render={({ field }) => (
                <Select
                  allowClear
                  value={field.value ?? undefined}
                  onChange={(value) => field.onChange(value ?? null)}
                  options={etablissements?.map((etablissement) => ({
                    value: etablissement.id,
                    label: etablissement.nom,
                  }))}
                  placeholder="Numéro général (aucun établissement)"
                />
              )}
            />
          </Form.Item>
        </Form>
      </FormDrawer>
    </div>
  )
}

export default NumerosUrgence