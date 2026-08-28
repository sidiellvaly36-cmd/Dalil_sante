import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants'

interface PublicRouteProps {
  children: ReactNode
}

/**
 * يحمي المسارات العامة (مثل Login) من الوصول إليها من طرف مستخدم مصادَق
 * عليه بالفعل - يعيد توجيهه مباشرة لمساحته المناسبة حسب الدور بدلًا من عرض
 * نموذج الدخول من جديد (ADMIN → لوحة التحكم، UTILISATEUR → مساحة المستخدم العادي).
 */
function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const role = useAuthStore((state) => state.user?.role)

  if (isAuthenticated) {
    return <Navigate to={role === 'ADMIN' ? ROUTES.DASHBOARD : ROUTES.HOME} replace />
  }

  return children
}

export default PublicRoute
