import { z } from 'zod'

/**
 * Les champs adresse/ville/quartier/latitude/longitude ne correspondent à
 * aucun champ de EtablissementSante : ils sont extraits du formulaire dans
 * Etablissements.tsx pour être envoyés à part via les hooks
 * useCreateLocalisation/useUpdateLocalisation déjà existants (entité
 * Localisation réelle du Backend), jamais stockés sur l'établissement lui-même.
 */
export const etablissementFormSchema = z
  .object({
    nom: z.string().min(1, 'Le nom est requis.'),
    telephone: z.string().min(1, 'Le téléphone est requis.'),
    email: z.string().email('Adresse e-mail invalide.'),
    description: z.string().min(1, 'La description est requise.'),
    ouvert24h: z.boolean(),
    actif: z.boolean(),
    typeEtablissementId: z.number().int().positive("Sélectionnez un type d'établissement."),
    adresse: z.string().optional(),
    ville: z.string().optional(),
    quartier: z.string().optional(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  })
  .refine(
    (data) => {
      const hasPosition = data.latitude !== null && data.longitude !== null
      if (!hasPosition) return true
      return Boolean(data.adresse && data.adresse.trim().length > 0)
    },
    {
      message: "L'adresse est requise lorsqu'un emplacement est défini sur la carte.",
      path: ['adresse'],
    },
  )

export type EtablissementFormValues = z.infer<typeof etablissementFormSchema>