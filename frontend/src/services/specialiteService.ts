import { specialiteRepository } from '@/repositories/specialiteRepository'
import type { SpecialiteMedicale, SpecialiteMedicalePayload } from '@/types'

export const specialiteService = {
  async getAll(): Promise<SpecialiteMedicale[]> {
    return specialiteRepository.getAll()
  },

  async create(payload: SpecialiteMedicalePayload): Promise<SpecialiteMedicale> {
    return specialiteRepository.create(payload)
  },

  async update(id: number, payload: SpecialiteMedicalePayload): Promise<SpecialiteMedicale> {
    return specialiteRepository.update(id, payload)
  },

  async remove(id: number): Promise<void> {
    return specialiteRepository.remove(id)
  },
}
