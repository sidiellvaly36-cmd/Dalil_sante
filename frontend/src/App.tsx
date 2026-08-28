import { useEffect } from 'react'
import { Spin } from 'antd'
import AppRouter from '@/routes/AppRouter'
import { setUnauthorizedHandler } from '@/lib/httpClient'
import { useAuthStore } from '@/store/authStore'
import { useCurrentUser } from '@/hooks/useAuth'
import { tokenStorage } from '@/utils'

/**
 * App (نقطة الدخول للواجهة)
 * --------------------------
 * 1. يربط معالج انتهاء الجلسة (401) بمخزن authStore.
 * 2. يحاول استعادة الجلسة تلقائيًا عبر GET /auth/me إن وُجد توكن محفوظ.
 * 3. يعرض <AppRouter /> بمجرد انتهاء التهيئة.
 */
function App() {
  const { isAuthenticated, isInitializing, setSession, clearSession, setInitializing } =
    useAuthStore()

  const hasStoredToken = Boolean(tokenStorage.getAccessToken())

  const { data: restoredUser, isFetched, isError } = useCurrentUser(hasStoredToken && !isAuthenticated)

  useEffect(() => {
    setUnauthorizedHandler(() => clearSession())
  }, [clearSession])

  useEffect(() => {
    if (!hasStoredToken) {
      setInitializing(false)
      return
    }

    if (isFetched) {
      if (restoredUser) {
        setSession(restoredUser)
      } else if (isError) {
        clearSession()
      }
    }
  }, [hasStoredToken, isFetched, isError, restoredUser, setSession, clearSession, setInitializing])

  if (isInitializing) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <Spin size="large" tip="Chargement de la session..." />
      </div>
    )
  }

  return (
    <>
     
      <AppRouter />
    </>
  )
}

export default App
