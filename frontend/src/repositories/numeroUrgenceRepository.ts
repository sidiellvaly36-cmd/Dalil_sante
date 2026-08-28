import { httpClient } from '@/lib/httpClient'
import type { NumeroUrgence, NumeroUrgencePayload } from '@/types'

/** طبقة الوصول للبيانات - تطابق حرفيًا NumeroUrgenceController.java */
export const numeroUrgenceRepository = {
  /** GET /api/numeros-urgence */
  async getAll(): Promise<NumeroUrgence[]> {
    const { data } = await httpClient.get<NumeroUrgence[]>('/api/numeros-urgence')
    return data
  },

  /** POST /api/numeros-urgence */
  async create(payload: NumeroUrgencePayload): Promise<NumeroUrgence> {
    const { data } = await httpClient.post<NumeroUrgence>('/api/numeros-urgence', payload)
    return data
  },

  /** PUT /api/numeros-urgence/{id} */
  async update(id: number, payload: NumeroUrgencePayload): Promise<NumeroUrgence> {
    const { data } = await httpClient.put<NumeroUrgence>(`/api/numeros-urgence/${id}`, payload)
    return data
  },

  /** DELETE /api/numeros-urgence/{id} */
  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/numeros-urgence/${id}`)
  },
}