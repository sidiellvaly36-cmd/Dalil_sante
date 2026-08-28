import { z } from 'zod'
import type { JourSemaine } from '@/types'

const joursSemaine = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const

export const horaireFormSchema = z.object({
  etablissementId: z.number().int().positive('Selectionnez un etablissement.'),
  jourSemaine: z.enum(joursSemaine),
  heureOuverture: z.string(),
  heureFermeture: z.string(),
  ferme: z.boolean(),
}).refine(
  (values) => values.ferme || (Boolean(values.heureOuverture) && Boolean(values.heureFermeture)),
  { message: "Les heures d'ouverture et de fermeture sont requises.", path: ['heureOuverture'] },
)

export interface HoraireFormValues {
  etablissementId: number
  jourSemaine: JourSemaine
  heureOuverture: string
  heureFermeture: string
  ferme: boolean
}
