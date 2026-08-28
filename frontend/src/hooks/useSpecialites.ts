import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { specialiteService } from '@/services/specialiteService'
import { QUERY_KEYS } from '@/constants'
import { extractErrorMessage } from '@/lib/httpClient'
import type { SpecialiteMedicalePayload } from '@/types'

export function useSpecialitesQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.SPECIALITES],
    queryFn: () => specialiteService.getAll(),
  })
}

export function useCreateSpecialite() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (payload: SpecialiteMedicalePayload) => specialiteService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SPECIALITES] })
      message.success('Spécialité créée avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de créer la spécialité.'))
    },
  })
}

export function useUpdateSpecialite() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SpecialiteMedicalePayload }) =>
      specialiteService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SPECIALITES] })
      message.success('Spécialité modifiée avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de modifier la spécialité.'))
    },
  })
}

export function useDeleteSpecialite() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => specialiteService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SPECIALITES] })
      message.success('Spécialité supprimée avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de supprimer la spécialité.'))
    },
  })
}
