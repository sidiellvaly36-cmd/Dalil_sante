import { STORAGE_KEYS } from '@/constants'

/**
 * غلاف (Wrapper) حول localStorage خاص بتخزين رمز المصادقة (JWT).
 * لا تستخدم localStorage مباشرة في أي مكان آخر من المشروع، مرّ دائمًا عبر هذه الدوال.
 */
export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },
  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  },
  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  },
}
