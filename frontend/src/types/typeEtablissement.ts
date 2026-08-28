/** كيان "TypeEtablissement" حرفيًا كما في entity/TypeEtablissement.java */
export interface TypeEtablissement {
  id: number
  nom: string
  description: string
  actif: boolean
}

/** جسم الطلب لإنشاء/تعديل نوع منشأة (POST/PUT /api/types-etablissement) */
export interface TypeEtablissementPayload {
  nom: string
  description: string
  actif: boolean
}
