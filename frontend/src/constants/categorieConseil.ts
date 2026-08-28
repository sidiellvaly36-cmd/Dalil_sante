import type { CategorieConseil, SelectOption } from '@/types'

/** تسميات التصنيفات بالفرنسية للعرض - مطابقة لقيم enums/CategorieConseil.java */
export const CATEGORIE_CONSEIL_LABELS: Record<CategorieConseil, string> = {
  HYGIENE: 'Hygiène',
  VACCINATION: 'Vaccination',
  SANTE_MATERNELLE: 'Santé maternelle',
  SANTE_INFANTILE: 'Santé infantile',
  DIABETE: 'Diabète',
  HYPERTENSION: 'Hypertension',
  PREMIERS_GESTES_URGENCE: "Premiers gestes d'urgence",
  CONSULTATION_RAPIDE: 'Situations nécessitant une consultation rapide',
}

/** خيارات التصنيف المستخدمة في القوائم المنسدلة (Select) وفلاتر البحث */
export const CATEGORIE_CONSEIL_OPTIONS: SelectOption[] = (
  Object.keys(CATEGORIE_CONSEIL_LABELS) as CategorieConseil[]
).map((value) => ({ value, label: CATEGORIE_CONSEIL_LABELS[value] }))