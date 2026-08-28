import { z } from 'zod'

/**
 * مخطط التحقق (Zod) لنموذج إنشاء الحساب - يطابق قواعد dto/RegisterRequest.java
 * (nom/prenom @NotBlank, email @Email @NotBlank, password @Size(min=6),
 * telephone @NotBlank)، مع إضافة confirmPassword كحقل تحقق محلي بحت في
 * الواجهة فقط (لا يُرسَل إلى الـ Backend - لا يوجد له حقل مقابل في RegisterRequest).
 */
export const registerSchema = z
  .object({
    nom: z.string().min(1, 'Le nom est requis.'),
    prenom: z.string().min(1, 'Le prénom est requis.'),
    telephone: z.string().min(1, 'Le numéro de téléphone est requis.'),
    email: z.string().min(1, "L'email est requis.").email('Email invalide.'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
    confirmPassword: z.string().min(1, 'La confirmation est requise.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'La confirmation ne correspond pas au mot de passe.',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>