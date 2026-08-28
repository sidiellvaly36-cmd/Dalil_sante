import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { utilisateurService } from '@/services/utilisateurService'
import { QUERY_KEYS } from '@/constants'
import { extractErrorMessage } from '@/lib/httpClient'
import type { UtilisateurFormValues } from '@/types'

/**
 * Hooks خاصة بصفحة "Utilisateurs" - تستهلك نفس المورد /api/utilisateurs
 * مثل صفحة "Administrateurs"، لكن تُصفّي دائمًا على role === 'UTILISATEUR'.
 */
export function useUsersQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.UTILISATEURS],
    queryFn: () => utilisateurService.getAll(),
    select: (data) => data.filter((u) => u.role === 'UTILISATEUR'),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (values: UtilisateurFormValues) => utilisateurService.create(values, 'UTILISATEUR'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UTILISATEURS] })
      message.success('Utilisateur créé avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, "Impossible de créer l'utilisateur."))
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: UtilisateurFormValues }) =>
      utilisateurService.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UTILISATEURS] })
      message.success('Utilisateur modifié avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, "Impossible de modifier l'utilisateur."))
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => utilisateurService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UTILISATEURS] })
      message.success('Utilisateur supprimé avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, "Impossible de supprimer l'utilisateur."))
    },
  })
}
