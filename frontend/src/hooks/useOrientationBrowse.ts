import { useQueries, useQuery } from '@tanstack/react-query'
import { orientationQuestionService } from '@/services/orientationQuestionService'
import { orientationOptionService } from '@/services/orientationOptionService'
import { QUERY_KEYS } from '@/constants'
import type { OrientationOption, OrientationQuestion } from '@/types'

export interface OrientationQuestionWithOptions extends OrientationQuestion {
  options: OrientationOption[]
}

/**
 * يجلب الأسئلة النشطة وخياراتها النشطة معًا (قراءة فقط، بيانات حقيقية من الـ Backend).
 * لا يوجد Endpoint تقييم/إرسال إجابات في الـ Backend حاليًا، لذلك يُستخدم هذا الـ Hook
 * فقط لعرض الأسئلة والخيارات، وليس لحساب أو إرسال نتيجة توجيه.
 */
export function useOrientationBrowse() {
  const questionsQuery = useQuery({
    queryKey: [QUERY_KEYS.ORIENTATION_QUESTIONS],
    queryFn: () => orientationQuestionService.getActive(),
  })

  const questions = questionsQuery.data ?? []

  const optionsResults = useQueries({
    queries: questions.map((question) => ({
      queryKey: [QUERY_KEYS.ORIENTATION_OPTIONS, question.id],
      queryFn: () => orientationOptionService.getActiveByQuestionId(question.id),
      enabled: questionsQuery.isSuccess,
    })),
  })

  const isLoading =
    questionsQuery.isLoading || (questions.length > 0 && optionsResults.some((result) => result.isLoading))
  const isError = questionsQuery.isError || optionsResults.some((result) => result.isError)

  const questionsWithOptions: OrientationQuestionWithOptions[] = questions
    .map((question, index) => ({
      ...question,
      options: optionsResults[index]?.data ?? [],
    }))
    .sort((a, b) => a.questionOrder - b.questionOrder)

  function refetchAll() {
    questionsQuery.refetch()
    optionsResults.forEach((result) => result.refetch())
  }

  return { questionsWithOptions, isLoading, isError, refetchAll }
}