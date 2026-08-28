/** كيان "ServiceMedical" حرفيًا كما في entity/ServiceMedical.java */
export interface ServiceMedical {
  id: number
  nom: string
  description: string
  actif: boolean
}

/** جسم الطلب لإنشاء/تعديل خدمة طبية (POST/PUT /api/services-medicaux) */
export interface ServiceMedicalPayload {
  nom: string
  description: string
  actif: boolean
}
