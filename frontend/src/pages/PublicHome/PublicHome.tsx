import {
  ArrowRightOutlined,
  BookOutlined,
  EnvironmentOutlined,
  FileSearchOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import logoUrl from '@/assets/logo-dalil-sante-transparent.png'
import styles from './PublicHome.module.scss'

const { Title, Paragraph, Text } = Typography

interface ServiceCard {
  title: string
  description: string
  icon: React.ReactNode
  route: string
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    title: 'Rechercher un établissement',
    description:
      'Trouvez les établissements de santé disponibles et consultez leur localisation.',
    icon: <EnvironmentOutlined />,
    route: ROUTES.SEARCH,
  },
  {
    title: 'Services médicaux',
    description:
      'Découvrez les services médicaux disponibles et les établissements qui les proposent.',
    icon: <MedicineBoxOutlined />,
    route: ROUTES.SERVICES_SEARCH,
  },
  {
    title: 'Conseils de santé',
    description:
      'Consultez les conseils et informations de prévention publiés par la plateforme.',
    icon: <BookOutlined />,
    route: ROUTES.HEALTH_ADVICE,
  },
  {
    title: "Numéros d'urgence",
    description:
      "Accédez rapidement aux numéros d'urgence disponibles.",
    icon: <PhoneOutlined />,
    route: ROUTES.EMERGENCY,
  },
  {
    title: 'Orientation médicale',
    description:
      "Consultez les questions d'orientation médicale actuellement disponibles.",
    icon: <QuestionCircleOutlined />,
    route: ROUTES.MEDICAL_ORIENTATION,
  },
]

function PublicHome() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLogoWrapper}>
            <img
              src={logoUrl}
              alt="Dalil Sante"
              className={styles.heroLogo}
            />
          </div>

          <Text className={styles.eyebrow}>
            VOTRE GUIDE SANTÉ
          </Text>

          <Title className={styles.heroTitle}>
            Trouvez facilement les services de santé dont vous avez besoin.
          </Title>

          <Paragraph className={styles.heroDescription}>
            Dalil Sante vous permet de rechercher des établissements de santé,
            consulter leurs services, trouver leur localisation et accéder à
            des informations de santé utiles, sans obligation de créer un
            compte.
          </Paragraph>

          <Space
            size="middle"
            wrap
            className={styles.heroActions}
          >
            <Button
              type="primary"
              size="large"
              icon={<FileSearchOutlined />}
              onClick={() => navigate(ROUTES.SEARCH)}
            >
              Rechercher un établissement
            </Button>

            <Button
              size="large"
              icon={<UserAddOutlined />}
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              Créer un compte
            </Button>
          </Space>

          <Text className={styles.optionalText}>
            La création d’un compte est facultative pour consulter les
            services publics.
          </Text>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <Text className={styles.sectionEyebrow}>
            SERVICES PUBLICS
          </Text>

          <Title level={2} className={styles.sectionTitle}>
            Tout ce dont vous avez besoin, au même endroit
          </Title>

          <Paragraph className={styles.sectionDescription}>
            Explorez les informations disponibles sur les établissements et
            les services de santé.
          </Paragraph>
        </div>

        <Row gutter={[20, 20]}>
          {SERVICE_CARDS.map((service) => (
            <Col
              xs={24}
              sm={12}
              lg={8}
              key={service.route}
            >
              <Card
                hoverable
                className={styles.serviceCard}
                onClick={() => navigate(service.route)}
              >
                <div className={styles.serviceIcon}>
                  {service.icon}
                </div>

                <Title level={4} className={styles.serviceTitle}>
                  {service.title}
                </Title>

                <Paragraph className={styles.serviceDescription}>
                  {service.description}
                </Paragraph>

                <Button
                  type="link"
                  className={styles.serviceLink}
                  icon={<ArrowRightOutlined />}
                >
                  Accéder
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className={styles.accountSection}>
        <div className={styles.accountContent}>
          <div>
            <Title level={3} className={styles.accountTitle}>
              Vous souhaitez créer votre espace personnel ?
            </Title>

            <Paragraph className={styles.accountDescription}>
              La création d’un compte est facultative. Elle vous permet
              d’accéder à votre espace utilisateur et à vos informations
              personnelles.
            </Paragraph>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<UserAddOutlined />}
            onClick={() => navigate(ROUTES.REGISTER)}
          >
            Créer un compte
          </Button>
        </div>
      </section>
    </div>
  )
}

export default PublicHome