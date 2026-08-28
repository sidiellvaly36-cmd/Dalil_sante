import { orientationOptionRepository } from '@/repositories/orientationOptionRepository'
import type { OrientationOption } from '@/types'

export const orientationOptionService = {
  async getActiveByQuestionId(questionId: number): Promise<OrientationOption[]> {
    return orientationOptionRepository.getActiveByQuestionId(questionId)
  },
}