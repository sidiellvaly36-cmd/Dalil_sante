import { z } from 'zod'

/** مخطط التحقق (Zod) لنموذج NumeroUrgence - etablissementId اختياري (nullable) */
export const numeroUrgenceFormSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis.'),
  numero: z.string().min(1, 'Le numéro est requis.'),
  description: z.string().min(1, 'La description est requise.'),
  etablissementId: z.number().nullable(),
})

export type NumeroUrgenceFormValues = z.infer<typeof numeroUrgenceFormSchema>