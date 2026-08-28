import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { numeroUrgenceService } from '@/services/numeroUrgenceService'
import { QUERY_KEYS } from '@/constants'
import { extractErrorMessage } from '@/lib/httpClient'
import type { NumeroUrgencePayload } from '@/types'

export function useNumerosUrgenceQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.NUMEROS_URGENCE],
    queryFn: () => numeroUrgenceService.getAll(),
  })
}

export function useCreateNumeroUrgence() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (payload: NumeroUrgencePayload) => numeroUrgenceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NUMEROS_URGENCE] })
      message.success("Numéro d'urgence créé avec succès.")
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, "Impossible de créer le numéro d'urgence."))
    },
  })
}

export function useUpdateNumeroUrgence() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: NumeroUrgencePayload }) =>
      numeroUrgenceService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NUMEROS_URGENCE] })
      message.success("Numéro d'urgence modifié avec succès.")
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, "Impossible de modifier le numéro d'urgence."))
    },
  })
}

export function useDeleteNumeroUrgence() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => numeroUrgenceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NUMEROS_URGENCE] })
      message.success("Numéro d'urgence supprimé avec succès.")
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, "Impossible de supprimer le numéro d'urgence."))
    },
  })
}