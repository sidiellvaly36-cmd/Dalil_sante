import { statistiqueRechercheRepository } from '@/repositories/statistiqueRechercheRepository'
import type { RechercheLogRequest, StatistiqueRechercheResponse } from '@/types'

export const statistiqueRechercheService = {
  async enregistrer(payload: RechercheLogRequest): Promise<void> {
    return statistiqueRechercheRepository.enregistrer(payload)
  },

  async getStatistiques(): Promise<StatistiqueRechercheResponse> {
    return statistiqueRechercheRepository.getStatistiques()
  },
}