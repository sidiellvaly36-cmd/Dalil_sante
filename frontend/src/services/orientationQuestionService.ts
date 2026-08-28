import { orientationQuestionRepository } from '@/repositories/orientationQuestionRepository'

import type {
  OrientationQuestion,
  OrientationQuestionPayload,
} from '@/types'

export const orientationQuestionService = {
  async getAll(): Promise<OrientationQuestion[]> {
    return orientationQuestionRepository.getAll()
  },

  async getActive(): Promise<OrientationQuestion[]> {
    return orientationQuestionRepository.getActive()
  },

  async getById(id: number): Promise<OrientationQuestion> {
    return orientationQuestionRepository.getById(id)
  },

  async create(
    payload: OrientationQuestionPayload,
  ): Promise<OrientationQuestion> {
    return orientationQuestionRepository.create(payload)
  },

  async update(
    id: number,
    payload: OrientationQuestionPayload,
  ): Promise<OrientationQuestion> {
    return orientationQuestionRepository.update(id, payload)
  },

  async remove(id: number): Promise<void> {
    return orientationQuestionRepository.remove(id)
  },
}