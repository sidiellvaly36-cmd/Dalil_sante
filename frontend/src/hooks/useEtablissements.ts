import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { App } from 'antd'

import { QUERY_KEYS } from '@/constants'

import { extractErrorMessage } from '@/lib/httpClient'

import { etablissementService } from '@/services/etablissementService'

import type {
  CreateEtablissementPayload,
  UpdateEtablissementPayload,
} from '@/types'

export function useEtablissementsQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.ETABLISSEMENTS],
    queryFn: () => etablissementService.getAll(),
  })
}

export function useTypesEtablissementQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.TYPES_ETABLISSEMENT],
    queryFn: () => etablissementService.getAllTypes(),
  })
}

export function useEtablissementsByTypeQuery(typeId: number | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.ETABLISSEMENTS, 'type', typeId],
    queryFn: () => etablissementService.getByType(typeId as number),
    enabled: typeId !== null,
  })
}

export function useCreateEtablissement() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({
      typeId,
      payload,
    }: {
      typeId: number
      payload: CreateEtablissementPayload
    }) => etablissementService.create(typeId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ETABLISSEMENTS],
      })

      message.success('Établissement créé avec succès.')
    },

    onError: (error) =>
      message.error(
        extractErrorMessage(
          error,
          "Impossible de créer l'établissement.",
        ),
      ),
  })
}

export function useUpdateEtablissement() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateEtablissementPayload
    }) => etablissementService.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ETABLISSEMENTS],
      })

      message.success('Établissement modifié avec succès.')
    },

    onError: (error) =>
      message.error(
        extractErrorMessage(
          error,
          "Impossible de modifier l'établissement.",
        ),
      ),
  })
}

export function useAddServiceToEtablissements() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: async ({
      serviceId,
      etablissementIds,
    }: {
      serviceId: number
      etablissementIds: number[]
    }) =>
      Promise.all(
        etablissementIds.map((etablissementId) =>
          etablissementService.addService(
            etablissementId,
            serviceId,
          ),
        ),
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ETABLISSEMENTS],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICES_MEDICAUX],
      })

      message.success(
        'Service medical associe aux etablissements avec succes.',
      )
    },

    onError: (error) => {
      message.error(
        extractErrorMessage(
          error,
          "Impossible d'associer le service medical aux etablissements.",
        ),
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ETABLISSEMENTS],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICES_MEDICAUX],
      })
    },
  })
}

export function useDeleteEtablissement() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => etablissementService.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ETABLISSEMENTS],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOCALISATIONS],
      })

      message.success('Établissement supprimé avec succès.')
    },

    onError: (error) =>
      message.error(
        extractErrorMessage(
          error,
          "Impossible de supprimer l'établissement.",
        ),
      ),
  })
}