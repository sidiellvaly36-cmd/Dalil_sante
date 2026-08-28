import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { useAuthStore } from '@/store/authStore'

import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import RequireRole from './RequireRole'

import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import PublicLayout from '@/layouts/PublicLayout/PublicLayout'
import UserLayout from '@/layouts/UserLayout/UserLayout'

import Login from '@/pages/Login/Login'
import Register from '@/pages/Register/Register'
import PublicHome from '@/pages/PublicHome/PublicHome'

import Dashboard from '@/pages/Dashboard/Dashboard'
import Utilisateurs from '@/pages/Utilisateurs/Utilisateurs'
import Administrateurs from '@/pages/Administrateurs/Administrateurs'
import Specialites from '@/pages/Specialites/Specialites'
import ServicesMedicaux from '@/pages/ServicesMedicaux/ServicesMedicaux'
import Etablissements from '@/pages/Etablissements/Etablissements'
import Localisations from '@/pages/Localisations/Localisations'
import Horaires from '@/pages/Horaires/Horaires'
import ConseilsSante from '@/pages/ConseilsSante/ConseilsSante'
import NumerosUrgence from '@/pages/NumerosUrgence/NumerosUrgence'
import OrientationQuestions from '@/pages/OrientationQuestions/OrientationQuestions'

import UserHome from '@/pages/UserHome/UserHome'
import UserSearch from '@/pages/UserSearch/UserSearch'
import UserServices from '@/pages/UserServices/UserServices'
import UserHealthAdvice from '@/pages/UserHealthAdvice/UserHealthAdvice'
import UserHealthAdviceDetail from '@/pages/UserHealthAdvice/UserHealthAdviceDetail'
import UserAskQuestion from '@/pages/UserAskQuestion/UserAskQuestion'
import UserEmergency from '@/pages/UserEmergency/UserEmergency'
import UserProfile from '@/pages/UserProfile/UserProfile'

import NotFound from '@/pages/NotFound/NotFound'

function AppRouter() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  )

  const role = useAuthStore(
    (state) => state.user?.role,
  )

  const isAdmin =
    isAuthenticated && role === 'ADMIN'

  return (
    <Routes>
      {/* ============================================================
          ESPACE ADMIN
          Accessible uniquement aux administrateurs
          ============================================================ */}
      <Route
        element={
          <ProtectedRoute>
            <RequireRole role="ADMIN">
              <AdminLayout />
            </RequireRole>
          </ProtectedRoute>
        }
      >
        {isAdmin && (
          <Route
            path={ROUTES.DASHBOARD}
            element={<Dashboard />}
          />
        )}

        <Route
          path={ROUTES.USERS}
          element={<Utilisateurs />}
        />

        <Route
          path={ROUTES.ADMINS}
          element={<Administrateurs />}
        />

        <Route
          path={ROUTES.SPECIALTIES}
          element={<Specialites />}
        />

        <Route
          path={ROUTES.MEDICAL_SERVICES}
          element={<ServicesMedicaux />}
        />

        <Route
          path={ROUTES.ESTABLISHMENTS}
          element={<Etablissements />}
        />

        <Route
          path={ROUTES.LOCATIONS}
          element={<Localisations />}
        />

        <Route
          path={ROUTES.SCHEDULES}
          element={<Horaires />}
        />

        {/* ==========================================================
            GESTION ADMIN DES NUMÉROS D'URGENCE
            ========================================================== */}
        <Route
          path={ROUTES.ADMIN_EMERGENCY_NUMBERS}
          element={<NumerosUrgence />}
        />

        <Route
          path={ROUTES.HEALTH_ADVICE_MANAGEMENT}
          element={<ConseilsSante />}
        />

        <Route
          path={ROUTES.ORIENTATION_QUESTIONS}
          element={<OrientationQuestions />}
        />
      </Route>

      {/* ============================================================
          ESPACE PUBLIC
          Accessible sans authentification
          ============================================================ */}
      <Route element={<PublicLayout />}>
        {!isAdmin && (
          <Route
            path={ROUTES.PUBLIC_HOME}
            element={<PublicHome />}
          />
        )}

        <Route
          path={ROUTES.SEARCH}
          element={<UserSearch />}
        />

        <Route
          path={ROUTES.SERVICES_SEARCH}
          element={<UserServices />}
        />

        <Route
          path={ROUTES.HEALTH_ADVICE}
          element={<UserHealthAdvice />}
        />

        <Route
          path={`${ROUTES.HEALTH_ADVICE}/:id`}
          element={<UserHealthAdviceDetail />}
        />

        {/* ==========================================================
            NUMÉROS D'URGENCE - PUBLIC
            ========================================================== */}
        <Route
          path={ROUTES.EMERGENCY_NUMBERS}
          element={<UserEmergency />}
        />

        <Route
          path={ROUTES.EMERGENCY}
          element={<UserEmergency />}
        />

        <Route
          path={ROUTES.MEDICAL_ORIENTATION}
          element={<UserAskQuestion />}
        />
      </Route>

      {/* ============================================================
          LOGIN
          ============================================================ */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* ============================================================
          REGISTER
          ============================================================ */}
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* ============================================================
          ESPACE UTILISATEUR CONNECTÉ
          ============================================================ */}
      <Route
        element={
          <ProtectedRoute>
            <RequireRole role="UTILISATEUR">
              <UserLayout />
            </RequireRole>
          </ProtectedRoute>
        }
      >
        <Route
          path={ROUTES.HOME}
          element={<UserHome />}
        />

        <Route
          path={ROUTES.PROFILE}
          element={<UserProfile />}
        />
      </Route>

      {/* ============================================================
          PAGE NOT FOUND
          ============================================================ */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  )
}

export default AppRouter