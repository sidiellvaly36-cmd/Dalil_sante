import { numeroUrgenceRepository } from '@/repositories/numeroUrgenceRepository'
import type { NumeroUrgence, NumeroUrgencePayload } from '@/types'

export const numeroUrgenceService = {
  async getAll(): Promise<NumeroUrgence[]> {
    return numeroUrgenceRepository.getAll()
  },

  async create(payload: NumeroUrgencePayload): Promise<NumeroUrgence> {
    return numeroUrgenceRepository.create(payload)
  },

  async update(id: number, payload: NumeroUrgencePayload): Promise<NumeroUrgence> {
    return numeroUrgenceRepository.update(id, payload)
  },

  async remove(id: number): Promise<void> {
    return numeroUrgenceRepository.remove(id)
  },
}