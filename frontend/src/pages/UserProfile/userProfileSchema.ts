import { z } from 'zod'

/** مخطط التحقق (Zod) لنموذج تغيير كلمة المرور - يطابق ChangePasswordRequest.java */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis.'),
    newPassword: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères.'),
    confirmPassword: z.string().min(1, 'La confirmation est requise.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'La confirmation ne correspond pas au nouveau mot de passe.',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>