import { useState } from 'react'
import { Form, Input, Switch } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DataTable, FormDrawer, PageHeader } from '@/components'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'
import { useAdminsQuery, useCreateAdmin, useDeleteAdmin, useUpdateAdmin } from '@/hooks/useAdmins'
import { getUtilisateurFormSchema } from '@/pages/Utilisateurs/utilisateurFormSchema'
import { getAdminsColumns } from './columns'
import type { Utilisateur } from '@/types'

type AdminFormFields = z.infer<ReturnType<typeof getUtilisateurFormSchema>>

const emptyValues: AdminFormFields = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  actif: true,
  password: '',
}

function Administrateurs() {
  const { data, isLoading } = useAdminsQuery()
  const { mutate: createAdmin, isPending: isCreating } = useCreateAdmin()
  const { mutate: updateAdmin, isPending: isUpdating } = useUpdateAdmin()
  const { mutate: deleteAdmin } = useDeleteAdmin()
  const confirmDelete = useConfirmDelete()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Utilisateur | null>(null)
  const isEditMode = editingAdmin !== null

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getUtilisateurFormSchema(isEditMode)),
    defaultValues: emptyValues,
  })

  const openCreateDrawer = () => {
    setEditingAdmin(null)
    reset(emptyValues)
    setDrawerOpen(true)
  }

  const openEditDrawer = (record: Utilisateur) => {
    setEditingAdmin(record)
    reset({
      nom: record.nom,
      prenom: record.prenom,
      email: record.email,
      telephone: record.telephone,
      actif: record.actif,
      password: '',
    })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingAdmin(null)
  }

  const onSubmit = (values: AdminFormFields) => {
    if (isEditMode && editingAdmin) {
      updateAdmin(
        { id: editingAdmin.id, values },
        { onSuccess: closeDrawer },
      )
    } else {
      createAdmin(values, { onSuccess: closeDrawer })
    }
  }

  const handleDelete = (record: Utilisateur) => {
    confirmDelete({
      title: `Supprimer ${record.prenom} ${record.nom} ?`,
      content: 'Cette action est irréversible.',
      onConfirm: () => deleteAdmin(record.id),
    })
  }

  const columns = getAdminsColumns({ onEdit: openEditDrawer, onDelete: handleDelete })

  return (
    <div>
      <PageHeader
        title="Administrateurs"
        subtitle="Gérez les comptes des administrateurs de la plateforme."
        actionLabel="Ajouter un administrateur"
        onAction={openCreateDrawer}
      />

      <DataTable<Utilisateur>
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        rowKey="id"
        searchableFields={['nom', 'prenom', 'email', 'telephone']}
        searchPlaceholder="Rechercher un administrateur..."
        emptyDescription="Aucun administrateur trouvé"
      />

      <FormDrawer
        title={isEditMode ? "Modifier l'administrateur" : 'Ajouter un administrateur'}
        open={drawerOpen}
        onClose={closeDrawer}
        onSubmit={handleSubmit(onSubmit)}
        loading={isCreating || isUpdating}
        submitLabel={isEditMode ? 'Enregistrer' : 'Créer'}
      >
        <Form layout="vertical">
          <Form.Item label="Prénom" validateStatus={errors.prenom ? 'error' : ''} help={errors.prenom?.message}>
            <Controller name="prenom" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item label="Nom" validateStatus={errors.nom ? 'error' : ''} help={errors.nom?.message}>
            <Controller name="nom" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item label="Email" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
            <Controller name="email" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          <Form.Item
            label="Téléphone"
            validateStatus={errors.telephone ? 'error' : ''}
            help={errors.telephone?.message}
          >
            <Controller name="telephone" control={control} render={({ field }) => <Input {...field} />} />
          </Form.Item>

          {!isEditMode && (
            <Form.Item
              label="Mot de passe"
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => <Input.Password {...field} />}
              />
            </Form.Item>
          )}

          <Form.Item label="Statut actif">
            <Controller
              name="actif"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>
        </Form>
      </FormDrawer>
    </div>
  )
}

export default Administrateurs
