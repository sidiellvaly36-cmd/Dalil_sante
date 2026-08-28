import type { BackendRole } from './auth'
import type { EtablissementSante } from './etablissement'
import type { NumeroUrgence } from './numeroUrgence'
import type { ServiceMedical } from './serviceMedical'
import type { SpecialiteMedicale } from './specialiteMedicale'
import type { Utilisateur } from './utilisateur'

/**
 * أنواع خاصة بلوحة التحكم (Dashboard).
 * لا يوجد أي endpoint إحصائي مخصص في الـ Backend حاليًا - كل هذه الأنواع
 * تمثّل بيانات مُشتقّة (computed) في الواجهة انطلاقًا من نقاط GET الحقيقية
 * الموجودة فعليًا (utilisateurs, etablissements, services-medicaux,
 * specialites-medicales, numeros-urgence). لا بيانات وهمية.
 */

/** عدد إجمالي مع تفصيل actif/inactif - متاح فقط للكيانات التي تملك حقل actif */
export interface CountBreakdown {
  total: number
  actifs: number
  inactifs: number
}

/** عنصر واحد في توزيع المستخدمين حسب الدور (لرسم Donut) */
export interface RoleDistributionItem {
  role: BackendRole
  label: string
  value: number
}

/**
 * الفترة الزمنية لتجميع منحنى التسجيلات.
 * محسوبة فقط من Utilisateur.dateCreation الحقيقي - وهو الحقل الوحيد
 * من نوع تاريخ إنشاء الموجود فعليًا في الـ Backend حاليًا (بقية الكيانات
 * لا تملك أي حقل تاريخ إنشاء، لذلك لا يمكن بناء نفس المنحنى لها بصدق).
 */
export type TrendPeriod = 'day' | 'month' | 'year'

/** نقطة واحدة في منحنى تطور التسجيلات */
export interface RegistrationTrendPoint {
  label: string
  count: number
}

/** الحزمة الكاملة للإحصائيات المُشتقّة المعروضة في لوحة التحكم */
export interface DashboardStats {
  utilisateurs: CountBreakdown
  admins: number
  utilisateursRole: number

  etablissements: CountBreakdown
  servicesMedicaux: CountBreakdown
  specialites: CountBreakdown
  numerosUrgence: number

  roleDistribution: RoleDistributionItem[]

  recentUtilisateurs: Utilisateur[]
  recentEtablissements: EtablissementSante[]
  recentServicesMedicaux: ServiceMedical[]
  recentSpecialites: SpecialiteMedicale[]
  recentNumerosUrgence: NumeroUrgence[]
}