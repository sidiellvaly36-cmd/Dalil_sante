import { httpClient } from '@/lib/httpClient'
import type { ServiceMedical, ServiceMedicalPayload } from '@/types'

/** طبقة الوصول للبيانات - تطابق حرفيًا ServiceMedicalController.java */
export const serviceMedicalRepository = {
  /** GET /api/services-medicaux */
  async getAll(): Promise<ServiceMedical[]> {
    const { data } = await httpClient.get<ServiceMedical[]>('/api/services-medicaux')
    return data
  },

  /** POST /api/services-medicaux */
  async create(payload: ServiceMedicalPayload): Promise<ServiceMedical> {
    const { data } = await httpClient.post<ServiceMedical>('/api/services-medicaux', payload)
    return data
  },

  /** PUT /api/services-medicaux/{id} */
  async update(id: number, payload: ServiceMedicalPayload): Promise<ServiceMedical> {
    const { data } = await httpClient.put<ServiceMedical>(`/api/services-medicaux/${id}`, payload)
    return data
  },

  /** DELETE /api/services-medicaux/{id} */
  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/services-medicaux/${id}`)
  },
}
