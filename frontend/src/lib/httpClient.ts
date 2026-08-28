import axios, { AxiosError } from 'axios'
import { env } from '@/config/env'
import { tokenStorage } from '@/utils'

/**
 * عميل Axios الوحيد المستخدم في كامل المشروع للتواصل مع الـ Backend الحقيقي.
 * لا تُنشئ أي axios.create() آخر في أي مكان آخر - مرّ دائمًا عبر httpClient.
 *
 * ملاحظة مهمة: الـ Backend لا يستخدم بادئة /api موحّدة (AuthController على /auth
 * مباشرة بينما باقي الـ Controllers على /api/...)، لذلك baseURL هنا هو جذر
 * الخادم فقط، وكل Repository يكتب المسار الكامل بنفسه (مثال: '/auth/login'،
 * '/api/utilisateurs').
 */
export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// إرفاق رمز JWT تلقائيًا مع كل طلب إن وُجد
httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * دالة يتم استدعاؤها عند اكتشاف انتهاء صلاحية الجلسة (401) لتفريغ حالة
 * المصادقة في الـ Store وإعادة التوجيه لصفحة الدخول. تُضبط من main.tsx/App.tsx
 * لتفادي الاستيراد الدائري بين httpClient و authStore.
 */
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler
}

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStorage.clear()
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

/**
 * الـ Backend لا يحتوي على @ControllerAdvice، لذلك معظم الأخطاء تُرجع كـ HTTP 500
 * عام بدون حقل "message" واضح (server.error.include-message ليس مفعّلًا).
 * هذه الدالة تحاول استخراج أفضل رسالة خطأ ممكنة من الاستجابة، وإلا تُرجع
 * رسالة احتياطية عامة بالفرنسية.
 */
export function extractErrorMessage(error: unknown, fallback = 'Une erreur est survenue.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string; errors?: { defaultMessage?: string }[] }
      | undefined

    if (data?.message) return data.message
    if (data?.errors && data.errors.length > 0 && data.errors[0].defaultMessage) {
      return data.errors[0].defaultMessage
    }
    if (error.response?.status === 401) return 'Identifiant ou mot de passe incorrect.'
    if (error.response?.status === 403) return "Vous n'avez pas les droits nécessaires pour cette action."
    if (error.response?.status === 404) return 'Ressource introuvable.'
    if (data?.error) return data.error
    if (!error.response) return 'Impossible de contacter le serveur. Vérifiez votre connexion.'
  }

  return fallback
}
