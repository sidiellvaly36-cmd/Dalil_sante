import { httpClient } from '@/lib/httpClient'
import type { CreateUtilisateurPayload, UpdateUtilisateurPayload, Utilisateur } from '@/types'

/**
 * طبقة الوصول للبيانات الخاصة بكيان Utilisateur - تطابق حرفيًا UtilisateurController.java.
 * مصدر بيانات وحيد يُستخدم من طرف صفحتَي Utilisateurs و Administrateurs معًا
 * (التمييز بينهما يتم في طبقة الـ Service عبر حقل role).
 */
export const utilisateurRepository = {
  /** GET /api/utilisateurs */
  async getAll(): Promise<Utilisateur[]> {
    const { data } = await httpClient.get<Utilisateur[]>('/api/utilisateurs')
    return data
  },

  /** GET /api/utilisateurs/{id} */
  async getById(id: number): Promise<Utilisateur> {
    const { data } = await httpClient.get<Utilisateur>(`/api/utilisateurs/${id}`)
    return data
  },

  /** POST /api/utilisateurs */
  async create(payload: CreateUtilisateurPayload): Promise<Utilisateur> {
    const { data } = await httpClient.post<Utilisateur>('/api/utilisateurs', payload)
    return data
  },

  /** PUT /api/utilisateurs/{id} */
  async update(id: number, payload: UpdateUtilisateurPayload): Promise<Utilisateur> {
    const { data } = await httpClient.put<Utilisateur>(`/api/utilisateurs/${id}`, payload)
    return data
  },

  /** DELETE /api/utilisateurs/{id} */
  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/utilisateurs/${id}`)
  },
}
