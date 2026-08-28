import type { IdNomResponse } from './common'

/**
 * كيان "EtablissementSante" كما يُرجعه الـ Backend فعليًا عبر dto/EtablissementResponse.java
 * (وليس entity/EtablissementSante.java الخام). الـ Controller يُرجع typeEtablissementId/Nom
 * كحقلين مسطّحين بدل كائن TypeEtablissement متداخل، وspecialites/services كمصفوفة
 * IdNomResponse (id+nom فقط) بدل الكائنات الكاملة - لتفادي أي علاقة متداخلة/دائرية،
 * تمامًا كما صُمِّم DTO الـ Backend.
 */
export interface EtablissementSante {
  id: number
  nom: string
  telephone: string
  email: string
  description: string
  ouvert24h: boolean
  actif: boolean
  typeEtablissementId: number
  typeEtablissementNom: string
  specialites: IdNomResponse[]
  services: IdNomResponse[]
}

/**
 * جسم الطلب لإنشاء منشأة - POST /api/etablissements/type/{typeId}
 * (typeId يُمرَّر في الـ URL وليس في جسم الطلب، لذلك لا نكرره هنا).
 */
export interface CreateEtablissementPayload {
  nom: string
  telephone: string
  email: string
  description: string
  ouvert24h: boolean
  actif: boolean
}

/** جسم الطلب لتعديل منشأة - PUT /api/etablissements/{id} */
export type UpdateEtablissementPayload = CreateEtablissementPayload

/** بيانات نموذج Ant Design لصفحة Établissements de santé */
export interface EtablissementFormValues {
  nom: string
  telephone: string
  email: string
  description: string
  ouvert24h: boolean
  actif: boolean
  typeEtablissementId: number
}
