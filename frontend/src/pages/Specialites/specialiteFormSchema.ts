import { z } from 'zod'

export const specialiteFormSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis.'),
  description: z.string().min(1, 'La description est requise.'),
  actif: z.boolean(),
})

export type SpecialiteFormValues = z.infer<typeof specialiteFormSchema>
