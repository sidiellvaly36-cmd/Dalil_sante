/**
 * أنواع خاصة بإحصائيات البحث - مطابقة حرفيًا لـ:
 * enums/TypeRecherche.java, dto/RechercheLogRequest.java,
 * dto/StatistiqueRechercheResponse.java (+ RepartitionTypeItem,
 * RechercheFrequenteItem, EvolutionPointItem).
 * كل التجميع (aggregation) يتم في PostgreSQL عبر RechercheLogRepository -
 * الواجهة لا تجمّع شيئًا محليًا، فقط تعرض ما يعيده الـ Backend.
 */

/** يطابق enum TypeRecherche.java */
export type TypeRecherche = 'ETABLISSEMENT' | 'SPECIALITE' | 'SERVICE' | 'TYPE_ETABLISSEMENT'

export const TYPE_RECHERCHE_LABELS: Record<TypeRecherche, string> = {
  ETABLISSEMENT: 'Établissement',
  SPECIALITE: 'Spécialité',
  SERVICE: 'Service',
  TYPE_ETABLISSEMENT: "Type d'établissement",
}

/** يطابق RechercheLogRequest.java - جسم POST /api/statistiques/recherches */
export interface RechercheLogRequest {
  type: TypeRecherche
  query: string
}

/** يطابق RepartitionTypeItem.java */
export interface RepartitionTypeItem {
  type: TypeRecherche
  nombre: number
}

/** يطابق RechercheFrequenteItem.java */
export interface RechercheFrequenteItem {
  query: string
  type: TypeRecherche
  nombre: number
}

/** يطابق EvolutionPointItem.java */
export interface EvolutionPointItem {
  label: string
  nombre: number
}

/** يطابق StatistiqueRechercheResponse.java - جسم GET /api/statistiques/recherches */
export interface StatistiqueRechercheResponse {
  totalRecherches: number
  recherchesAujourdHui: number
  recherchesCeMois: number
  recherchesCetteAnnee: number
  repartitionParType: RepartitionTypeItem[]
  recherchesFrequentes: RechercheFrequenteItem[]
  evolutionParJour: EvolutionPointItem[]
  evolutionParMois: EvolutionPointItem[]
  evolutionParAnnee: EvolutionPointItem[]
}