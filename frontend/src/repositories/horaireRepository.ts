import { httpClient } from '@/lib/httpClient'
import type { Horaire, HorairePayload } from '@/types'

export const horaireRepository = {
  async getAll(): Promise<Horaire[]> {
    const { data } = await httpClient.get<Horaire[]>('/api/horaires')
    return data
  },

  async create(etablissementId: number, payload: HorairePayload): Promise<Horaire> {
    const { data } = await httpClient.post<Horaire>(`/api/horaires/etablissement/${etablissementId}`, payload)
    return data
  },

  async update(id: number, payload: HorairePayload): Promise<Horaire> {
    const { data } = await httpClient.put<Horaire>(`/api/horaires/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/horaires/${id}`)
  },
}
