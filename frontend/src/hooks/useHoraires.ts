import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { horaireService } from '@/services/horaireService'
import { QUERY_KEYS } from '@/constants'
import { extractErrorMessage } from '@/lib/httpClient'
import type { HorairePayload } from '@/types'

export function useHorairesQuery() {
  return useQuery({ queryKey: [QUERY_KEYS.HORAIRES], queryFn: () => horaireService.getAll() })
}

export function useCreateHoraire() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  return useMutation({
    mutationFn: ({ etablissementId, payload }: { etablissementId: number; payload: HorairePayload }) => horaireService.create(etablissementId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HORAIRES] })
      message.success('Horaire cree avec succes.')
    },
    onError: (error) => message.error(extractErrorMessage(error, "Impossible de creer l'horaire.")),
  })
}

export function useUpdateHoraire() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: HorairePayload }) => horaireService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HORAIRES] })
      message.success('Horaire modifie avec succes.')
    },
    onError: (error) => message.error(extractErrorMessage(error, "Impossible de modifier l'horaire.")),
  })
}

export function useDeleteHoraire() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  return useMutation({
    mutationFn: (id: number) => horaireService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HORAIRES] })
      message.success('Horaire supprime avec succes.')
    },
    onError: (error) => message.error(extractErrorMessage(error, "Impossible de supprimer l'horaire.")),
  })
}
