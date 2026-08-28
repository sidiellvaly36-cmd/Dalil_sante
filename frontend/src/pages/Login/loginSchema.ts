import { z } from 'zod'

/**
 * مخطط التحقق (Validation) الخاص بنموذج تسجيل الدخول باستخدام Zod.
 * identifiant يقبل بريدًا إلكترونيًا أو رقم هاتف (مطابقًا لسلوك الـ Backend الفعلي
 * الذي يبحث بـ findByEmailOrTelephone) - لذلك لا نفرض صيغة بريد إلكتروني صارمة هنا.
 */
export const loginSchema = z.object({
  identifiant: z
    .string()
    .min(1, "L'identifiant est requis.")
    .min(3, "L'identifiant doit contenir au moins 3 caractères."),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis.')
    .min(4, 'Le mot de passe doit contenir au moins 4 caractères.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
