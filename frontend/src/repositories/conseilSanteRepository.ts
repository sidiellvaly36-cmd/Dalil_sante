import type { AxiosProgressEvent } from 'axios'
import { httpClient } from '@/lib/httpClient'
import type { CategorieConseil, ConseilSante, ConseilSantePayload } from '@/types'

function buildFormData(payload: ConseilSantePayload, pdf?: File | null): FormData {
  const formData = new FormData()
  formData.append('metadata', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  if (pdf) formData.append('pdf', pdf)
  return formData
}

function toUploadProgressHandler(onProgress?: (percent: number) => void) {
  if (!onProgress) return undefined
  return (event: AxiosProgressEvent) => {
    if (!event.total) return
    onProgress(Math.round((event.loaded / event.total) * 100))
  }
}

/** طبقة الوصول للبيانات - تطابق حرفيًا ConseilSanteController.java */
export const conseilSanteRepository = {
  /** GET /api/conseils-sante (كل النصائح، منشورة وغير منشورة) - ADMIN فقط */
  async getAll(): Promise<ConseilSante[]> {
    const { data } = await httpClient.get<ConseilSante[]>('/api/conseils-sante')
    return data
  },

  /** GET /api/conseils-sante/published - ADMIN + UTILISATEUR */
  async getPublished(): Promise<ConseilSante[]> {
    const { data } = await httpClient.get<ConseilSante[]>('/api/conseils-sante/published')
    return data
  },

  /** GET /api/conseils-sante/published/categorie/{categorie} */
  async getPublishedByCategorie(categorie: CategorieConseil): Promise<ConseilSante[]> {
    const { data } = await httpClient.get<ConseilSante[]>(
      `/api/conseils-sante/published/categorie/${categorie}`,
    )
    return data
  },

  /** GET /api/conseils-sante/{id} */
  async getById(id: number): Promise<ConseilSante> {
    const { data } = await httpClient.get<ConseilSante>(`/api/conseils-sante/${id}`)
    return data
  },

  /**
   * GET /api/conseils-sante/{id}/pdf - le fichier est protégé par JWT (jamais
   * servi comme ressource statique publique), donc récupéré en Blob via
   * httpClient (qui attache automatiquement le token) plutôt que par une URL
   * directe utilisable dans un <iframe src="..."> classique.
   */
  async getPdfBlob(id: number): Promise<Blob> {
    const { data } = await httpClient.get<Blob>(`/api/conseils-sante/${id}/pdf`, {
      responseType: 'blob',
    })
    return data
  },

  /**
   * POST /api/conseils-sante - multipart/form-data : partie "metadata" (JSON)
   * + partie "pdf" (fichier, obligatoire). httpClient impose
   * 'Content-Type: application/json' par défaut sur toute l'instance ; ce
   * défaut doit être explicitement effacé ici pour que le navigateur
   * définisse lui-même le vrai 'multipart/form-data; boundary=...', sans quoi
   * le Backend rejette la requête (Content-Type non supporté par ce endpoint).
   */
  async create(
    payload: ConseilSantePayload,
    pdf: File,
    onProgress?: (percent: number) => void,
  ): Promise<ConseilSante> {
    const { data } = await httpClient.post<ConseilSante>(
      '/api/conseils-sante',
      buildFormData(payload, pdf),
      { headers: { 'Content-Type': undefined }, onUploadProgress: toUploadProgressHandler(onProgress) },
    )
    return data
  },

  /** PUT /api/conseils-sante/{id} - "pdf" optionnel (absent = conserver le PDF existant) */
  async update(
    id: number,
    payload: ConseilSantePayload,
    pdf?: File | null,
    onProgress?: (percent: number) => void,
  ): Promise<ConseilSante> {
    const { data } = await httpClient.put<ConseilSante>(
      `/api/conseils-sante/${id}`,
      buildFormData(payload, pdf),
      { headers: { 'Content-Type': undefined }, onUploadProgress: toUploadProgressHandler(onProgress) },
    )
    return data
  },

  /** DELETE /api/conseils-sante/{id} */
  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/conseils-sante/${id}`)
  },
}