/**
 * أنواع المصادقة (Authentication)
 * ---------------------------------
 * مطابقة حرفيًا لعقد الـ Backend الحقيقي (AuthController + DTOs):
 * - LoginRequest    → dto/LoginRequest.java   (identifiant, password)
 * - LoginResponse   → dto/LoginResponse.java  (token, utilisateurId, nomComplet, email, telephone)
 * - UserProfileResponse → dto/UserProfileResponse.java (id, nom, prenom, email, telephone, role)
 * - ChangePasswordRequest → dto/ChangePasswordRequest.java
 * لا تُضف أي حقل غير موجود فعليًا في هذه الـ DTOs.
 */

/** قيم الدور كما تُرسَل حرفيًا من الـ Backend (enums/Role.java) */
export type BackendRole = 'ADMIN' | 'UTILISATEUR'

/** بيانات نموذج تسجيل الدخول - يقبل الـ Backend البريد الإلكتروني أو رقم الهاتف في نفس الحقل */
export interface LoginRequest {
  identifiant: string
  password: string
}

/**
 * بيانات نموذج إنشاء حساب - POST /auth/register - يطابق حرفيًا dto/RegisterRequest.java.
 * لا يوجد حقل role: الـ Backend يفرض Role.UTILISATEUR دائمًا على هذا المسار العام،
 * لا يمكن اختيار ADMIN من هنا مطلقًا.
 */
export interface RegisterRequest {
  nom: string
  prenom: string
  email: string
  password: string
  telephone: string
}

/** استجابة تسجيل الدخول الحرفية القادمة من POST /auth/login */
export interface LoginResponse {
  token: string
  utilisateurId: number
  nomComplet: string
  email: string
  telephone: string
}

/** استجابة GET /auth/me الحرفية */
export interface UserProfileResponse {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  role: BackendRole
}

/** بيانات نموذج تغيير كلمة المرور - PUT /auth/change-password */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * المستخدم المصادق عليه كما يُخزَّن ويُستخدم داخل الواجهة (شكل موحَّد مبني من
 * دمج LoginResponse + UserProfileResponse بعد تسجيل الدخول). هذا النوع من إنتاج
 * طبقة authService، وليس نسخة حرفية من أي DTO في الـ Backend.
 */
export interface AuthUser {
  id: number
  fullName: string
  email: string
  phone: string
  role: BackendRole
}
