import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Avatar, Button, Card, Col, Empty, Input, Row, Skeleton, Spin, Tag, Typography } from 'antd'
import {
  AimOutlined,
  BankOutlined,
  BulbOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  ExperimentOutlined,
  FilePdfOutlined,
  IdcardOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'
import { useEtablissementsQuery } from '@/hooks/useEtablissements'
import { useLocalisationsQuery } from '@/hooks/useLocalisations'
import { useServicesMedicauxQuery } from '@/hooks/useServicesMedicaux'
import { useSpecialitesQuery } from '@/hooks/useSpecialites'
import { usePublishedConseilsQuery } from '@/hooks/useConseilsSante'
import { useNumerosUrgenceQuery } from '@/hooks/useNumeroUrgence'
import { useGeolocation } from '@/hooks/useGeolocation'
import { haversineDistanceKm, formatDate } from '@/utils'
import { CATEGORIE_CONSEIL_LABELS, ROUTES } from '@/constants'
import type { EtablissementSante, Localisation } from '@/types'
import styles from './UserHome.module.scss'

const { Title, Text, Paragraph } = Typography

interface QuickAccessCard {
  key: string
  title: string
  icon: ReactNode
  onClick: () => void
}

interface SearchHit {
  key: string
  category: string
  icon: ReactNode
  label: string
  sublabel: string
  onClick: () => void
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Accueil (espace UTILISATEUR) - vraie page d'accueil d'une plateforme santé,
 * entièrement branchée sur le Backend réel (aucune donnée fictive) :
 *
 * - Établissements/Services/Spécialités/Conseils/Numéros : listes déjà chargées
 *   une seule fois via TanStack Query (mêmes clés que les autres pages), donc
 *   partagées en cache avec Recherche/Services/Conseils - pas de requêtes en
 *   double en naviguant.
 * - "Établissements proches" : géolocalisation réelle du navigateur + distance
 *   Haversine calculée côté client (le Backend n'expose aucun endpoint de calcul
 *   de distance - déjà établi dans UserSearch).
 * - Recherche rapide en haut de page : filtre côté client les listes déjà en
 *   cache (établissements/services/spécialités/conseils publiés) - le Backend a
 *   bien un endpoint /api/etablissements/search?nom=, mais comme la liste
 *   complète est de toute façon nécessaire pour les autres sections de cette
 *   page, la filtrer en mémoire évite une requête réseau redondante (cohérent
 *   avec le choix déjà fait dans UserSearch.tsx).
 * - "Poser une question" renvoie vers la page d'orientation réelle existante :
 *   le Backend ne fournit aucune logique d'évaluation (CRUD seul sur
 *   questions/options/rules/results), donc pas de faux formulaire ici.
 */
function UserHome() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()

  const {
    data: etablissements,
    isLoading: isLoadingEtablissements,
    isError: isErrorEtablissements,
    refetch: refetchEtablissements,
  } = useEtablissementsQuery()
  const { data: localisations, isLoading: isLoadingLocalisations } = useLocalisationsQuery()
  const {
    data: services,
    isLoading: isLoadingServices,
    isError: isErrorServices,
    refetch: refetchServices,
  } = useServicesMedicauxQuery()
  const {
    data: specialites,
    isLoading: isLoadingSpecialites,
    isError: isErrorSpecialites,
    refetch: refetchSpecialites,
  } = useSpecialitesQuery()
  const {
    data: conseils,
    isLoading: isLoadingConseils,
    isError: isErrorConseils,
    refetch: refetchConseils,
  } = usePublishedConseilsQuery()
  const {
    data: numeros,
    isLoading: isLoadingNumeros,
    isError: isErrorNumeros,
    refetch: refetchNumeros,
  } = useNumerosUrgenceQuery()

  const { coords, isLocating, error: geoError, requestLocation } = useGeolocation()

  const [search, setSearch] = useState('')
  const searchInputRef = useRef<HTMLDivElement>(null)

  const etablissementsActifs = useMemo(
    () => (etablissements ?? []).filter((e) => e.actif),
    [etablissements],
  )
  const servicesActifs = useMemo(() => (services ?? []).filter((s) => s.actif), [services])
  const specialitesActives = useMemo(() => (specialites ?? []).filter((s) => s.actif), [specialites])

  const goToSearch = (query?: string, specialiteId?: number, etablissementId?: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (specialiteId) params.set('specialiteId', String(specialiteId))
    if (etablissementId) params.set('etablissementId', String(etablissementId))
    const qs = params.toString()
    navigate(qs ? `${ROUTES.SEARCH}?${qs}` : ROUTES.SEARCH)
  }

  const quickAccessCards: QuickAccessCard[] = [
    { key: 'etablissements', title: 'Établissements de santé', icon: <BankOutlined />, onClick: () => navigate(ROUTES.SEARCH) },
    { key: 'services', title: 'Services médicaux', icon: <MedicineBoxOutlined />, onClick: () => navigate(ROUTES.SERVICES_SEARCH) },
    { key: 'specialites', title: 'Spécialités médicales', icon: <ExperimentOutlined />, onClick: () => scrollToId('specialites-section') },
    {
      key: 'proches',
      title: 'Établissements proches',
      icon: <EnvironmentOutlined />,
      onClick: () => {
        scrollToId('proches-section')
        if (!coords) requestLocation()
      },
    },
    { key: 'urgence', title: "Numéros d'urgence", icon: <PhoneOutlined />, onClick: () => scrollToId('urgence-section') },
    { key: 'conseils', title: 'Conseils de santé', icon: <BulbOutlined />, onClick: () => navigate(ROUTES.HEALTH_ADVICE) },
    { key: 'question', title: 'Poser une question', icon: <QuestionCircleOutlined />, onClick: () => navigate(ROUTES.MEDICAL_ORIENTATION) },
  ]

  const searchHits = useMemo<SearchHit[]>(() => {
    const term = search.trim().toLowerCase()
    if (term.length < 2) return []

    const hits: SearchHit[] = []

    for (const e of etablissementsActifs) {
      if (hits.filter((h) => h.category === 'Établissement').length >= 3) break
      if (e.nom.toLowerCase().includes(term)) {
        hits.push({
          key: `etab-${e.id}`,
          category: 'Établissement',
          icon: <BankOutlined />,
          label: e.nom,
          sublabel: e.typeEtablissementNom,
          onClick: () => goToSearch(e.nom),
        })
      }
    }

    for (const s of servicesActifs) {
      if (hits.filter((h) => h.category === 'Service médical').length >= 3) break
      if (s.nom.toLowerCase().includes(term)) {
        hits.push({
          key: `svc-${s.id}`,
          category: 'Service médical',
          icon: <MedicineBoxOutlined />,
          label: s.nom,
          sublabel: 'Service médical',
          onClick: () => navigate(ROUTES.SERVICES_SEARCH),
        })
      }
    }

    for (const sp of specialitesActives) {
      if (hits.filter((h) => h.category === 'Spécialité').length >= 3) break
      if (sp.nom.toLowerCase().includes(term)) {
        hits.push({
          key: `spec-${sp.id}`,
          category: 'Spécialité',
          icon: <ExperimentOutlined />,
          label: sp.nom,
          sublabel: 'Spécialité médicale',
          onClick: () => goToSearch(undefined, sp.id),
        })
      }
    }

    for (const c of conseils ?? []) {
      if (hits.filter((h) => h.category === 'Conseil de santé').length >= 3) break
      if (c.titre.toLowerCase().includes(term)) {
        hits.push({
          key: `conseil-${c.id}`,
          category: 'Conseil de santé',
          icon: <BulbOutlined />,
          label: c.titre,
          sublabel: 'Conseil de santé',
          onClick: () => navigate(`${ROUTES.HEALTH_ADVICE}/${c.id}`),
        })
      }
    }

    return hits
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, etablissementsActifs, servicesActifs, specialitesActives, conseils])

  const etablissementsProches = useMemo(() => {
    if (!coords || !localisations || !etablissements) return []

    const withDistance = etablissementsActifs
      .map((e) => {
        const localisation = (localisations as Localisation[]).find((l) => l.etablissementId === e.id)
        if (!localisation) return null
        const distanceKm = haversineDistanceKm(coords.latitude, coords.longitude, localisation.latitude, localisation.longitude)
        return { etablissement: e as EtablissementSante, localisation, distanceKm }
      })
      .filter((item): item is { etablissement: EtablissementSante; localisation: Localisation; distanceKm: number } => item !== null)

    return withDistance.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6)
  }, [coords, localisations, etablissements, etablissementsActifs])

  const dernieresConseils = useMemo(() => {
    return [...(conseils ?? [])].sort((a, b) => (a.dateCreation < b.dateCreation ? 1 : -1)).slice(0, 4)
  }, [conseils])

  return (
    <div className={styles.page}>
      {/* ===== Header / bloc de bienvenue ===== */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <Avatar size={56} icon={<UserOutlined />} className={styles.heroAvatar} />
          <div>
            <Title level={2} className={styles.heroTitle}>
              Bonjour, {user?.fullName ?? ''} 
            </Title>
            <Text className={styles.heroSubtitle}>
              Bienvenue sur Dalil Santé. Trouvez rapidement les soins et informations dont vous avez besoin.
            </Text>
          </div>
        </div>
        <div className={styles.heroActions}>
          <Button icon={<IdcardOutlined />} onClick={() => navigate(ROUTES.PROFILE)}>
            Mon profil
          </Button>
          <Button danger icon={<LogoutOutlined />} onClick={() => logout()}>
            Se déconnecter
          </Button>
        </div>
      </div>

      {/* ===== Recherche principale ===== */}
      <div className={styles.searchBlock} ref={searchInputRef}>
        <Input
          size="large"
          allowClear
          className={styles.searchInput}
          prefix={<SearchOutlined />}
          placeholder="Que recherchez-vous ? (établissement, service, spécialité, conseil...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={() => search.trim() && goToSearch(search.trim())}
        />
        {searchHits.length > 0 && (
          <div className={styles.searchResults}>
            {searchHits.map((hit) => (
              <div key={hit.key} className={styles.searchResultItem} onClick={hit.onClick}>
                <span className={styles.searchResultIcon}>{hit.icon}</span>
                <div className={styles.searchResultText}>
                  <span className={styles.searchResultLabel}>{hit.label}</span>
                  <span className={styles.searchResultSublabel}>{hit.sublabel}</span>
                </div>
                <Tag className={styles.searchResultTag}>{hit.category}</Tag>
              </div>
            ))}
            <div className={styles.searchResultFooter} onClick={() => goToSearch(search.trim())}>
              Voir tous les résultats pour « {search.trim()} » <RightOutlined />
            </div>
          </div>
        )}
        {search.trim().length >= 2 && searchHits.length === 0 && (
          <div className={styles.searchResults}>
            <Empty description="Aucun résultat trouvé." image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </div>

      {/* ===== Accès rapide ===== */}
      <Row gutter={[16, 16]} className={styles.section}>
        {quickAccessCards.map((card) => (
          <Col xs={12} sm={8} lg={6} key={card.key}>
            <Card className={styles.quickCard} onClick={card.onClick}>
              <div className={styles.quickCardIcon}>{card.icon}</div>
              <Text className={styles.quickCardTitle}>{card.title}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== Établissements proches ===== */}
      <div id="proches-section" className={styles.section}>
        <div className={styles.sectionHeader}>
          <Title level={4} className={styles.sectionTitle}>
            <EnvironmentOutlined /> Établissements proches
          </Title>
          <Button icon={<AimOutlined />} loading={isLocating} onClick={requestLocation}>
            {coords ? 'Actualiser ma position' : 'Activer ma position'}
          </Button>
        </div>

        {geoError && <Alert type="warning" showIcon message={geoError} style={{ marginBottom: 16 }} />}

        {!coords && !geoError && (
          <Empty
            description="Activez votre position pour découvrir les établissements de santé les plus proches de vous."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        {coords && (isLoadingEtablissements || isLoadingLocalisations) && (
          <div className={styles.centerState}>
            <Spin size="large" tip="Chargement..." />
          </div>
        )}

        {coords && !isLoadingEtablissements && !isLoadingLocalisations && etablissementsProches.length === 0 && (
          <Empty description="Aucun établissement à proximité pour le moment." />
        )}

        {coords && etablissementsProches.length > 0 && (
          <Row gutter={[16, 16]}>
            {etablissementsProches.map(({ etablissement, localisation, distanceKm }) => (
              <Col xs={24} sm={12} lg={8} key={etablissement.id}>
                <Card className={styles.card}>
                  <div className={styles.cardHeader}>
                    <Title level={5} style={{ marginBottom: 0 }}>
                      <BankOutlined /> {etablissement.nom}
                    </Title>
                    <Tag color="blue">{distanceKm.toFixed(1)} km</Tag>
                  </div>
                  <Text type="secondary">{etablissement.typeEtablissementNom}</Text>
                  <div className={styles.infoRow}>
                    <EnvironmentOutlined />
                    <span>
                      {localisation.ville}
                      {localisation.quartier ? `, ${localisation.quartier}` : ''}
                    </span>
                  </div>
                  <Button
                    type="link"
                    className={styles.cardLink}
                    onClick={() => goToSearch(etablissement.nom, undefined, etablissement.id)}
                  >
                    Voir les détails <RightOutlined />
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* ===== Services médicaux ===== */}
      <div id="services-section" className={styles.section}>
        <div className={styles.sectionHeader}>
          <Title level={4} className={styles.sectionTitle}>
            <MedicineBoxOutlined /> Services médicaux
          </Title>
          <Button type="link" onClick={() => navigate(ROUTES.SERVICES_SEARCH)}>
            Voir tous les services <RightOutlined />
          </Button>
        </div>

        {isErrorServices && (
          <Alert
            type="error"
            showIcon
            message="Impossible de récupérer les services médicaux."
            action={<a onClick={() => refetchServices()} role="button">Réessayer</a>}
            style={{ marginBottom: 16 }}
          />
        )}

        {isLoadingServices && (
          <Row gutter={[16, 16]}>
            {[1, 2, 3].map((i) => (
              <Col xs={24} sm={12} lg={8} key={i}>
                <Card><Skeleton active paragraph={{ rows: 2 }} /></Card>
              </Col>
            ))}
          </Row>
        )}

        {!isLoadingServices && !isErrorServices && servicesActifs.length === 0 && (
          <Empty description="Aucun service médical disponible pour le moment." />
        )}

        {!isLoadingServices && !isErrorServices && servicesActifs.length > 0 && (
          <Row gutter={[16, 16]}>
            {servicesActifs.slice(0, 6).map((service) => (
              <Col xs={24} sm={12} lg={8} key={service.id}>
                <Card className={styles.card}>
                  <Title level={5} style={{ marginBottom: 4 }}>
                    <MedicineBoxOutlined /> {service.nom}
                  </Title>
                  <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                    {service.description || 'Aucune description disponible.'}
                  </Paragraph>
                  <Button type="link" className={styles.cardLink} onClick={() => navigate(ROUTES.SERVICES_SEARCH)}>
                    Voir plus <RightOutlined />
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* ===== Spécialités médicales ===== */}
      <div id="specialites-section" className={styles.section}>
        <div className={styles.sectionHeader}>
          <Title level={4} className={styles.sectionTitle}>
            <ExperimentOutlined /> Spécialités médicales
          </Title>
        </div>

        {isErrorSpecialites && (
          <Alert
            type="error"
            showIcon
            message="Impossible de récupérer les spécialités médicales."
            action={<a onClick={() => refetchSpecialites()} role="button">Réessayer</a>}
            style={{ marginBottom: 16 }}
          />
        )}

        {isLoadingSpecialites && <Skeleton active paragraph={{ rows: 1 }} />}

        {!isLoadingSpecialites && !isErrorSpecialites && specialitesActives.length === 0 && (
          <Empty description="Aucune spécialité médicale disponible pour le moment." />
        )}

        {!isLoadingSpecialites && !isErrorSpecialites && specialitesActives.length > 0 && (
          <div className={styles.chipsRow}>
            {specialitesActives.map((specialite) => (
              <Tag
                key={specialite.id}
                className={styles.specialiteChip}
                onClick={() => goToSearch(undefined, specialite.id)}
              >
                {specialite.nom}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* ===== Conseils de santé ===== */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Title level={4} className={styles.sectionTitle}>
            <BulbOutlined /> Conseils de santé
          </Title>
          <Button type="link" onClick={() => navigate(ROUTES.HEALTH_ADVICE)}>
            Voir tous les conseils <RightOutlined />
          </Button>
        </div>

        {isErrorConseils && (
          <Alert
            type="error"
            showIcon
            message="Impossible de récupérer les conseils de santé."
            action={<a onClick={() => refetchConseils()} role="button">Réessayer</a>}
            style={{ marginBottom: 16 }}
          />
        )}

        {isLoadingConseils && (
          <Row gutter={[16, 16]}>
            {[1, 2, 3].map((i) => (
              <Col xs={24} sm={12} lg={8} key={i}>
                <Card><Skeleton active paragraph={{ rows: 3 }} /></Card>
              </Col>
            ))}
          </Row>
        )}

        {!isLoadingConseils && !isErrorConseils && dernieresConseils.length === 0 && (
          <Empty description="Aucun conseil de santé publié pour le moment." />
        )}

        {!isLoadingConseils && !isErrorConseils && dernieresConseils.length > 0 && (
          <Row gutter={[16, 16]}>
            {dernieresConseils.map((conseil) => (
              <Col xs={24} sm={12} lg={6} key={conseil.id}>
                <Card className={styles.card}>
                  <div className={styles.cardHeader}>
                    <Title level={5} style={{ marginBottom: 4 }}>
                      <BulbOutlined /> {conseil.titre}
                    </Title>
                    {conseil.pdfUrl && (
                      <Tag icon={<FilePdfOutlined />} color="red">
                        PDF
                      </Tag>
                    )}
                  </div>
                  {conseil.categorie && (
                    <Tag color="blue" style={{ marginBottom: 8 }}>
                      {CATEGORIE_CONSEIL_LABELS[conseil.categorie]}
                    </Tag>
                  )}
                  {conseil.contenu && (
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                      {conseil.contenu}
                    </Paragraph>
                  )}
                  <div className={styles.infoRow}>
                    <CalendarOutlined />
                    <span>{formatDate(conseil.dateCreation)}</span>
                  </div>
                  <Button
                    type="link"
                    className={styles.cardLink}
                    onClick={() => navigate(`${ROUTES.HEALTH_ADVICE}/${conseil.id}`)}
                  >
                    Lire <RightOutlined />
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* ===== Poser une question ===== */}
      <Card className={styles.questionCta}>
        <QuestionCircleOutlined className={styles.questionCtaIcon} />
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            Vous avez une question sur votre santé ?
          </Title>
          <Text type="secondary">
            Parcourez notre questionnaire d'orientation médicale pour être guidé vers les bons soins.
          </Text>
        </div>
        <Button type="primary" size="large" onClick={() => navigate(ROUTES.MEDICAL_ORIENTATION)}>
          Poser une question
        </Button>
      </Card>

      {/* ===== Numéros d'urgence ===== */}
      <div id="urgence-section" className={styles.section}>
        <div className={styles.sectionHeader}>
          <Title level={4} className={styles.sectionTitle}>
            <PhoneOutlined /> Numéros d'urgence
          </Title>
        </div>

        {isErrorNumeros && (
          <Alert
            type="error"
            showIcon
            message="Impossible de récupérer les numéros d'urgence."
            action={<a onClick={() => refetchNumeros()} role="button">Réessayer</a>}
            style={{ marginBottom: 16 }}
          />
        )}

        {isLoadingNumeros && <Skeleton active paragraph={{ rows: 2 }} />}

        {!isLoadingNumeros && !isErrorNumeros && (numeros ?? []).length === 0 && (
          <Empty description="Aucun numéro d'urgence disponible pour le moment." />
        )}

        {!isLoadingNumeros && !isErrorNumeros && (numeros ?? []).length > 0 && (
          <Row gutter={[16, 16]}>
            {(numeros ?? []).map((numero) => (
              <Col xs={24} sm={12} lg={8} key={numero.id}>
                <Card className={styles.urgenceCard}>
                  <div>
                    <Text strong className={styles.urgenceNom}>
                      {numero.nom}
                    </Text>
                    <Title level={3} className={styles.urgenceNumero}>
                      {numero.numero}
                    </Title>
                    {numero.description && <Text type="secondary">{numero.description}</Text>}
                  </div>
                  <a href={`tel:${numero.numero.replace(/[^\d+]/g, '')}`} className={styles.urgenceCallButton}>
                    <PhoneOutlined /> Appeler
                  </a>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {isErrorEtablissements && (
        <Alert
          type="error"
          showIcon
          message="Impossible de récupérer les établissements de santé."
          action={<a onClick={() => refetchEtablissements()} role="button">Réessayer</a>}
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  )
}

export default UserHome