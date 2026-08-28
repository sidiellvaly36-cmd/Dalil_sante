import { utilisateurRepository } from '@/repositories/utilisateurRepository'
import type {
  BackendRole,
  CreateUtilisateurPayload,
  UpdateUtilisateurPayload,
  Utilisateur,
  UtilisateurFormValues,
} from '@/types'

/**
 * طبقة الـ Service الخاصة بكيان Utilisateur. تحوّل قيم النموذج (Form) إلى
 * جسم الطلب الحرفي الذي يتوقعه الـ Backend، وتفرض الدور (role) بحسب الصفحة
 * المستدعية (Utilisateurs → UTILISATEUR / Administrateurs → ADMIN) بدلًا من
 * تركه قابلاً للتعديل من طرف المستخدم في النموذج.
 */
export const utilisateurService = {
  async getAll(): Promise<Utilisateur[]> {
    return utilisateurRepository.getAll()
  },

  async create(values: UtilisateurFormValues, role: BackendRole): Promise<Utilisateur> {
    const payload: CreateUtilisateurPayload = {
      nom: values.nom,
      prenom: values.prenom,
      email: values.email,
      telephone: values.telephone,
      actif: values.actif,
      password: values.password ?? '',
      role,
    }
    return utilisateurRepository.create(payload)
  },

  async update(id: number, values: UtilisateurFormValues): Promise<Utilisateur> {
    const payload: UpdateUtilisateurPayload = {
      nom: values.nom,
      prenom: values.prenom,
      email: values.email,
      telephone: values.telephone,
      actif: values.actif,
    }
    return utilisateurRepository.update(id, payload)
  },

  async remove(id: number): Promise<void> {
    return utilisateurRepository.remove(id)
  },
}
