import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants'
import type { BackendRole } from '@/types'

interface RequireRoleProps {
  role: BackendRole
  children: ReactNode
}

/**
 * يفصل مساحة لوحة التحكم (ADMIN) عن مساحة المستخدم العادي (UTILISATEUR):
 * إن كان دور المستخدم الحالي مختلفًا عن الدور المطلوب لهذا الفرع من المسارات،
 * يُعاد توجيهه لمساحته الخاصة بدلًا من عرض محتوى لا يخصّه.
 * يُستخدم داخل ProtectedRoute (الذي يضمن أصلًا وجود مستخدم مصادَق عليه).
 */
function RequireRole({ role, children }: RequireRoleProps) {
  const currentRole = useAuthStore((state) => state.user?.role)

  if (currentRole && currentRole !== role) {
    return <Navigate to={currentRole === 'ADMIN' ? ROUTES.DASHBOARD : ROUTES.HOME} replace />
  }

  return children
}

export default RequireRole