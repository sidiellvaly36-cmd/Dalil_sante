import { useEffect, useState } from 'react'
import { Alert, App, Button, Form, Input, Select, Switch } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, FormDrawer, PageHeader } from '@/components'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'
import {
  useCreateServiceMedical,
  useDeleteServiceMedical,
  useServicesMedicauxQuery,
  useUpdateServiceMedical,
} from '@/hooks/useServicesMedicaux'
import { useAddServiceToEtablissements, useEtablissementsQuery } from '@/hooks/useEtablissements'
import { serviceMedicalFormSchema, type ServiceMedicalFormValues } from './serviceMedicalFormSchema'
import { getServicesColumns } from './columns'
import type { ServiceMedical } from '@/types'

const { TextArea } = Input

const emptyValues: ServiceMedicalFormValues = {
  nom: '',
  description: '',
  actif: true,
}

function ServicesMedicaux() {
  const { data, isLoading } = useServicesMedicauxQuery()
  const {
    data: etablissements,
    isLoading: isLoadingEtablissements,
    isError: isEtablissementsError,
  } = useEtablissementsQuery()
  const { mutateAsync: createService, isPending: isCreating } = useCreateServiceMedical()
  const { mutateAsync: updateService, isPending: isUpdating } = useUpdateServiceMedical()
  const { mutateAsync: addServiceToEtablissements, isPending: isLinking } = useAddServiceToEtablissements()
  const { mutate: deleteService } = useDeleteServiceMedical()
  const confirmDelete = useConfirmDelete()
  const { message } = App.useApp()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceMedical | null>(null)
  const [selectedEtablissementIds, setSelectedEtablissementIds] = useState<number[]>([])
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const isEditMode = editingService !== null
  const allEtablissementIds = (etablissements ?? []).map((etablissement) => etablissement.id)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceMedicalFormValues>({
    resolver: zodResolver(serviceMedicalFormSchema),
    defaultValues: emptyValues,
  })

  const openCreateDrawer = () => {
    setEditingService(null)
    setSelectedEtablissementIds([])
    setSelectionError(null)
    reset(emptyValues)
    setDrawerOpen(true)
  }

  const openEditDrawer = (record: ServiceMedical) => {
    setEditingService(record)
    setSelectedEtablissementIds(
      (etablissements ?? [])
        .filter((etablissement) => etablissement.services.some((service) => service.id === record.id))
        .map((etablissement) => etablissement.id),
    )
    setSelectionError(null)
    reset({ nom: record.nom, description: record.description, actif: record.actif })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingService(null)
    setSelectedEtablissementIds([])
    setSelectionError(null)
  }

  useEffect(() => {
    if (!editingService) return

    setSelectedEtablissementIds(
      (etablissements ?? [])
        .filter((etablissement) => etablissement.services.some((service) => service.id === editingService.id))
        .map((etablissement) => etablissement.id),
    )
  }, [editingService, etablissements])

  const getExistingLinkedEtablissementIds = () =>
    editingService
      ? (etablissements ?? [])
          .filter((etablissement) => etablissement.services.some((service) => service.id === editingService.id))
          .map((etablissement) => etablissement.id)
      : []

  const handleEtablissementSelectionChange = (nextIds: number[]) => {
    const existingIds = getExistingLinkedEtablissementIds()
    const removedExistingIds = existingIds.filter((id) => !nextIds.includes(id))

    if (removedExistingIds.length > 0) {
      message.warning("La suppression d'une association service-etablissement n'est pas disponible actuellement.")
      setSelectedEtablissementIds([...new Set([...nextIds, ...existingIds])])
      return
    }

    setSelectedEtablissementIds(nextIds)
    if (nextIds.length > 0) setSelectionError(null)
  }

  const selectAllEtablissements = () => {
    handleEtablissementSelectionChange(allEtablissementIds)
  }

  const onSubmit = async (values: ServiceMedicalFormValues) => {
    if (!isEditMode && selectedEtablissementIds.length === 0) {
      setSelectionError('Selectionnez au moins un etablissement.')
      return
    }

    let serviceWasSaved = false

    try {
      if (isEditMode && editingService) {
        await updateService({ id: editingService.id, payload: values })
        serviceWasSaved = true

        const existingIds = getExistingLinkedEtablissementIds()
        const newEtablissementIds = selectedEtablissementIds.filter((id) => !existingIds.includes(id))

        if (newEtablissementIds.length > 0) {
          await addServiceToEtablissements({ serviceId: editingService.id, etablissementIds: newEtablissementIds })
        }
      } else {
        const createdService = await createService(values)
        serviceWasSaved = true
        await addServiceToEtablissements({ serviceId: createdService.id, etablissementIds: selectedEtablissementIds })
      }

      closeDrawer()
    } catch {
      if (serviceWasSaved) {
        message.error(
          isEditMode
            ? "Le service a ete modifie, mais l'association aux etablissements peut etre partielle."
            : "Le service a ete cree, mais l'association aux etablissements peut etre partielle.",
        )
      }
    }
  }

  const handleDelete = (record: ServiceMedical) => {
    confirmDelete({
      title: `Supprimer le service "${record.nom}" ?`,
      content: 'Cette action est irréversible.',
      onConfirm: () => deleteService(record.id),
    })
  }

  const columns = getServicesColumns({ onEdit: openEditDrawer, onDelete: handleDelete })

  return (
    <div>
      <PageHeader
        title="Services médicaux"
        subtitle="Gérez la liste des services médicaux proposés sur la plateforme."
        actionLabel="Ajouter un service"
        onAction={openCreateDrawer}
      />

      <DataTable<ServiceMedical>
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        rowKey="id"
        searchableFields={['nom', 'description']}
        searchPlaceholder="Rechercher un service..."
        emptyDescription="Aucun service trouvé"
      />

      <FormDrawer
        title={isEditMode ? 'Modifier le service' : 'Ajouter un service'}
        open={drawerOpen}
        onClose={closeDrawer}
        onSubmit={handleSubmit(onSubmit)}
        loading={isCreating || isUpdating || isLinking}
        submitLabel={isEditMode ? 'Enregistrer' : 'Créer'}
        width="min(480px, 100vw)"
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

          <Form.Item
            label={'\u00C9tablissements de sant\u00E9'}
            validateStatus={selectionError ? 'error' : ''}
            help={selectionError ?? undefined}
          >
            {isEtablissementsError && (
              <Alert
                type="error"
                showIcon
                message="Erreur de chargement"
                description="Impossible de recuperer les etablissements de sante."
                style={{ marginBottom: 12 }}
              />
            )}

            {!isLoadingEtablissements && !isEtablissementsError && allEtablissementIds.length === 0 && (
              <Alert
                type="warning"
                showIcon
                message="Aucun etablissement disponible"
                description="Creez d'abord un etablissement de sante avant de creer un service medical."
                style={{ marginBottom: 12 }}
              />
            )}

            {isEditMode && (
              <Alert
                type="info"
                showIcon
                message="Les associations existantes sont conservees"
                description="Vous pouvez ajouter des etablissements, mais la suppression d'une association n'est pas disponible actuellement."
                style={{ marginBottom: 12 }}
              />
            )}

            <Select
              mode="multiple"
              allowClear={!isEditMode}
              showSearch
              maxTagCount="responsive"
              value={selectedEtablissementIds}
              onChange={handleEtablissementSelectionChange}
              options={(etablissements ?? []).map((etablissement) => ({
                value: etablissement.id,
                label: etablissement.nom,
              }))}
              placeholder="Selectionnez un ou plusieurs etablissements"
              loading={isLoadingEtablissements}
              disabled={isLoadingEtablissements || isEtablissementsError || allEtablissementIds.length === 0}
              style={{ width: '100%' }}
            />

            <Button
              type="link"
              block
              onClick={selectAllEtablissements}
              disabled={isLoadingEtablissements || isEtablissementsError || allEtablissementIds.length === 0}
              style={{ marginTop: 8 }}
            >
              {'S\u00E9lectionner tous les \u00E9tablissements'}
            </Button>
          </Form.Item>
        </Form>
      </FormDrawer>
    </div>
  )
}

export default ServicesMedicaux
