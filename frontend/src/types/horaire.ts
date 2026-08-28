/**
 * قيم java.time.DayOfWeek كما تُسلسَل حرفيًا (بالإنجليزية دائمًا، بغض النظر عن لغة الواجهة).
 */
export type JourSemaine =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

/**
 * كيان "Horaire" كما يُرجعه الـ Backend فعليًا عبر dto/HoraireResponse.java
 * (وليس entity/Horaire.java الخام) - etablissementId حقل مسطّح. heureOuverture/heureFermeture
 * بصيغة "HH:mm:ss".
 */
export interface Horaire {
  id: number
  jourSemaine: JourSemaine
  heureOuverture: string
  heureFermeture: string
  ferme: boolean
  etablissementId: number
}

/** جسم الطلب لإنشاء/تعديل جدول زمني - etablissementId يُمرَّر في الـ URL عند الإنشاء فقط */
export interface HorairePayload {
  jourSemaine: JourSemaine
  heureOuverture: string
  heureFermeture: string
  ferme: boolean
}
