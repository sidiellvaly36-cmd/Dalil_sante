import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { conseilSanteService } from '@/services/conseilSanteService'
import { QUERY_KEYS } from '@/constants'
import { extractErrorMessage } from '@/lib/httpClient'
import type { CategorieConseil, ConseilSantePayload } from '@/types'

/** GET /api/conseils-sante (toutes, publiées et non publiées) - vue ADMIN */
export function useConseilsSanteQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.CONSEILS_SANTE],
    queryFn: () => conseilSanteService.getAll(),
  })
}

/** GET /api/conseils-sante/published - vue UTILISATEUR */
export function usePublishedConseilsQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.CONSEILS_SANTE_PUBLISHED],
    queryFn: () => conseilSanteService.getPublished(),
  })
}

/** GET /api/conseils-sante/{id} - page de détail (ADMIN + UTILISATEUR) */
export function useConseilByIdQuery(id: number | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.CONSEILS_SANTE, id],
    queryFn: () => conseilSanteService.getById(id as number),
    enabled: id !== undefined,
  })
}

/**
 * GET /api/conseils-sante/{id}/pdf - récupère le PDF réel en Blob (requête
 * authentifiée via httpClient, jamais une URL statique publique). Le Blob
 * n'est pas sérialisable ; ce cache reste local à l'onglet, ce qui est
 * approprié pour un fichier binaire volumineux.
 */
export function useConseilPdfQuery(id: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey: [QUERY_KEYS.CONSEILS_SANTE, id, 'pdf'],
    queryFn: () => conseilSanteService.getPdfBlob(id as number),
    enabled: id !== undefined && enabled,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  })
}

function invalidateConseils(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONSEILS_SANTE] })
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONSEILS_SANTE_PUBLISHED] })
}

export function useCreateConseil() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({
      payload,
      pdf,
      onProgress,
    }: {
      payload: ConseilSantePayload
      pdf: File
      onProgress?: (percent: number) => void
    }) => conseilSanteService.create(payload, pdf, onProgress),
    onSuccess: () => {
      invalidateConseils(queryClient)
      message.success('Conseil de santé créé avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de créer le conseil de santé.'))
    },
  })
}

export function useUpdateConseil() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({
      id,
      payload,
      pdf,
      onProgress,
    }: {
      id: number
      payload: ConseilSantePayload
      pdf?: File | null
      onProgress?: (percent: number) => void
    }) => conseilSanteService.update(id, payload, pdf, onProgress),
    onSuccess: (_, variables) => {
      invalidateConseils(queryClient)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONSEILS_SANTE, variables.id, 'pdf'] })
      message.success('Conseil de santé modifié avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de modifier le conseil de santé.'))
    },
  })
}

export function useDeleteConseil() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => conseilSanteService.remove(id),
    onSuccess: () => {
      invalidateConseils(queryClient)
      message.success('Conseil de santé supprimé avec succès.')
    },
    onError: (error) => {
      message.error(extractErrorMessage(error, 'Impossible de supprimer le conseil de santé.'))
    },
  })
}

/** utilitaire client-side pour filtrer une liste déjà chargée par catégorie (évite un appel réseau supplémentaire quand la liste complète est déjà en cache) */
export function filterByCategorie<T extends { categorie: CategorieConseil | null }>(
  items: T[],
  categorie: CategorieConseil | undefined,
): T[] {
  if (!categorie) return items
  return items.filter((item) => item.categorie === categorie)
}