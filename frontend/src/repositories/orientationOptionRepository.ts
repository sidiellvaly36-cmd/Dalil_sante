import { httpClient } from '@/lib/httpClient'
import type { OrientationOption } from '@/types'

/** طبقة الوصول للبيانات - تطابق حرفيًا OrientationOptionController.java (قراءة فقط، مطلوبة لمساحة UTILISATEUR) */
export const orientationOptionRepository = {
  /** GET /api/orientation/options/question/{questionId}/active */
  async getActiveByQuestionId(questionId: number): Promise<OrientationOption[]> {
    const { data } = await httpClient.get<OrientationOption[]>(
      `/api/orientation/options/question/${questionId}/active`,
    )
    return data
  },
}