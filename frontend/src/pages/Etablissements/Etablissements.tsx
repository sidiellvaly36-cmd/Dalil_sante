import { useState } from 'react'
import { Alert, Divider, Form, Input, Select, Switch, Typography } from 'antd'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, FormDrawer, MapLocationPicker, PageHeader } from '@/components'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'
import {
  useCreateEtablissement,
  useDeleteEtablissement,
  useEtablissementsQuery,
  useTypesEtablissementQuery,
  useUpdateEtablissement,
} from '@/hooks/useEtablissements'
import { useCreateLocalisation, useLocalisationsQuery, useUpdateLocalisation } from '@/hooks/useLocalisations'
import { getEtablissementsColumns } from './columns'
import { etablissementFormSchema, type EtablissementFormValues } from './etablissementFormSchema'
import type { EtablissementSante, LocalisationPayload } from '@/types'

const { TextArea } = Input
const { Text } = Typography
const emptyValues: EtablissementFormValues = { nom: '', telephone: '', email: '', description: '', ouvert24h: false, actif: true, typeEtablissementId: 0, adresse: '', ville: '', quartier: '', latitude: null, longitude: null }

function Etablissements() {
  const { data, isLoading } = useEtablissementsQuery()
  const { data: types, isLoading: isLoadingTypes } = useTypesEtablissementQuery()
  const { data: localisations } = useLocalisationsQuery()
  const { mutate: createEtablissement, isPending: isCreating } = useCreateEtablissement()
  const { mutate: updateEtablissement, isPending: isUpdating } = useUpdateEtablissement()
  const { mutate: deleteEtablissement } = useDeleteEtablissement()
  const { mutate: createLocalisation, isPending: isCreatingLocalisation } = useCreateLocalisation()
  const { mutate: updateLocalisation, isPending: isUpdatingLocalisation } = useUpdateLocalisation()
  const confirmDelete = useConfirmDelete()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingEtablissement, setEditingEtablissement] = useState<EtablissementSante | null>(null)
  const [editingLocalisationId, setEditingLocalisationId] = useState<number | null>(null)
  const isEditMode = editingEtablissement !== null
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<EtablissementFormValues>({ resolver: zodResolver(etablissementFormSchema), defaultValues: emptyValues })
  const latitude = useWatch({ control, name: 'latitude' })
  const longitude = useWatch({ control, name: 'longitude' })

  const openCreateDrawer = () => { setEditingEtablissement(null); setEditingLocalisationId(null); reset(emptyValues); setDrawerOpen(true) }
  const openEditDrawer = (record: EtablissementSante) => {
    const existingLocalisation = localisations?.find((loc) => loc.etablissementId === record.id) ?? null
    setEditingEtablissement(record)
    setEditingLocalisationId(existingLocalisation?.id ?? null)
    reset({
      nom: record.nom,
      telephone: record.telephone ?? '',
      email: record.email ?? '',
      description: record.description ?? '',
      ouvert24h: record.ouvert24h,
      actif: record.actif,
      typeEtablissementId: record.typeEtablissementId,
      adresse: existingLocalisation?.adresse ?? '',
      ville: existingLocalisation?.ville ?? '',
      quartier: existingLocalisation?.quartier ?? '',
      latitude: existingLocalisation?.latitude ?? null,
      longitude: existingLocalisation?.longitude ?? null,
    })
    setDrawerOpen(true)
  }
  const closeDrawer = () => { setDrawerOpen(false); setEditingEtablissement(null); setEditingLocalisationId(null) }

  const onSubmit = ({ typeEtablissementId, adresse, ville, quartier, latitude: lat, longitude: lng, ...payload }: EtablissementFormValues) => {
    const hasPosition = lat !== null && lng !== null
    const saveLocation = (etablissementId: number) => {
      if (!hasPosition) { closeDrawer(); return }
      const locPayload: LocalisationPayload = { adresse: adresse ?? '', ville: ville ?? '', quartier: quartier ?? '', latitude: lat, longitude: lng }
      if (editingLocalisationId) { updateLocalisation({ id: editingLocalisationId, payload: locPayload }, { onSuccess: closeDrawer }); return }
      createLocalisation({ etablissementId, payload: locPayload }, { onSuccess: closeDrawer })
    }

    if (isEditMode && editingEtablissement) {
      updateEtablissement({ id: editingEtablissement.id, payload }, { onSuccess: () => saveLocation(editingEtablissement.id) })
      return
    }
    createEtablissement({ typeId: typeEtablissementId, payload }, { onSuccess: (created) => saveLocation(created.id) })
  }

  const handleDelete = (record: EtablissementSante) => confirmDelete({ title: `Supprimer l'établissement "${record.nom}" ?`, content: 'Cette action est irréversible.', onConfirm: () => deleteEtablissement(record.id) })
  const columns = getEtablissementsColumns({ localisations: localisations ?? [], onEdit: openEditDrawer, onDelete: handleDelete })
  const isSaving = isCreating || isUpdating || isCreatingLocalisation || isUpdatingLocalisation

  return <div>
    <PageHeader title="Établissements de santé" subtitle="Gérez les établissements et consultez leur localisation existante." actionLabel="Ajouter un établissement" onAction={openCreateDrawer} />
    <DataTable<EtablissementSante> columns={columns} data={data ?? []} loading={isLoading} rowKey="id" searchableFields={['nom', 'telephone', 'email', 'description']} searchPlaceholder="Rechercher un établissement..." emptyDescription="Aucun établissement trouvé" />
    <FormDrawer title={isEditMode ? "Modifier l'établissement" : 'Ajouter un établissement'} open={drawerOpen} onClose={closeDrawer} onSubmit={handleSubmit(onSubmit)} loading={isSaving} submitLabel={isEditMode ? 'Enregistrer' : 'Créer'} width="min(560px, 100vw)">
      <Form layout="vertical">
        <Text strong>Informations de l'établissement</Text>
        <Form.Item label="Nom" validateStatus={errors.nom ? 'error' : ''} help={errors.nom?.message} style={{ marginTop: 12 }}><Controller name="nom" control={control} render={({ field }) => <Input {...field} />} /></Form.Item>
        <Form.Item label="Type d'établissement" validateStatus={errors.typeEtablissementId ? 'error' : ''} help={errors.typeEtablissementId?.message}><Controller name="typeEtablissementId" control={control} render={({ field }) => <Select value={field.value || undefined} onChange={field.onChange} options={types?.map((type) => ({ value: type.id, label: type.nom, disabled: !type.actif && !isEditMode }))} placeholder="Sélectionnez un type" loading={isLoadingTypes} disabled={isEditMode} />} /></Form.Item>
        <Form.Item label="Téléphone" validateStatus={errors.telephone ? 'error' : ''} help={errors.telephone?.message}><Controller name="telephone" control={control} render={({ field }) => <Input {...field} />} /></Form.Item>
        <Form.Item label="E-mail" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}><Controller name="email" control={control} render={({ field }) => <Input {...field} />} /></Form.Item>
        <Form.Item label="Description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}><Controller name="description" control={control} render={({ field }) => <TextArea {...field} rows={4} />} /></Form.Item>
        <Form.Item label="Ouvert 24h/24"><Controller name="ouvert24h" control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />} /></Form.Item>
        <Form.Item label="Statut actif"><Controller name="actif" control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />} /></Form.Item>

        <Divider style={{ margin: '8px 0 16px' }} />
        <Text strong>Localisation de l'établissement</Text>
        <Alert
          type="info"
          showIcon
          message="Cliquez sur la carte ou faites glisser le repère pour définir l'emplacement exact."
          style={{ margin: '12px 0' }}
        />

        <Form.Item label="Adresse" validateStatus={errors.adresse ? 'error' : ''} help={errors.adresse?.message}>
          <Controller name="adresse" control={control} render={({ field }) => <Input {...field} placeholder="Rue, avenue..." />} />
        </Form.Item>
        <Form.Item label="Ville">
          <Controller name="ville" control={control} render={({ field }) => <Input {...field} placeholder="Nouakchott..." />} />
        </Form.Item>
        <Form.Item label="Quartier">
          <Controller name="quartier" control={control} render={({ field }) => <Input {...field} placeholder="Tevragh-Zeina..." />} />
        </Form.Item>

        <Form.Item label="Carte">
          <MapLocationPicker
            latitude={latitude}
            longitude={longitude}
            onPick={(lat, lng) => { setValue('latitude', lat, { shouldValidate: true }); setValue('longitude', lng, { shouldValidate: true }) }}
          />
        </Form.Item>

        <Form.Item label="Coordonnées sélectionnées">
          {latitude !== null && longitude !== null ? (
            <Text>Latitude : {latitude.toFixed(5)} — Longitude : {longitude.toFixed(5)}</Text>
          ) : (
            <Text type="secondary">Aucun emplacement sélectionné pour le moment.</Text>
          )}
        </Form.Item>
      </Form>
    </FormDrawer>
  </div>
}

export default Etablissements