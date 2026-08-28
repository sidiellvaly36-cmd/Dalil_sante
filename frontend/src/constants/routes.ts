/**
 * مسارات التطبيق (Route Paths)
 * ------------------------------
 * مصدر وحيد للحقيقة لكل مسارات React Router.
 * لا تكتب أي مسار كنص حرفي (Hardcoded String)
 * في أي مكون أو صفحة، استورد دائمًا من هنا.
 */
export const ROUTES = {
  PUBLIC_HOME: '/',
  LOGIN: '/login',
  REGISTER: '/inscription',
  FORGOT_PASSWORD: '/mot-de-passe-oublie',

  // ============================================================
  // ESPACE ADMIN
  // ============================================================
  ADMIN: '/admin',
  DASHBOARD: '/admin/dashboard',
  USERS: '/utilisateurs',
  ADMINS: '/administrateurs',
  ESTABLISHMENTS: '/etablissements',
  ESTABLISHMENT_TYPES: '/admin/types-etablissement',
  LOCATIONS: '/localisations',
  MEDICAL_SERVICES: '/services-medicaux',
  SPECIALTIES: '/specialites',
  SCHEDULES: '/horaires',

  // Gestion ADMIN des numéros d'urgence
  ADMIN_EMERGENCY_NUMBERS: '/admin/numeros-urgence',

  ORIENTATION_QUESTIONS: '/admin/orientation-questions',
  HEALTH_ADVICE_MANAGEMENT: '/gestion-conseils-sante',
  SETTINGS: '/parametres',

  // ============================================================
  // ESPACE UTILISATEUR & PUBLIC
  // ============================================================
  HOME: '/accueil',
  SEARCH: '/recherche',
  SERVICES_SEARCH: '/services',

  // Consultation publique des numéros d'urgence
  EMERGENCY_NUMBERS: '/numeros-urgence',

  EMERGENCY: '/urgences',
  HEALTH_ADVICE: '/conseils-sante',
  MEDICAL_ORIENTATION: '/orientation-medicale',
  PROFILE: '/profil',
} as const