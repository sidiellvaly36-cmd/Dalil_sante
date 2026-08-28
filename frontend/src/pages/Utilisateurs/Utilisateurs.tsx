import { useState } from 'react'
import { Form, Input, Switch } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, FormDrawer, PageHeader } from '@/components'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsersQuery } from '@/hooks/useUsers'
import { z } from 'zod'
import { getUtilisateurFormSchema } from './utilisateurFormSchema'
import { getUsersColumns } from './columns'
import type { Utilisateur } from '@/types'

type UserFormFields = z.infer<ReturnType<typeof getUtilisateurFormSchema>>

const emptyValues: UserFormFields = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  actif: true,
  password: '',
}

function Utilisateurs() {
  const { data, isLoading } = useUsersQuery()
  const { mutate: createUser, isPending: isCreating } = useCreateUser()
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()
  const { mutate: deleteUser } = useDeleteUser()
  const confirmDelete = useConfirmDelete()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null)
  const isEditMode = editingUser !== null

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
    setEditingUser(null)
    reset(emptyValues)
    setDrawerOpen(true)
  }

  const openEditDrawer = (record: Utilisateur) => {
    setEditingUser(record)
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
    setEditingUser(null)
  }

  const onSubmit = (values: UserFormFields) => {
    if (isEditMode && editingUser) {
      updateUser(
        { id: editingUser.id, values },
        { onSuccess: closeDrawer },
      )
    } else {
      createUser(values, { onSuccess: closeDrawer })
    }
  }

  const handleDelete = (record: Utilisateur) => {
    confirmDelete({
      title: `Supprimer ${record.prenom} ${record.nom} ?`,
      content: 'Cette action est irréversible.',
      onConfirm: () => deleteUser(record.id),
    })
  }

  const columns = getUsersColumns({ onEdit: openEditDrawer, onDelete: handleDelete })

  return (
    <div>
      <PageHeader
        title="Utilisateurs"
        subtitle="Gérez les comptes des utilisateurs de la plateforme."
        actionLabel="Ajouter un utilisateur"
        onAction={openCreateDrawer}
      />

      <DataTable<Utilisateur>
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        rowKey="id"
        searchableFields={['nom', 'prenom', 'email', 'telephone']}
        searchPlaceholder="Rechercher un utilisateur..."
        emptyDescription="Aucun utilisateur trouvé"
      />

      <FormDrawer
        title={isEditMode ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}
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

export default Utilisateurs
