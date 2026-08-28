import { useMutation, useQuery } from '@tanstack/react-query'
import { statistiqueRechercheService } from '@/services/statistiqueRechercheService'
import { QUERY_KEYS } from '@/constants'
import type { RechercheLogRequest } from '@/types'

/**
 * Journalise une recherche réellement exécutée (jamais appelée à chaque
 * frappe clavier - voir UserSearch.tsx). Fire-and-forget volontaire : un
 * échec de journalisation ne doit jamais perturber l'expérience de
 * recherche de l'UTILISATEUR (pas de toast d'erreur, pas de blocage).
 */
export function useLogRecherche() {
  return useMutation({
    mutationFn: (payload: RechercheLogRequest) => statistiqueRechercheService.enregistrer(payload),
  })
}

/** Statistiques de recherche (ADMIN uniquement) - entièrement agrégées côté PostgreSQL */
export function useStatistiqueRechercheQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.STATISTIQUES_RECHERCHE],
    queryFn: () => statistiqueRechercheService.getStatistiques(),
  })
}