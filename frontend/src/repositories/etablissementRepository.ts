import { httpClient } from '@/lib/httpClient'
import type {
  CreateEtablissementPayload,
  EtablissementSante,
  TypeEtablissement,
  UpdateEtablissementPayload,
} from '@/types'

export const etablissementRepository = {
  async getAll(): Promise<EtablissementSante[]> {
    const { data } = await httpClient.get<EtablissementSante[]>(
      '/api/etablissements',
    )

    return data
  },

  async getAllTypes(): Promise<TypeEtablissement[]> {
    const { data } = await httpClient.get<TypeEtablissement[]>(
      '/api/types-etablissement',
    )

    return data
  },

  async getByType(typeId: number): Promise<EtablissementSante[]> {
    const { data } = await httpClient.get<EtablissementSante[]>(
      `/api/etablissements/type/${typeId}`,
    )

    return data
  },

  async create(
    typeId: number,
    payload: CreateEtablissementPayload,
  ): Promise<EtablissementSante> {
    const { data } = await httpClient.post<EtablissementSante>(
      `/api/etablissements/type/${typeId}`,
      payload,
    )

    return data
  },

  async update(
    id: number,
    payload: UpdateEtablissementPayload,
  ): Promise<EtablissementSante> {
    const { data } = await httpClient.put<EtablissementSante>(
      `/api/etablissements/${id}`,
      payload,
    )

    return data
  },

  async addService(
    etablissementId: number,
    serviceId: number,
  ): Promise<EtablissementSante> {
    const { data } = await httpClient.post<EtablissementSante>(
      `/api/etablissements/${etablissementId}/services/${serviceId}`,
    )

    return data
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/etablissements/${id}`)
  },
}