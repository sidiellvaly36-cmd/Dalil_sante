import { create } from 'zustand'
import type { AuthUser } from '@/types'
import { tokenStorage } from '@/utils'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  /** true أثناء محاولة استعادة الجلسة عند تحميل التطبيق (GET /auth/me) */
  isInitializing: boolean
  setSession: (user: AuthUser) => void
  clearSession: () => void
  setInitializing: (value: boolean) => void
}

/**
 * مخزن حالة المصادقة العام (Zustand). يحتفظ فقط ببيانات المستخدم الحالي؛
 * التوكن نفسه يُخزَّن في localStorage عبر tokenStorage وليس هنا، تفاديًا لتكراره.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  setSession: (user) => set({ user, isAuthenticated: true, isInitializing: false }),

  clearSession: () => {
    tokenStorage.clear()
    set({ user: null, isAuthenticated: false, isInitializing: false })
  },

  setInitializing: (value) => set({ isInitializing: value }),
}))
