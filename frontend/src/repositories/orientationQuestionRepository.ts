import { httpClient } from '@/lib/httpClient'
import type {
  OrientationQuestion,
  OrientationQuestionPayload,
} from '@/types'

export const orientationQuestionRepository = {
  async getAll(): Promise<OrientationQuestion[]> {
    const { data } = await httpClient.get<OrientationQuestion[]>(
      '/api/orientation/questions',
    )
    return data
  },

  async getActive(): Promise<OrientationQuestion[]> {
    const { data } = await httpClient.get<OrientationQuestion[]>(
      '/api/orientation/questions/active',
    )
    return data
  },

  async getById(id: number): Promise<OrientationQuestion> {
    const { data } = await httpClient.get<OrientationQuestion>(
      `/api/orientation/questions/${id}`,
    )
    return data
  },

  async create(
    payload: OrientationQuestionPayload,
  ): Promise<OrientationQuestion> {
    const { data } = await httpClient.post<OrientationQuestion>(
      '/api/orientation/questions',
      payload,
    )
    return data
  },

  async update(
    id: number,
    payload: OrientationQuestionPayload,
  ): Promise<OrientationQuestion> {
    const { data } = await httpClient.put<OrientationQuestion>(
      `/api/orientation/questions/${id}`,
      payload,
    )
    return data
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/orientation/questions/${id}`)
  },
}