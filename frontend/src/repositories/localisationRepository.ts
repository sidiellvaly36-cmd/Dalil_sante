import { httpClient } from '@/lib/httpClient'
import type { Localisation, LocalisationPayload } from '@/types'

export const localisationRepository = {
  async getAll(): Promise<Localisation[]> {
    const { data } = await httpClient.get<Localisation[]>('/api/localisations')
    return data
  },

  async create(etablissementId: number, payload: LocalisationPayload): Promise<Localisation> {
    const { data } = await httpClient.post<Localisation>(`/api/localisations/etablissement/${etablissementId}`, payload)
    return data
  },

  async update(id: number, payload: LocalisationPayload): Promise<Localisation> {
    const { data } = await httpClient.put<Localisation>(`/api/localisations/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/localisations/${id}`)
  },
}
