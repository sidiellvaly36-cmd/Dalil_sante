/** يطابق حرفيًا enums/CategorieConseil.java */
export type CategorieConseil =
  | 'HYGIENE'
  | 'VACCINATION'
  | 'SANTE_MATERNELLE'
  | 'SANTE_INFANTILE'
  | 'DIABETE'
  | 'HYPERTENSION'
  | 'PREMIERS_GESTES_URGENCE'
  | 'CONSULTATION_RAPIDE'

/**
 * كيان "ConseilSante" كما يُرجعه الـ Backend فعليًا عبر dto/ConseilSanteResponse.java.
 * contenu أصبح اختياريًا (nullable): النصائح الجديدة تُبنى على ملف PDF مرفوع
 * حقيقيًا (pdfUrl/pdfFileName) بدل نص يُكتب يدويًا؛ النصائح القديمة (قبل هذه
 * الميزة) تحتفظ بـ contenu النصي دون PDF - كلا الشكلين مدعوم في نفس الحقل.
 * pdfUrl مسار API حقيقي (GET /api/conseils-sante/{id}/pdf) محميّ بـ JWT، وليس
 * رابطًا عامًا لملف ثابت.
 */
export interface ConseilSante {
  id: number
  titre: string
  contenu: string | null
  categorie: CategorieConseil | null
  publie: boolean
  dateCreation: string
  etablissementId: number | null
  etablissementNom: string | null
  pdfUrl: string | null
  pdfFileName: string | null
}

/**
 * جسم الطلب (الحقول الوصفية فقط - metadata) لإنشاء/تعديل نصيحة صحية.
 * يُرسَل كجزء JSON منفصل داخل multipart/form-data (POST/PUT /api/conseils-sante)،
 * بينما ملف الـ PDF يُرسَل كجزء File مستقل - راجع conseilSanteRepository.ts.
 */
export interface ConseilSantePayload {
  titre: string
  contenu: string | null
  categorie: CategorieConseil | null
  publie: boolean
  etablissementId: number | null
}