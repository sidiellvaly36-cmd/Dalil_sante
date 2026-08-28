import { serviceMedicalRepository } from '@/repositories/serviceMedicalRepository'
import type { ServiceMedical, ServiceMedicalPayload } from '@/types'

export const serviceMedicalService = {
  async getAll(): Promise<ServiceMedical[]> {
    return serviceMedicalRepository.getAll()
  },

  async create(payload: ServiceMedicalPayload): Promise<ServiceMedical> {
    return serviceMedicalRepository.create(payload)
  },

  async update(id: number, payload: ServiceMedicalPayload): Promise<ServiceMedical> {
    return serviceMedicalRepository.update(id, payload)
  },

  async remove(id: number): Promise<void> {
    return serviceMedicalRepository.remove(id)
  },
}
