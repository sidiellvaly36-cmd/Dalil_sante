import { etablissementRepository } from '@/repositories/etablissementRepository'

import type {
  CreateEtablissementPayload,
  EtablissementSante,
  TypeEtablissement,
  UpdateEtablissementPayload,
} from '@/types'

export const etablissementService = {
  async getAll(): Promise<EtablissementSante[]> {
    return etablissementRepository.getAll()
  },

  async getAllTypes(): Promise<TypeEtablissement[]> {
    return etablissementRepository.getAllTypes()
  },

  async getByType(typeId: number): Promise<EtablissementSante[]> {
    return etablissementRepository.getByType(typeId)
  },

  async create(
    typeId: number,
    payload: CreateEtablissementPayload,
  ): Promise<EtablissementSante> {
    return etablissementRepository.create(typeId, payload)
  },

  async update(
    id: number,
    payload: UpdateEtablissementPayload,
  ): Promise<EtablissementSante> {
    return etablissementRepository.update(id, payload)
  },

  async addService(
    etablissementId: number,
    serviceId: number,
  ): Promise<EtablissementSante> {
    return etablissementRepository.addService(etablissementId, serviceId)
  },

  async remove(id: number): Promise<void> {
    return etablissementRepository.remove(id)
  },
}