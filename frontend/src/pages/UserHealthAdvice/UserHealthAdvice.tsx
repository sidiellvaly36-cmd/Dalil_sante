import { useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Empty, Input, Row, Select, Spin, Tag, Typography } from 'antd'
import {
  BankOutlined,
  BulbOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components'
import { usePublishedConseilsQuery } from '@/hooks/useConseilsSante'
import { CATEGORIE_CONSEIL_LABELS, CATEGORIE_CONSEIL_OPTIONS, ROUTES } from '@/constants'
import { formatDate } from '@/utils'
import type { CategorieConseil } from '@/types'
import styles from './UserHealthAdvice.module.scss'

const { Title, Text } = Typography

/**
 * Conseils de santé (espace UTILISATEUR) - liste réelle des conseils PUBLIÉS
 * uniquement (GET /api/conseils-sante/published, jamais /conseils-sante seul
 * qui exigerait ADMIN). Recherche (titre/contenu) et filtre par catégorie sont
 * calculés côté client sur la liste déjà chargée. Chaque carte mène à la page
 * de détail réelle (GET /api/conseils-sante/{id}).
 *
 * Ces conseils sont des informations générales de prévention publiées par la
 * plateforme ou un établissement de santé - ils ne constituent en aucun cas un
 * diagnostic ou une prescription médicale.
 */
function UserHealthAdvice() {
  const navigate = useNavigate()
  const { data: conseils, isLoading, isError } = usePublishedConseilsQuery()
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState<CategorieConseil | undefined>(undefined)

  const filtered = useMemo(() => {
    let items = conseils ?? []

    if (search.trim()) {
      const term = search.trim().toLowerCase()
      items = items.filter(
        (conseil) =>
          conseil.titre.toLowerCase().includes(term) ||
          (conseil.contenu ?? '').toLowerCase().includes(term),
      )
    }

    if (categorie) {
      items = items.filter((conseil) => conseil.categorie === categorie)
    }

    return [...items].sort((a, b) => (a.dateCreation < b.dateCreation ? 1 : -1))
  }, [conseils, search, categorie])

  return (
    <div>
      <PageHeader
        title="Conseils de santé"
        subtitle="Informations et conseils de prévention publiés par la plateforme et les établissements de santé."
      />

      <Alert
        type="warning"
        showIcon
        message="Ces conseils sont fournis à titre informatif et ne remplacent pas un diagnostic ou une consultation médicale."
        style={{ marginBottom: 16 }}
      />

      <div className={styles.filters}>
        <Input
          allowClear
          className={styles.searchInput}
          prefix={<SearchOutlined />}
          placeholder="Rechercher un conseil..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          allowClear
          className={styles.categorieSelect}
          placeholder="Catégorie"
          value={categorie}
          onChange={setCategorie}
          options={CATEGORIE_CONSEIL_OPTIONS}
        />
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Erreur de chargement"
          description="Impossible de récupérer les conseils de santé depuis le serveur."
          style={{ marginBottom: 16 }}
        />
      )}

      {isLoading && (
        <div className={styles.centerState}>
          <Spin size="large" tip="Chargement..." />
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Empty description="Aucun conseil de santé ne correspond à votre recherche." />
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <Row gutter={[16, 16]}>
          {filtered.map((conseil) => (
            <Col xs={24} sm={12} lg={8} key={conseil.id}>
              <Card className={styles.card}>
                <div className={styles.cardHeader}>
                  <Title level={5} style={{ marginBottom: 0 }}>
                    <BulbOutlined /> {conseil.titre}
                  </Title>
                  {conseil.pdfUrl && (
                    <Tag icon={<FilePdfOutlined />} color="red">
                      PDF
                    </Tag>
                  )}
                </div>

                {conseil.categorie && <Tag color="blue">{CATEGORIE_CONSEIL_LABELS[conseil.categorie]}</Tag>}

                {conseil.contenu && <Text className={styles.excerpt}>{conseil.contenu}</Text>}

                <div className={styles.metaRow}>
                  <CalendarOutlined />
                  <span>{formatDate(conseil.dateCreation)}</span>
                  {conseil.etablissementNom && (
                    <>
                      <BankOutlined style={{ marginLeft: 8 }} />
                      <span>{conseil.etablissementNom}</span>
                    </>
                  )}
                </div>

                <Button
                  type="link"
                  className={styles.readButton}
                  onClick={() => navigate(`${ROUTES.HEALTH_ADVICE}/${conseil.id}`)}
                >
                  Lire le conseil
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default UserHealthAdvice