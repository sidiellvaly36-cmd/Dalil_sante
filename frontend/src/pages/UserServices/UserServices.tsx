import { useMemo, useState } from 'react'
import { Alert, Card, Col, Empty, Input, Row, Spin, Tag, Typography } from 'antd'
import { MedicineBoxOutlined, SearchOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components'
import { useServicesMedicauxQuery } from '@/hooks/useServicesMedicaux'
import { useEtablissementsQuery } from '@/hooks/useEtablissements'
import styles from './UserServices.module.scss'

const { Title, Text } = Typography

/**
 * Services médicaux (espace UTILISATEUR) - parcourt les services médicaux réels
 * (GET /api/services-medicaux) et, pour chaque service, calcule côté client la
 * liste des établissements qui le proposent en croisant avec
 * EtablissementSante.services (déjà inclus dans GET /api/etablissements) - le
 * Backend n'a pas d'endpoint dédié "établissements par service".
 */
function UserServices() {
  const { data: services, isLoading: isLoadingServices, isError: isErrorServices } = useServicesMedicauxQuery()
  const { data: etablissements, isLoading: isLoadingEtablissements, isError: isErrorEtablissements } =
    useEtablissementsQuery()
  const [search, setSearch] = useState('')

  const isLoading = isLoadingServices || isLoadingEtablissements
  const isError = isErrorServices || isErrorEtablissements

  const filteredServices = useMemo(() => {
    const actifs = (services ?? []).filter((service) => service.actif)

    if (!search.trim()) return actifs

    const term = search.trim().toLowerCase()
    return actifs.filter((service) => service.nom.toLowerCase().includes(term))
  }, [services, search])

  const etablissementsByService = useMemo(() => {
    const map = new Map<number, string[]>()

    for (const etablissement of etablissements ?? []) {
      if (!etablissement.actif) continue

      for (const service of etablissement.services) {
        const list = map.get(service.id) ?? []
        list.push(etablissement.nom)
        map.set(service.id, list)
      }
    }

    return map
  }, [etablissements])

  return (
    <div>
      <PageHeader
        title="Services médicaux"
        subtitle="Parcourez les services médicaux disponibles et les établissements qui les proposent."
      />

      <Input
        allowClear
        className={styles.searchInput}
        prefix={<SearchOutlined />}
        placeholder="Rechercher un service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Erreur de chargement"
          description="Impossible de récupérer les services médicaux depuis le serveur."
          style={{ marginBottom: 16 }}
        />
      )}

      {isLoading && (
        <div className={styles.centerState}>
          <Spin size="large" tip="Chargement..." />
        </div>
      )}

      {!isLoading && !isError && filteredServices.length === 0 && (
        <Empty description="Aucun service médical trouvé." />
      )}

      {!isLoading && !isError && filteredServices.length > 0 && (
        <Row gutter={[16, 16]}>
          {filteredServices.map((service) => {
            const etablissementNames = etablissementsByService.get(service.id) ?? []

            return (
              <Col xs={24} sm={12} lg={8} key={service.id}>
                <Card className={styles.card}>
                  <Title level={5} style={{ marginBottom: 4 }}>
                    <MedicineBoxOutlined /> {service.nom}
                  </Title>
                  <Text type="secondary">{service.description || 'Aucune description disponible.'}</Text>

                  <div className={styles.etablissementsList}>
                    <span className={styles.etablissementsTitle}>
                      Disponible dans {etablissementNames.length} établissement(s)
                    </span>
                    {etablissementNames.length > 0 ? (
                      etablissementNames.map((nom) => (
                        <Tag key={nom} style={{ marginBottom: 4 }}>
                          {nom}
                        </Tag>
                      ))
                    ) : (
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        Aucun établissement ne propose ce service pour le moment.
                      </Text>
                    )}
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      )}
    </div>
  )
}

export default UserServices