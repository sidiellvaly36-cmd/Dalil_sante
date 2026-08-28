import { horaireRepository } from '@/repositories/horaireRepository'
import type { Horaire, HorairePayload } from '@/types'

export const horaireService = {
  async getAll(): Promise<Horaire[]> {
    return horaireRepository.getAll()
  },

  async create(etablissementId: number, payload: HorairePayload): Promise<Horaire> {
    return horaireRepository.create(etablissementId, payload)
  },

  async update(id: number, payload: HorairePayload): Promise<Horaire> {
    return horaireRepository.update(id, payload)
  },

  async remove(id: number): Promise<void> {
    return horaireRepository.remove(id)
  },
}
