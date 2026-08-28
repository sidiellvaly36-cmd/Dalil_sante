import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Alert, Button, Card, Col, Empty, Input, Row, Select, Spin, Tag, Typography } from 'antd'
import {
  AimOutlined,
  BankOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { PageHeader, EtablissementMap } from '@/components'
import type { EtablissementMapMarker } from '@/components'
import { useEtablissementsQuery, useTypesEtablissementQuery } from '@/hooks/useEtablissements'
import { useSpecialitesQuery } from '@/hooks/useSpecialites'
import { useServicesMedicauxQuery } from '@/hooks/useServicesMedicaux'
import { useLocalisationsQuery } from '@/hooks/useLocalisations'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useLogRecherche } from '@/hooks/useStatistiqueRecherche'
import { haversineDistanceKm } from '@/utils'
import type { EtablissementSante, Localisation } from '@/types'
import styles from './UserSearch.module.scss'

const { Title, Text } = Typography

interface EtablissementResult extends EtablissementSante {
  localisation?: Localisation
  distanceKm?: number
}

/**
 * Recherche (espace UTILISATEUR) - couvre à la fois "trouver un
 * médecin/spécialiste proche" et "rechercher un établissement de santé" :
 * le Backend n'a aucune entité "Médecin" exploitable (Utilisateur a bien des
 * relations @ManyToMany vers EtablissementSante/SpecialiteMedicale/ServiceMedical,
 * mais UtilisateurController est entièrement réservé à ADMIN et UtilisateurResponse
 * n'expose aucune de ces relations - vérifié en profondeur), donc "médecin
 * proche" est traduit honnêtement en "établissement de santé filtré par
 * spécialité/service + proximité". La carte affiche donc uniquement des
 * établissements (jamais de "médecin") - chaque marqueur = un
 * EtablissementSante réel avec sa Localisation réelle.
 * Recherche/filtres/tri par distance = 100% calculés côté client sur les
 * données réelles déjà chargées (GET /api/etablissements, /api/localisations,
 * /api/specialites-medicales, /api/services-medicaux, /api/types-etablissement) ;
 * le Backend ne calcule aucune distance et n'a pas d'endpoint de recherche
 * dédié à cela.
 *
 * Priorité "établissement le plus proche" : la géolocalisation est demandée
 * automatiquement à l'ouverture de la page (une seule fois), la liste est
 * triée du plus proche au plus loin dès que la position est connue, et la
 * carte se recentre automatiquement sur le plus proche résultat - sauf si
 * l'utilisateur arrive ici via un lien profond ciblant un établissement précis
 * (ex. "Voir les détails" depuis l'Accueil), auquel cas ce choix explicite est
 * respecté et n'est jamais écrasé par l'auto-focus.
 */
function UserSearch() {
  const { data: etablissements, isLoading: isLoadingEtablissements, isError: isErrorEtablissements } =
    useEtablissementsQuery()
  const { data: types } = useTypesEtablissementQuery()
  const { data: specialites } = useSpecialitesQuery()
  const { data: services } = useServicesMedicauxQuery()
  const { data: localisations } = useLocalisationsQuery()
  const { coords, isLocating, error: geoError, requestLocation } = useGeolocation()
  const logRecherche = useLogRecherche()

  const [searchParams] = useSearchParams()
  const initialSpecialiteId = searchParams.get('specialiteId')
  const initialEtablissementId = searchParams.get('etablissementId')

  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [typeId, setTypeId] = useState<number | undefined>(undefined)
  const [specialiteId, setSpecialiteId] = useState<number | undefined>(
    initialSpecialiteId ? Number(initialSpecialiteId) : undefined,
  )
  const [serviceId, setServiceId] = useState<number | undefined>(undefined)
  const [focusedId, setFocusedId] = useState<number | null>(
    initialEtablissementId ? Number(initialEtablissementId) : null,
  )
  const mapSectionRef = useRef<HTMLDivElement>(null)
  const hasAutoFocusedNearest = useRef(false)

  const isLoading = isLoadingEtablissements
  const isError = isErrorEtablissements

  // Demande la position réelle du navigateur automatiquement à l'ouverture de
  // la page (une seule fois) pour prioriser "le plus proche en premier" sans
  // attendre un clic - si l'utilisateur refuse, geoError est renseigné et la
  // liste reste affichée sans tri géographique (jamais de position simulée).
  useEffect(() => {
    requestLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const results = useMemo<EtablissementResult[]>(() => {
    let items = (etablissements ?? []).filter((etablissement) => etablissement.actif)

    if (search.trim()) {
      const term = search.trim().toLowerCase()
      items = items.filter((etablissement) => etablissement.nom.toLowerCase().includes(term))
    }

    if (typeId) {
      items = items.filter((etablissement) => etablissement.typeEtablissementId === typeId)
    }

    if (specialiteId) {
      items = items.filter((etablissement) =>
        etablissement.specialites.some((specialite) => specialite.id === specialiteId),
      )
    }

    if (serviceId) {
      items = items.filter((etablissement) => etablissement.services.some((service) => service.id === serviceId))
    }

    const withLocation: EtablissementResult[] = items.map((etablissement) => {
      const localisation = localisations?.find((loc) => loc.etablissementId === etablissement.id)

      if (coords && localisation) {
        const distanceKm = haversineDistanceKm(
          coords.latitude,
          coords.longitude,
          localisation.latitude,
          localisation.longitude,
        )
        return { ...etablissement, localisation, distanceKm }
      }

      return { ...etablissement, localisation }
    })

    if (coords) {
      return withLocation.sort((a, b) => {
        if (a.distanceKm === undefined) return 1
        if (b.distanceKm === undefined) return -1
        return a.distanceKm - b.distanceKm
      })
    }

    return withLocation.sort((a, b) => a.nom.localeCompare(b.nom))
  }, [etablissements, search, typeId, specialiteId, serviceId, localisations, coords])

  const mapMarkers = useMemo<EtablissementMapMarker[]>(
    () =>
      results
        .filter((r): r is EtablissementResult & { localisation: Localisation } => Boolean(r.localisation))
        .map((r) => ({
          id: r.id,
          nom: r.nom,
          typeNom: r.typeEtablissementNom,
          adresse: r.localisation.adresse,
          ville: r.localisation.ville,
          quartier: r.localisation.quartier,
          telephone: r.telephone,
          latitude: r.localisation.latitude,
          longitude: r.localisation.longitude,
          distanceKm: r.distanceKm,
        })),
    [results],
  )

  // results est déjà trié du plus proche au plus loin dès que coords existe
  // (les établissements sans localisation sont poussés en fin de liste) - le
  // premier élément avec une distance réelle est donc l'établissement le plus
  // proche parmi les résultats actuellement affichés (recherche/filtres inclus).
  const nearestId = coords && results.length > 0 && results[0].distanceKm !== undefined ? results[0].id : null

  // Recentre automatiquement la carte sur l'établissement le plus proche dès
  // que la position est connue - une seule fois, et jamais si l'utilisateur
  // est arrivé via un lien profond ciblant déjà un établissement précis.
  useEffect(() => {
    if (hasAutoFocusedNearest.current) return
    if (initialEtablissementId) {
      hasAutoFocusedNearest.current = true
      return
    }
    if (nearestId !== null) {
      setFocusedId(nearestId)
      hasAutoFocusedNearest.current = true
    }
  }, [nearestId, initialEtablissementId])

  // Journalisation des recherches réellement exécutées uniquement (jamais à
  // chaque frappe clavier) : Entrée sur le champ texte = recherche
  // d'établissement soumise ; sélection d'un filtre = recherche par
  // spécialité/service/type exécutée. Effacer un filtre (allowClear) ne
  // déclenche jamais de journalisation.
  const handleSearchSubmit = () => {
    const term = search.trim()
    if (term) {
      logRecherche.mutate({ type: 'ETABLISSEMENT', query: term })
    }
  }

  const handleTypeChange = (value?: number) => {
    setTypeId(value)
    const nom = types?.find((type) => type.id === value)?.nom
    if (value && nom) {
      logRecherche.mutate({ type: 'TYPE_ETABLISSEMENT', query: nom })
    }
  }

  const handleSpecialiteChange = (value?: number) => {
    setSpecialiteId(value)
    const nom = specialites?.find((specialite) => specialite.id === value)?.nom
    if (value && nom) {
      logRecherche.mutate({ type: 'SPECIALITE', query: nom })
    }
  }

  const handleServiceChange = (value?: number) => {
    setServiceId(value)
    const nom = services?.find((service) => service.id === value)?.nom
    if (value && nom) {
      logRecherche.mutate({ type: 'SERVICE', query: nom })
    }
  }

  const handleVoirEmplacement = (id: number) => {
    setFocusedId(id)
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const directionsUrl = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <div>
      <PageHeader
        title="Recherche"
        subtitle="Trouvez un établissement de santé ou un spécialiste par nom, type, spécialité, service ou proximité."
      />

      <div className={styles.filters}>
        <Input
          allowClear
          className={styles.searchInput}
          prefix={<SearchOutlined />}
          placeholder="Rechercher par nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={handleSearchSubmit}
        />
        <Select
          allowClear
          className={styles.typeSelect}
          placeholder="Type d'établissement"
          value={typeId}
          onChange={handleTypeChange}
          options={types?.map((type) => ({ value: type.id, label: type.nom }))}
        />
        <Select
          allowClear
          className={styles.specialiteSelect}
          placeholder="Spécialité médicale"
          value={specialiteId}
          onChange={handleSpecialiteChange}
          options={specialites?.map((specialite) => ({ value: specialite.id, label: specialite.nom }))}
        />
        <Select
          allowClear
          className={styles.specialiteSelect}
          placeholder="Service médical"
          value={serviceId}
          onChange={handleServiceChange}
          options={services?.map((service) => ({ value: service.id, label: service.nom }))}
        />
        <Button icon={<AimOutlined />} loading={isLocating} onClick={requestLocation}>
          {coords ? 'Position activée' : 'Trier par proximité'}
        </Button>
      </div>

      {geoError && (
        <Alert
          type="warning"
          showIcon
          message="Activez votre localisation pour trouver les établissements de santé les plus proches de vous."
          description="Les établissements sont affichés ci-dessous sans tri géographique."
          style={{ marginBottom: 16 }}
        />
      )}

      {isLocating && (
        <Alert
          type="info"
          showIcon
          message="Localisation en cours..."
          style={{ marginBottom: 16 }}
        />
      )}

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Erreur de chargement"
          description="Impossible de récupérer les établissements depuis le serveur."
          style={{ marginBottom: 16 }}
        />
      )}

      {isLoading && (
        <div className={styles.centerState}>
          <Spin size="large" tip="Chargement..." />
        </div>
      )}

      {!isLoading && !isError && results.length === 0 && (
        <Empty description="Aucun établissement ne correspond à votre recherche." />
      )}

      {!isLoading && !isError && results.length > 0 && (
        <div className={styles.layout}>
          <div className={styles.resultsColumn}>
            <Row gutter={[16, 16]}>
              {results.map((etablissement) => (
                <Col xs={24} lg={12} key={etablissement.id}>
                  <Card className={`${styles.card} ${etablissement.id === nearestId ? styles.nearestCard : ''}`}>
                    {etablissement.id === nearestId && (
                      <Tag color="green" icon={<CompassOutlined />} className={styles.nearestTag}>
                        Le plus proche
                      </Tag>
                    )}
                    <div className={styles.cardHeader}>
                      <div>
                        <Title level={5} style={{ marginBottom: 0 }}>
                          <BankOutlined /> {etablissement.nom}
                        </Title>
                        <Text type="secondary">{etablissement.typeEtablissementNom}</Text>
                      </div>
                      {etablissement.distanceKm !== undefined && (
                        <Tag color="blue" className={styles.distanceTag}>
                          {etablissement.distanceKm.toFixed(1)} km
                        </Tag>
                      )}
                    </div>

                    {etablissement.localisation && (
                      <div className={styles.infoRow}>
                        <EnvironmentOutlined />
                        <span>
                          {etablissement.localisation.ville}
                          {etablissement.localisation.quartier ? `, ${etablissement.localisation.quartier}` : ''}
                        </span>
                      </div>
                    )}

                    {etablissement.telephone && (
                      <div className={styles.infoRow}>
                        <PhoneOutlined />
                        <span>{etablissement.telephone}</span>
                      </div>
                    )}

                    {etablissement.ouvert24h && (
                      <Tag color="green" style={{ marginTop: 8 }}>
                        Ouvert 24h/24
                      </Tag>
                    )}

                    {etablissement.specialites.length > 0 && (
                      <div className={styles.tagsRow}>
                        {etablissement.specialites.map((specialite) => (
                          <Tag key={specialite.id}>{specialite.nom}</Tag>
                        ))}
                      </div>
                    )}

                    {etablissement.localisation ? (
                      <div className={styles.cardActions}>
                        <Button
                          type="link"
                          className={styles.locationLink}
                          icon={<EnvironmentOutlined />}
                          onClick={() => handleVoirEmplacement(etablissement.id)}
                        >
                          Voir sur la carte
                        </Button>
                        <Button
                          type="link"
                          className={styles.locationLink}
                          icon={<CompassOutlined />}
                          href={directionsUrl(etablissement.localisation.latitude, etablissement.localisation.longitude)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Itinéraire
                        </Button>
                      </div>
                    ) : (
                      <Text type="secondary" className={styles.noLocationText}>
                        Localisation non disponible
                      </Text>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <div className={styles.mapColumn} ref={mapSectionRef}>
            <div className={styles.mapHeader}>
              <MedicineBoxOutlined /> <Text strong>Carte des établissements</Text>
            </div>
            {mapMarkers.length > 0 ? (
              <EtablissementMap
                markers={mapMarkers}
                userCoords={coords}
                focusedId={focusedId}
                nearestId={nearestId}
                onMarkerSelect={setFocusedId}
              />
            ) : (
              <Empty
                description="Aucun établissement localisé parmi les résultats actuels."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserSearch