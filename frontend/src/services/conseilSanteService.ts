import { conseilSanteRepository } from '@/repositories/conseilSanteRepository'
import type { CategorieConseil, ConseilSante, ConseilSantePayload } from '@/types'

export const conseilSanteService = {
  async getAll(): Promise<ConseilSante[]> {
    return conseilSanteRepository.getAll()
  },

  async getPublished(): Promise<ConseilSante[]> {
    return conseilSanteRepository.getPublished()
  },

  async getPublishedByCategorie(categorie: CategorieConseil): Promise<ConseilSante[]> {
    return conseilSanteRepository.getPublishedByCategorie(categorie)
  },

  async getById(id: number): Promise<ConseilSante> {
    return conseilSanteRepository.getById(id)
  },

  async getPdfBlob(id: number): Promise<Blob> {
    return conseilSanteRepository.getPdfBlob(id)
  },

  async create(
    payload: ConseilSantePayload,
    pdf: File,
    onProgress?: (percent: number) => void,
  ): Promise<ConseilSante> {
    return conseilSanteRepository.create(payload, pdf, onProgress)
  },

  async update(
    id: number,
    payload: ConseilSantePayload,
    pdf?: File | null,
    onProgress?: (percent: number) => void,
  ): Promise<ConseilSante> {
    return conseilSanteRepository.update(id, payload, pdf, onProgress)
  },

  async remove(id: number): Promise<void> {
    return conseilSanteRepository.remove(id)
  },
}