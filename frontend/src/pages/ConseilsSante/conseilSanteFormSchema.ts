import { z } from 'zod'

/** يطابق حرفيًا قيم enums/CategorieConseil.java */
const CATEGORIE_VALUES = [
  'HYGIENE',
  'VACCINATION',
  'SANTE_MATERNELLE',
  'SANTE_INFANTILE',
  'DIABETE',
  'HYPERTENSION',
  'PREMIERS_GESTES_URGENCE',
  'CONSULTATION_RAPIDE',
] as const

/**
 * مخطط التحقق (Zod) لنموذج ConseilSante - لم يعد يحتوي على "contenu" (النصائح
 * الجديدة تُبنى على ملف PDF حقيقي، وليس نصًا يُكتب يدويًا). التحقق من وجود
 * ملف PDF عند الإنشاء يتم بشكل منفصل في ConseilsSante.tsx (حالة محلية للملف
 * وليست جزءًا من قيم react-hook-form).
 */
export const conseilSanteFormSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis.'),
  categorie: z.enum(CATEGORIE_VALUES).nullable(),
  publie: z.boolean(),
  etablissementId: z.number().nullable(),
})

export type ConseilSanteFormValues = z.infer<typeof conseilSanteFormSchema>