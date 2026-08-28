import { Alert, Card, Col, Empty, Row, Skeleton, Typography } from 'antd'
import { BankOutlined, PhoneOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components'
import { useNumerosUrgenceQuery } from '@/hooks/useNumeroUrgence'
import styles from './UserEmergency.module.scss'

const { Title, Text } = Typography

/**
 * Urgences (espace UTILISATEUR) - réutilise intégralement le hook/service/
 * repository NumeroUrgence déjà existants (GET /api/numeros-urgence, la même
 * source déjà utilisée par la section "Numéros d'urgence" de l'Accueil et par
 * la gestion ADMIN). Aucun nouveau système, aucune donnée inventée : nom/
 * numero/description/etablissementNom sont les champs réels de
 * NumeroUrgenceResponse - etablissementNom n'est affiché que lorsque le
 * numéro est réellement rattaché à un EtablissementSante (relation optionnelle,
 * jamais de "Médecin").
 *
 * Design volontairement différent des pages CRUD habituelles : gros numéros,
 * un seul bouton d'action par carte, rien de superflu - un utilisateur en
 * situation d'urgence doit pouvoir composer un numéro en un coup d'œil.
 */
function UserEmergency() {
  const { data: numeros, isLoading, isError, refetch } = useNumerosUrgenceQuery()

  return (
    <div>
      <PageHeader
        title="Numéros d'urgence"
        subtitle="En cas d'urgence, appelez directement l'un des numéros ci-dessous."
      />

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Impossible de récupérer les numéros d'urgence."
          description="Vérifiez votre connexion et réessayez."
          action={
            <a onClick={() => refetch()} role="button">
              Réessayer
            </a>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      {isLoading && (
        <Row gutter={[16, 16]}>
          {[1, 2, 3].map((i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <Card className={styles.card}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!isLoading && !isError && (numeros ?? []).length === 0 && (
        <Empty description="Aucun numéro d'urgence disponible." />
      )}

      {!isLoading && !isError && (numeros ?? []).length > 0 && (
        <Row gutter={[16, 16]}>
          {(numeros ?? []).map((numero) => (
            <Col xs={24} sm={12} lg={8} key={numero.id}>
              <Card className={styles.card}>
                <div className={styles.iconBadge}>
                  <PhoneOutlined />
                </div>

                <Text className={styles.nom}>{numero.nom}</Text>
                <Title level={1} className={styles.numero}>
                  {numero.numero}
                </Title>

                {numero.description && <Text className={styles.description}>{numero.description}</Text>}

                {numero.etablissementNom && (
                  <div className={styles.etablissementRow}>
                    <BankOutlined /> {numero.etablissementNom}
                  </div>
                )}

                <a href={`tel:${numero.numero.replace(/[^\d+]/g, '')}`} className={styles.callButton}>
                  <PhoneOutlined /> Appeler
                </a>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default UserEmergency