import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Empty, Result, Skeleton, Spin, Tag, Typography } from 'antd'
import {
  ArrowLeftOutlined,
  BankOutlined,
  CalendarOutlined,
  DownloadOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useConseilByIdQuery, useConseilPdfQuery } from '@/hooks/useConseilsSante'
import { CATEGORIE_CONSEIL_LABELS, ROUTES } from '@/constants'
import { formatDate } from '@/utils'
import styles from './UserHealthAdviceDetail.module.scss'

const { Title, Text } = Typography

/**
 * Page de détail d'un conseil de santé - GET /api/conseils-sante/{id}
 * (métadonnées réelles) puis, si un PDF existe, GET /api/conseils-sante/{id}/pdf
 * (fichier réel, protégé par JWT - jamais une URL statique publique). Le PDF
 * est récupéré en Blob authentifié via httpClient puis affiché via une URL
 * objet locale (URL.createObjectURL) : cela contourne à la fois le problème
 * "un <iframe src="..."> classique n'envoie pas l'en-tête Authorization" et
 * le fait que la réponse du Backend porte X-Frame-Options: DENY (qui ne
 * s'applique qu'à un chargement réseau direct, pas à une blob: URL locale).
 * Les anciens conseils sans PDF (créés avant cette fonctionnalité) affichent
 * encore leur texte "contenu" historique, jamais supprimé côté Backend.
 */
function UserHealthAdviceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const conseilId = id ? Number(id) : undefined
  const { data: conseil, isLoading, isError } = useConseilByIdQuery(conseilId)

  const hasPdf = Boolean(conseil?.pdfUrl)
  const {
    data: pdfBlob,
    isLoading: isLoadingPdf,
    isError: isErrorPdf,
    refetch: refetchPdf,
  } = useConseilPdfQuery(conseilId, hasPdf)

  const [pdfObjectUrl, setPdfObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!pdfBlob) {
      setPdfObjectUrl(null)
      return
    }

    const url = URL.createObjectURL(pdfBlob)
    setPdfObjectUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [pdfBlob])

  const downloadFileName = useMemo(() => conseil?.pdfFileName ?? 'document.pdf', [conseil])

  const handleDownload = () => {
    if (!pdfObjectUrl) return
    const link = document.createElement('a')
    link.href = pdfObjectUrl
    link.download = downloadFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <span className={styles.backLink} onClick={() => navigate(ROUTES.HEALTH_ADVICE)} role="button">
        <ArrowLeftOutlined /> Retour aux conseils de santé
      </span>

      {isLoading && (
        <div className={styles.centerState}>
          <Spin size="large" tip="Chargement..." />
        </div>
      )}

      {isError && (
        <Result
          status="404"
          title="Conseil introuvable"
          subTitle="Ce conseil de santé n'existe pas ou plus."
        />
      )}

      {!isLoading && !isError && conseil && (
        <>
          <Title level={3}>{conseil.titre}</Title>

          <div className={styles.metaRow}>
            {conseil.categorie && <Tag color="blue">{CATEGORIE_CONSEIL_LABELS[conseil.categorie]}</Tag>}
            <span>
              <CalendarOutlined /> {formatDate(conseil.dateCreation)}
            </span>
            {conseil.etablissementNom && (
              <span>
                <BankOutlined /> {conseil.etablissementNom}
              </span>
            )}
          </div>

          {hasPdf && (
            <div className={styles.pdfSection}>
              <div className={styles.pdfToolbar}>
                <span className={styles.pdfFileName}>
                  <FilePdfOutlined /> {conseil.pdfFileName}
                </span>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  disabled={!pdfObjectUrl}
                >
                  Télécharger le PDF
                </Button>
              </div>

              {isLoadingPdf && (
                <div className={styles.pdfLoading}>
                  <Skeleton active paragraph={{ rows: 8 }} />
                </div>
              )}

              {isErrorPdf && (
                <Alert
                  type="error"
                  showIcon
                  message="Impossible de charger le document PDF."
                  action={
                    <a onClick={() => refetchPdf()} role="button">
                      Réessayer
                    </a>
                  }
                  style={{ marginBottom: 16 }}
                />
              )}

              {pdfObjectUrl && !isLoadingPdf && !isErrorPdf && (
                <div className={styles.pdfViewerWrapper}>
                  <iframe src={pdfObjectUrl} title={conseil.titre} className={styles.pdfViewer} />
                </div>
              )}

              <Text type="secondary" className={styles.pdfFallbackHint}>
                Si l'aperçu ne s'affiche pas, utilisez le bouton « Télécharger le PDF » ci-dessus pour
                l'ouvrir directement.
              </Text>
            </div>
          )}

          {!hasPdf && conseil.contenu && <Text className={styles.content}>{conseil.contenu}</Text>}

          {!hasPdf && !conseil.contenu && (
            <Empty description="Aucun contenu disponible pour ce conseil." style={{ margin: '32px 0' }} />
          )}

          <Alert
            type="warning"
            showIcon
            style={{ marginTop: 24 }}
            message="Ce conseil est fourni à titre informatif et ne remplace pas un diagnostic ou une consultation médicale."
          />

          <Button className={styles.backButton} onClick={() => navigate(ROUTES.HEALTH_ADVICE)}>
            <ArrowLeftOutlined /> Retour aux conseils
          </Button>
        </>
      )}
    </div>
  )
}

export default UserHealthAdviceDetail