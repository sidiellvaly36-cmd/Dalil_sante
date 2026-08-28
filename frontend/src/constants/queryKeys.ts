/**
 * مفاتيح TanStack Query (Query Keys)
 * ------------------------------------
 * ملاحظة: صفحتا Utilisateurs و Administrateurs تستخدمان نفس المفتاح UTILISATEURS
 * لأنهما تستهلكان نفس المورد الحقيقي في الـ Backend (/api/utilisateurs)، والتمييز
 * بينهما يتم بالفلترة على حقل role داخل طبقة الـ Service وليس بمفتاح Cache مختلف.
 */
export const QUERY_KEYS = {
  AUTH_PROFILE: 'auth-profile',
  UTILISATEURS: 'utilisateurs',
  ETABLISSEMENTS: 'etablissements',
  TYPES_ETABLISSEMENT: 'types-etablissement',
  LOCALISATIONS: 'localisations',
  SPECIALITES: 'specialites-medicales',
  SERVICES_MEDICAUX: 'services-medicaux',
  HORAIRES: 'horaires',
  NUMEROS_URGENCE: 'numeros-urgence',
  ORIENTATION_QUESTIONS: 'orientation-questions',
  ORIENTATION_OPTIONS: 'orientation-options',
  ORIENTATION_RESULTS: 'orientation-results',
  ORIENTATION_RULES: 'orientation-rules',
  CONSEILS_SANTE: 'conseils-sante',
  CONSEILS_SANTE_PUBLISHED: 'conseils-sante-published',
  STATISTIQUES_RECHERCHE: 'statistiques-recherche',
} as const
