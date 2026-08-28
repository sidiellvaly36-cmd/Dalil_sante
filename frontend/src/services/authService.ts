import { authRepository } from '@/repositories/authRepository'
import { tokenStorage } from '@/utils'
import type { AuthUser, ChangePasswordRequest, LoginRequest, RegisterRequest } from '@/types'

/** يخزّن التوكن ثم يجلب /auth/me لبناء AuthUser الموحَّد - مشترك بين login وregister لأن كليهما يُرجعان توكن صالحًا فورًا (LoginResponse) لكن بدون حقل role. */
async function buildSessionFromToken(token: string): Promise<{ token: string; user: AuthUser }> {
  tokenStorage.setAccessToken(token)

  const profile = await authRepository.getCurrentUser()

  return {
    token,
    user: {
      id: profile.id,
      fullName: `${profile.prenom} ${profile.nom}`.trim(),
      email: profile.email,
      phone: profile.telephone,
      role: profile.role,
    },
  }
}

/**
 * طبقة الـ Service الخاصة بالمصادقة - الوسيط الوحيد بين الـ Hooks وطبقة الـ Repositories.
 * تُحوّل استجابات الـ Backend الحرفية (DTOs) إلى شكل AuthUser الموحَّد المستخدم
 * داخل الواجهة. الدخول متاح لأي دور صادر عن الـ Backend (ADMIN أو UTILISATEUR)؛
 * التمييز بين مساحة لوحة التحكم (ADMIN) ومساحة المستخدم العادي (UTILISATEUR)
 * يتم بعد الدخول عبر التوجيه (routes/RequireRole)، وليس برفض الدخول هنا.
 */
export const authService = {
  /** يسجّل الدخول ثم يجلب الملف الشخصي عبر /auth/me (لأن /auth/login لا يُرجع الدور). */
  async login(credentials: LoginRequest): Promise<{ token: string; user: AuthUser }> {
    const loginResponse = await authRepository.login(credentials)
    return buildSessionFromToken(loginResponse.token)
  },

  /**
   * ينشئ حساب UTILISATEUR جديد (POST /auth/register يفرض هذا الدور دائمًا من
   * جهة الـ Backend، لا حقل role في الطلب) ثم يبني الجلسة مباشرة من التوكن
   * المُرجَع - يدخل المستخدم تلقائيًا بعد التسجيل بدلًا من إعادته لصفحة Login.
   */
  async register(payload: RegisterRequest): Promise<{ token: string; user: AuthUser }> {
    const registerResponse = await authRepository.register(payload)
    return buildSessionFromToken(registerResponse.token)
  },

  /** يجلب الملف الشخصي الحالي ويحوّله لشكل AuthUser الموحَّد */
  async getCurrentUser(): Promise<AuthUser> {
    const profile = await authRepository.getCurrentUser()

    return {
      id: profile.id,
      fullName: `${profile.prenom} ${profile.nom}`.trim(),
      email: profile.email,
      phone: profile.telephone,
      role: profile.role,
    }
  },

  async changePassword(payload: ChangePasswordRequest): Promise<string> {
    return authRepository.changePassword(payload)
  },
}