/** كيان "SpecialiteMedicale" حرفيًا كما في entity/SpecialiteMedicale.java */
export interface SpecialiteMedicale {
  id: number
  nom: string
  description: string
  actif: boolean
}

/** جسم الطلب لإنشاء/تعديل اختصاص طبي (POST/PUT /api/specialites-medicales) */
export interface SpecialiteMedicalePayload {
  nom: string
  description: string
  actif: boolean
}
