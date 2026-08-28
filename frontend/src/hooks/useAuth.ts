import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS, ROUTES } from '@/constants'
import { extractErrorMessage } from '@/lib/httpClient'
import type { ChangePasswordRequest, LoginRequest, RegisterRequest } from '@/types'

/**
 * Hook لتسجيل الدخول (POST /auth/login ثم GET /auth/me للتحقق من الدور).
 * عند النجاح: يحفظ المستخدم في authStore وينتقل لمساحته المناسبة حسب الدور
 * (ADMIN → لوحة التحكم، UTILISATEUR → مساحة المستخدم العادي).
 */
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)
  const navigate = useNavigate()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: ({ user }) => {
      setSession(user)
      message.success(`Bienvenue, ${user.fullName} !`)
      navigate(user.role === 'ADMIN' ? ROUTES.DASHBOARD : ROUTES.HOME, { replace: true })
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Identifiant ou mot de passe incorrect.'))
    },
  })
}

/**
 * Hook لإنشاء حساب UTILISATEUR جديد (POST /auth/register). عند النجاح: يدخل
 * المستخدم تلقائيًا (الـ Backend يُرجع توكن صالحًا فورًا) وينتقل مباشرة لمساحة
 * المستخدم العادي - الدور يكون UTILISATEUR دائمًا هنا (يفرضه الـ Backend).
 */
export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession)
  const navigate = useNavigate()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: ({ user }) => {
      setSession(user)
      message.success(`Bienvenue, ${user.fullName} ! Votre compte a été créé avec succès.`)
      navigate(user.role === 'ADMIN' ? ROUTES.DASHBOARD : ROUTES.HOME, { replace: true })
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de créer le compte.'))
    },
  })
}

/**
 * Hook لاستعادة الجلسة عند تحميل التطبيق (GET /auth/me) إن وُجد توكن مخزَّن مسبقًا.
 * enabled يُضبط من المكوّن المستدعي حسب وجود توكن في localStorage.
 */
export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTH_PROFILE],
    queryFn: () => authService.getCurrentUser(),
    enabled,
    retry: false,
  })
}

/** Hook لتغيير كلمة المرور من داخل صفحة Profil (PUT /auth/change-password) */
export function useChangePassword() {
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => authService.changePassword(payload),
    onSuccess: (successMessage) => {
      message.success(successMessage || 'Mot de passe modifié avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de modifier le mot de passe.'))
    },
  })
}

/** Hook لتسجيل الخروج - يفرّغ الجلسة محليًا (لا يوجد Endpoint خاص بالـ logout في الـ Backend) */
export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return () => {
    clearSession()
    queryClient.clear()
    navigate(ROUTES.LOGIN, { replace: true })
  }
}
