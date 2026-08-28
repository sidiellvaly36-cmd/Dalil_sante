import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { utilisateurService } from '@/services/utilisateurService'
import { QUERY_KEYS } from '@/constants'
import { extractErrorMessage } from '@/lib/httpClient'
import type { UtilisateurFormValues } from '@/types'

/**
 * Hooks خاصة بصفحة "Administrateurs" - تستهلك نفس المورد /api/utilisateurs
 * مثل صفحة "Utilisateurs"، لكن تُصفّي دائمًا على role === 'ADMIN'.
 */
export function useAdminsQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.UTILISATEURS],
    queryFn: () => utilisateurService.getAll(),
    select: (data) => data.filter((u) => u.role === 'ADMIN'),
  })
}

export function useCreateAdmin() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (values: UtilisateurFormValues) => utilisateurService.create(values, 'ADMIN'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UTILISATEURS] })
      message.success('Administrateur créé avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, "Impossible de créer l'administrateur."))
    },
  })
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: UtilisateurFormValues }) =>
      utilisateurService.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UTILISATEURS] })
      message.success('Administrateur modifié avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, "Impossible de modifier l'administrateur."))
    },
  })
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => utilisateurService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UTILISATEURS] })
      message.success('Administrateur supprimé avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, "Impossible de supprimer l'administrateur."))
    },
  })
}
