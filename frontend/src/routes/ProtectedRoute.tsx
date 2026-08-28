import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * يحمي أي مسار يتطلب مصادقة. يعيد التوجيه لصفحة Login إن لم يكن هناك
 * مستخدم مصادَق عليه في authStore (isAuthenticated=false)، مع حفظ المسار
 * الأصلي في state ليعود إليه المستخدم بعد تسجيل الدخول.
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
