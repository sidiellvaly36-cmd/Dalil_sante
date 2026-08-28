import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { serviceMedicalService } from '@/services/serviceMedicalService'
import { QUERY_KEYS } from '@/constants'
import { extractErrorMessage } from '@/lib/httpClient'
import type { ServiceMedicalPayload } from '@/types'

export function useServicesMedicauxQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICES_MEDICAUX],
    queryFn: () => serviceMedicalService.getAll(),
  })
}

export function useCreateServiceMedical() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (payload: ServiceMedicalPayload) => serviceMedicalService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICES_MEDICAUX] })
      message.success('Service médical créé avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de créer le service médical.'))
    },
  })
}

export function useUpdateServiceMedical() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ServiceMedicalPayload }) =>
      serviceMedicalService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICES_MEDICAUX] })
      message.success('Service médical modifié avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de modifier le service médical.'))
    },
  })
}

export function useDeleteServiceMedical() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => serviceMedicalService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICES_MEDICAUX] })
      message.success('Service médical supprimé avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de supprimer le service médical.'))
    },
  })
}
