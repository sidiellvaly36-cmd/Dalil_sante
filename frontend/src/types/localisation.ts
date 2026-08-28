/**
 * كيان "Localisation" كما يُرجعه الـ Backend فعليًا عبر dto/LocalisationResponse.java
 * (وليس entity/Localisation.java الخام) - etablissementId حقل مسطّح وليس كائن
 * EtablissementSante متداخل، لتفادي أي علاقة متداخلة/دائرية.
 */
export interface Localisation {
  id: number
  adresse: string
  ville: string
  quartier: string
  latitude: number
  longitude: number
  etablissementId: number
}

/** جسم الطلب لإنشاء/تعديل موقع - etablissementId يُمرَّر في الـ URL عند الإنشاء فقط */
export interface LocalisationPayload {
  adresse: string
  ville: string
  quartier: string
  latitude: number
  longitude: number
}
