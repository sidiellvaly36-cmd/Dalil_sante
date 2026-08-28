import { localisationRepository } from '@/repositories/localisationRepository'
import type { Localisation, LocalisationPayload } from '@/types'

export const localisationService = {
  async getAll(): Promise<Localisation[]> {
    return localisationRepository.getAll()
  },

  async create(etablissementId: number, payload: LocalisationPayload): Promise<Localisation> {
    return localisationRepository.create(etablissementId, payload)
  },

  async update(id: number, payload: LocalisationPayload): Promise<Localisation> {
    return localisationRepository.update(id, payload)
  },

  async remove(id: number): Promise<void> {
    return localisationRepository.remove(id)
  },
}
