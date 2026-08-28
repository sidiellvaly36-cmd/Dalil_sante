/**
 * كيان "NumeroUrgence" كما يُرجعه الـ Backend فعليًا عبر dto/NumeroUrgenceResponse.java
 * (وليس entity/NumeroUrgence.java الخام) - etablissementId/etablissementNom حقلان
 * مسطّحان اختياريان (العلاقة NumeroUrgence → EtablissementSante اختيارية دائمًا:
 * رقم طوارئ قد يكون عامًا بلا مؤسسة، أو مرتبطًا بمؤسسة صحية محددة).
 */
export interface NumeroUrgence {
  id: number
  nom: string
  numero: string
  description: string
  etablissementId: number | null
  etablissementNom: string | null
}

/** جسم الطلب لإنشاء/تعديل رقم طوارئ (POST/PUT /api/numeros-urgence) */
export interface NumeroUrgencePayload {
  nom: string
  numero: string
  description: string
  etablissementId: number | null
}