import { z } from 'zod'

/**
 * مخطط التحقق (Zod) لنموذج Utilisateur. كلمة المرور إلزامية فقط عند الإنشاء
 * (isEditMode=false) لأن الـ Backend يتجاهلها كليًا عند التعديل (PUT).
 */
export function getUtilisateurFormSchema(isEditMode: boolean) {
  return z.object({
    nom: z.string().min(1, 'Le nom est requis.'),
    prenom: z.string().min(1, 'Le prénom est requis.'),
    email: z.string().min(1, "L'email est requis.").email('Email invalide.'),
    telephone: z.string().min(8, 'Numéro de téléphone invalide.'),
    actif: z.boolean(),
    password: isEditMode
      ? z.string().optional()
      : z.string().min(4, 'Le mot de passe doit contenir au moins 4 caractères.'),
  })
}

export type UtilisateurFormSchema = ReturnType<typeof getUtilisateurFormSchema>
