import { httpClient } from '@/lib/httpClient'
import type { SpecialiteMedicale, SpecialiteMedicalePayload } from '@/types'

/** طبقة الوصول للبيانات - تطابق حرفيًا SpecialiteMedicaleController.java */
export const specialiteRepository = {
  /** GET /api/specialites-medicales */
  async getAll(): Promise<SpecialiteMedicale[]> {
    const { data } = await httpClient.get<SpecialiteMedicale[]>('/api/specialites-medicales')
    return data
  },

  /** POST /api/specialites-medicales */
  async create(payload: SpecialiteMedicalePayload): Promise<SpecialiteMedicale> {
    const { data } = await httpClient.post<SpecialiteMedicale>('/api/specialites-medicales', payload)
    return data
  },

  /** PUT /api/specialites-medicales/{id} */
  async update(id: number, payload: SpecialiteMedicalePayload): Promise<SpecialiteMedicale> {
    const { data } = await httpClient.put<SpecialiteMedicale>(`/api/specialites-medicales/${id}`, payload)
    return data
  },

  /** DELETE /api/specialites-medicales/{id} */
  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/specialites-medicales/${id}`)
  },
}
