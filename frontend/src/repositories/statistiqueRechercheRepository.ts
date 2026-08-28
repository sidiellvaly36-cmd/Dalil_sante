import { httpClient } from '@/lib/httpClient'
import type { RechercheLogRequest, StatistiqueRechercheResponse } from '@/types'

/** طبقة الوصول للبيانات - تطابق حرفيًا StatistiqueRechercheController.java */
export const statistiqueRechercheRepository = {
  /** POST /api/statistiques/recherches - يسجّل بحثًا مُنفَّذًا فعليًا (ADMIN + UTILISATEUR) */
  async enregistrer(payload: RechercheLogRequest): Promise<void> {
    await httpClient.post('/api/statistiques/recherches', payload)
  },

  /** GET /api/statistiques/recherches - إحصائيات مُجمَّعة في PostgreSQL (ADMIN فقط) */
  async getStatistiques(): Promise<StatistiqueRechercheResponse> {
    const { data } = await httpClient.get<StatistiqueRechercheResponse>('/api/statistiques/recherches')
    return data
  },
}