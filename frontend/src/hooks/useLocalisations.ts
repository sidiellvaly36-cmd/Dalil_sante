import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { etablissementService } from '@/services/etablissementService'
import { localisationService } from '@/services/localisationService'
import { QUERY_KEYS } from '@/constants'
import { extractErrorMessage } from '@/lib/httpClient'
import type { LocalisationPayload } from '@/types'

export function useLocalisationsQuery() {
  return useQuery({ queryKey: [QUERY_KEYS.LOCALISATIONS], queryFn: () => localisationService.getAll() })
}

export function useEtablissementsQuery() {
  return useQuery({ queryKey: [QUERY_KEYS.ETABLISSEMENTS], queryFn: () => etablissementService.getAll() })
}

export function useCreateLocalisation() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  return useMutation({
    mutationFn: ({ etablissementId, payload }: { etablissementId: number; payload: LocalisationPayload }) => localisationService.create(etablissementId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOCALISATIONS] })
      message.success('Localisation creee avec succes.')
    },
    onError: (error) => message.error(extractErrorMessage(error, 'Impossible de creer la localisation.')),
  })
}

export function useUpdateLocalisation() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: LocalisationPayload }) => localisationService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOCALISATIONS] })
      message.success('Localisation modifiee avec succes.')
    },
    onError: (error) => message.error(extractErrorMessage(error, 'Impossible de modifier la localisation.')),
  })
}

export function useDeleteLocalisation() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  return useMutation({
    mutationFn: (id: number) => localisationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOCALISATIONS] })
      message.success('Localisation supprimee avec succes.')
    },
    onError: (error) => message.error(extractErrorMessage(error, 'Impossible de supprimer la localisation.')),
  })
}
