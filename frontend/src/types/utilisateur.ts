import type { BackendRole } from './auth'

/**
 * كيان "Utilisateur" كما يُرجعه الـ Backend حرفيًا (entity/Utilisateur.java).
 * كيان واحد يُستخدم لكل من صفحتَي "Utilisateurs" و"Administrateurs" في الواجهة،
 * والتمييز بينهما يتم فقط عبر حقل role (ADMIN / UTILISATEUR) من طرف الـ Frontend.
 *
 * ملاحظة: لا يوجد حقل updatedAt في الـ Backend، فقط dateCreation.
 * ملاحظة: id رقمي (Long في Java) وليس نصيًا.
 */
export interface Utilisateur {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  actif: boolean
  role: BackendRole
  dateCreation: string
}

/**
 * جسم الطلب عند إنشاء مستخدم جديد (POST /api/utilisateurs).
 * الـ Backend يقبل الكيان الكامل بما فيه password (بدون تشفير من جهة الـ Backend
 * عند الإنشاء عبر هذا المسار - هذا سلوك الـ Backend الفعلي، لسنا مسؤولين عن تعديله).
 */
export interface CreateUtilisateurPayload {
  nom: string
  prenom: string
  email: string
  password: string
  telephone: string
  actif: boolean
  role: BackendRole
}

/**
 * جسم الطلب عند تعديل مستخدم (PUT /api/utilisateurs/{id}).
 * الـ Backend فعليًا يُحدّث فقط: nom, prenom, email, telephone, actif
 * (role و password لا يُعدَّلان أبدًا عبر هذا المسار حتى لو أُرسلا).
 */
export interface UpdateUtilisateurPayload {
  nom: string
  prenom: string
  email: string
  telephone: string
  actif: boolean
}

/** بيانات نموذج Ant Design لصفحتَي Utilisateurs/Administrateurs (إنشاء أو تعديل) */
export interface UtilisateurFormValues {
  nom: string
  prenom: string
  email: string
  telephone: string
  actif: boolean
  password?: string
}
