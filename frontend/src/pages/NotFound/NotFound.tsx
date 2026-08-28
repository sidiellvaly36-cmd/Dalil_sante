import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants'

/** صفحة 404 - تُعرض لأي مسار غير معرَّف في AppRouter */
function NotFound() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const role = useAuthStore((state) => state.user?.role)

  const handleReturn = () => {
    if (isAuthenticated) {
      navigate(role === 'ADMIN' ? ROUTES.DASHBOARD : ROUTES.HOME)
    } else {
      navigate(ROUTES.PUBLIC_HOME)
    }
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle="Désolé, la page que vous recherchez n'existe pas."
      extra={
        <Button type="primary" onClick={handleReturn}>
          {isAuthenticated && role === 'ADMIN'
            ? 'Retour au tableau de bord'
            : 'Retour à l’accueil'}
        </Button>
      }
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    />
  )
}

export default NotFound
