import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'

import { QUERY_KEYS } from '@/constants'
import { extractErrorMessage } from '@/lib/httpClient'
import { orientationQuestionService } from '@/services/orientationQuestionService'
import type { OrientationQuestionPayload } from '@/types'

export function useOrientationQuestionsQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.ORIENTATION_QUESTIONS],
    queryFn: () => orientationQuestionService.getAll(),
  })
}

export function useCreateOrientationQuestion() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (payload: OrientationQuestionPayload) =>
      orientationQuestionService.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORIENTATION_QUESTIONS],
      })

      message.success('Question créée avec succès.')
    },

    onError: (error) => {
      message.error(
        extractErrorMessage(
          error,
          'Impossible de créer la question.',
        ),
      )
    },
  })
}

export function useUpdateOrientationQuestion() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: OrientationQuestionPayload
    }) =>
      orientationQuestionService.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORIENTATION_QUESTIONS],
      })

      message.success('Question modifiée avec succès.')
    },

    onError: (error) => {
      message.error(
        extractErrorMessage(
          error,
          'Impossible de modifier la question.',
        ),
      )
    },
  })
}

export function useDeleteOrientationQuestion() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) =>
      orientationQuestionService.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORIENTATION_QUESTIONS],
      })

      message.success('Question supprimée avec succès.')
    },

    onError: (error) => {
      message.error(
        extractErrorMessage(
          error,
          'Impossible de supprimer la question.',
        ),
      )
    },
  })
}