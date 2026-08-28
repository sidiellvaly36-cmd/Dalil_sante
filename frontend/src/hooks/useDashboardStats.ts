import { useMemo } from 'react'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { utilisateurService } from '@/services/utilisateurService'
import { etablissementService } from '@/services/etablissementService'
import { serviceMedicalService } from '@/services/serviceMedicalService'
import { specialiteService } from '@/services/specialiteService'
import { numeroUrgenceService } from '@/services/numeroUrgenceService'
import { QUERY_KEYS } from '@/constants'
import type {
  CountBreakdown,
  DashboardStats,
  EtablissementSante,
  NumeroUrgence,
  RegistrationTrendPoint,
  ServiceMedical,
  SpecialiteMedicale,
  TrendPeriod,
  Utilisateur,
} from '@/types'

const RECENT_LIMIT = 5

function breakdown<T extends { actif: boolean }>(items: T[]): CountBreakdown {
  const actifs = items.filter((item) => item.actif).length
  return { total: items.length, actifs, inactifs: items.length - actifs }
}

function recentByDate<T extends { dateCreation: string }>(items: T[], limit: number): T[] {
  return [...items]
    .sort((a, b) => dayjs(b.dateCreation).valueOf() - dayjs(a.dateCreation).valueOf())
    .slice(0, limit)
}

/** الترتيب بحسب id تنازليًا: بديل صادق لعدم وجود حقل تاريخ إنشاء على هذا الكيان */
function recentById<T extends { id: number }>(items: T[], limit: number): T[] {
  return [...items].sort((a, b) => b.id - a.id).slice(0, limit)
}

/**
 * يبني منحنى تطور تسجيلات المستخدمين الحقيقي من Utilisateur.dateCreation.
 * يملأ الفترات الفارغة بصفر حقيقي (وليس بيانات وهمية) حتى يبقى المحور الزمني متصلًا.
 */
function buildRegistrationTrend(
  utilisateurs: Utilisateur[],
  period: TrendPeriod,
): RegistrationTrendPoint[] {
  const unit = period === 'day' ? 'day' : period === 'month' ? 'month' : 'year'
  const bucketsCount = period === 'day' ? 14 : period === 'month' ? 12 : 5
  const displayFormat = period === 'day' ? 'DD/MM' : period === 'month' ? 'MM/YYYY' : 'YYYY'
  const groupFormat = period === 'day' ? 'YYYY-MM-DD' : period === 'month' ? 'YYYY-MM' : 'YYYY'

  const counts = new Map<string, number>()
  utilisateurs.forEach((utilisateur) => {
    const key = dayjs(utilisateur.dateCreation).format(groupFormat)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })

  const now = dayjs()
  const points: RegistrationTrendPoint[] = []

  for (let i = bucketsCount - 1; i >= 0; i -= 1) {
    const date = now.subtract(i, unit)
    const key = date.format(groupFormat)
    points.push({ label: date.format(displayFormat), count: counts.get(key) ?? 0 })
  }

  return points
}

/**
 * يجمع كل إحصائيات لوحة التحكم من نقاط GET الحقيقية الموجودة فعليًا في الـ Backend
 * (لا يوجد endpoint إحصائي مخصص). يعيد استخدام نفس مفاتيح TanStack Query التي
 * تستهلكها بقية الصفحات (Cache مشترك، لا طلبات مكرّرة غير ضرورية).
 */
export function useDashboardStats(trendPeriod: TrendPeriod) {
  const queryClient = useQueryClient()

  const results = useQueries({
    queries: [
      { queryKey: [QUERY_KEYS.UTILISATEURS], queryFn: () => utilisateurService.getAll() },
      { queryKey: [QUERY_KEYS.ETABLISSEMENTS], queryFn: () => etablissementService.getAll() },
      { queryKey: [QUERY_KEYS.SERVICES_MEDICAUX], queryFn: () => serviceMedicalService.getAll() },
      { queryKey: [QUERY_KEYS.SPECIALITES], queryFn: () => specialiteService.getAll() },
      { queryKey: [QUERY_KEYS.NUMEROS_URGENCE], queryFn: () => numeroUrgenceService.getAll() },
    ],
  })

  const [utilisateursResult, etablissementsResult, servicesResult, specialitesResult, numerosResult] =
    results

  const isLoading = results.some((result) => result.isLoading)
  const isFetching = results.some((result) => result.isFetching)
  const isError = results.some((result) => result.isError)

  const utilisateurs: Utilisateur[] = utilisateursResult.data ?? []
  const etablissements: EtablissementSante[] = etablissementsResult.data ?? []
  const services: ServiceMedical[] = servicesResult.data ?? []
  const specialites: SpecialiteMedicale[] = specialitesResult.data ?? []
  const numeros: NumeroUrgence[] = numerosResult.data ?? []

  const isEmpty =
    !isLoading &&
    !isError &&
    utilisateurs.length === 0 &&
    etablissements.length === 0 &&
    services.length === 0 &&
    specialites.length === 0 &&
    numeros.length === 0

  const stats: DashboardStats | null = useMemo(() => {
    if (isLoading || isError) return null

    const admins = utilisateurs.filter((u) => u.role === 'ADMIN').length
    const utilisateursRole = utilisateurs.filter((u) => u.role === 'UTILISATEUR').length

    return {
      utilisateurs: breakdown(utilisateurs),
      admins,
      utilisateursRole,
      etablissements: breakdown(etablissements),
      servicesMedicaux: breakdown(services),
      specialites: breakdown(specialites),
      numerosUrgence: numeros.length,
      roleDistribution: [
        { role: 'ADMIN', label: 'Administrateurs', value: admins },
        { role: 'UTILISATEUR', label: 'Utilisateurs', value: utilisateursRole },
      ],
      recentUtilisateurs: recentByDate(utilisateurs, RECENT_LIMIT),
      recentEtablissements: recentById(etablissements, RECENT_LIMIT),
      recentServicesMedicaux: recentById(services, RECENT_LIMIT),
      recentSpecialites: recentById(specialites, RECENT_LIMIT),
      recentNumerosUrgence: recentById(numeros, RECENT_LIMIT),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError, utilisateurs, etablissements, services, specialites, numeros])

  const registrationTrend = useMemo(
    () => buildRegistrationTrend(utilisateurs, trendPeriod),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [utilisateurs, trendPeriod],
  )

  function refetchAll() {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UTILISATEURS] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ETABLISSEMENTS] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICES_MEDICAUX] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SPECIALITES] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NUMEROS_URGENCE] })
  }

  return { stats, registrationTrend, isLoading, isFetching, isError, isEmpty, refetchAll }
}