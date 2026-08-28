import { z } from 'zod'

export const localisationFormSchema = z.object({
  etablissementId: z.number().int().positive('Selectionnez un etablissement.'),
  adresse: z.string().min(1, "L'adresse est requise."),
  ville: z.string(),
  quartier: z.string(),
  latitude: z.number().min(-90, 'La latitude doit etre comprise entre -90 et 90.').max(90, 'La latitude doit etre comprise entre -90 et 90.'),
  longitude: z.number().min(-180, 'La longitude doit etre comprise entre -180 et 180.').max(180, 'La longitude doit etre comprise entre -180 et 180.'),
})

export type LocalisationFormValues = z.infer<typeof localisationFormSchema>
