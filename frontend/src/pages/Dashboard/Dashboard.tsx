import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  List,
  Result,
  Row,
  Segmented,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import {
  ApartmentOutlined,
  BankOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader, StatCard, StatusTag } from '@/components'
import { useAuthStore } from '@/store/authStore'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useStatistiqueRechercheQuery } from '@/hooks/useStatistiqueRecherche'
import { ROLE_COLORS, ROLE_LABELS } from '@/constants'
import { formatDateTime } from '@/utils'
import type { RechercheFrequenteItem, TrendPeriod, TypeRecherche } from '@/types'
import { TYPE_RECHERCHE_LABELS } from '@/types'
import styles from './Dashboard.module.scss'

const { Text } = Typography

const TREND_OPTIONS: { label: string; value: TrendPeriod }[] = [
  { label: 'Jour', value: 'day' },
  { label: 'Mois', value: 'month' },
  { label: 'Année', value: 'year' },
]

const ROLE_CHART_COLORS: Record<string, string> = {
  ADMIN: '#faad14',
  UTILISATEUR: '#1677ff',
}

const TYPE_RECHERCHE_COLORS: Record<TypeRecherche, string> = {
  ETABLISSEMENT: '#1677ff',
  SPECIALITE: '#52c41a',
  SERVICE: '#722ed1',
  TYPE_ETABLISSEMENT: '#fa8c16',
}

const RECHERCHE_FREQUENTES_COLUMNS = [
  { title: 'Recherche', dataIndex: 'query', key: 'query' },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (type: TypeRecherche) => <Tag color={TYPE_RECHERCHE_COLORS[type]}>{TYPE_RECHERCHE_LABELS[type]}</Tag>,
  },
  { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
]

/**
 * Dashboard - lوحة تحكم إحصائية حقيقية للمسؤول.
 * -------------------------------------------------
 * كل رقم ورسم هنا محسوب من بيانات حقيقية قادمة من الـ Backend (لا Mock Data).
 * لا يوجد endpoint إحصائي مخصص في الـ Backend حاليًا، لذلك يتم التجميع من
 * نقاط GET الموجودة فعليًا عبر useDashboardStats. بعض المطالب (تصفية زمنية
 * لغير المستخدمين، مقارنة بالفترة السابقة، سجل الأنشطة) غير مُطبَّقة عمدًا
 * لأن الـ Backend لا يملك حاليًا أي حقل تاريخ إنشاء أو سجل تدقيق يسمح بها
 * ببيانات حقيقية - راجع تقرير التحليل المُقدَّم قبل هذه المرحلة.
 */
function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>('month')
  const { stats, registrationTrend, isLoading, isFetching, isError, isEmpty, refetchAll } =
    useDashboardStats(trendPeriod)

  const [rechercheTrendPeriod, setRechercheTrendPeriod] = useState<TrendPeriod>('month')
  const {
    data: statsRecherche,
    isLoading: isLoadingStatsRecherche,
    isFetching: isFetchingStatsRecherche,
    isError: isErrorStatsRecherche,
    refetch: refetchStatsRecherche,
  } = useStatistiqueRechercheQuery()

  const isEmptyStatsRecherche =
    !isLoadingStatsRecherche && !isErrorStatsRecherche && statsRecherche?.totalRecherches === 0

  const evolutionRecherche = useMemo(() => {
    if (!statsRecherche) return []
    if (rechercheTrendPeriod === 'day') return statsRecherche.evolutionParJour
    if (rechercheTrendPeriod === 'month') return statsRecherche.evolutionParMois
    return statsRecherche.evolutionParAnnee
  }, [statsRecherche, rechercheTrendPeriod])

  if (user && user.role !== 'ADMIN') {
    return (
      <Result
        status="403"
        title="Accès refusé"
        subTitle="Cette page est réservée aux administrateurs de la plateforme."
      />
    )
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <PageHeader
        title="Tableau de bord"
        subtitle={`Bienvenue, ${user?.fullName ?? ''} — vue d'ensemble en temps réel de la plateforme.`}
        extra={
          <Button
            icon={<ReloadOutlined />}
            loading={isFetching || isFetchingStatsRecherche}
            onClick={() => {
              refetchAll()
              refetchStatsRecherche()
            }}
          >
            Actualiser
          </Button>
        }
      />

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Erreur de chargement"
          description="Impossible de récupérer les statistiques depuis le serveur. Vérifiez votre connexion et réessayez."
          action={
            <Button size="small" danger onClick={refetchAll}>
              Réessayer
            </Button>
          }
        />
      )}

      {isLoading && (
        <div className={styles.centerState}>
          <Spin size="large" tip="Chargement des statistiques..." />
        </div>
      )}

      {!isLoading && !isError && isEmpty && <Empty description="Aucune donnée disponible pour le moment." />}

      {!isLoading && !isError && stats && (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <StatCard
                title="Total utilisateurs"
                value={stats.utilisateurs.total}
                icon={<TeamOutlined />}
                color="#1677ff"
                footer={
                  <Text>
                    {stats.utilisateurs.actifs} actifs · {stats.utilisateurs.inactifs} inactifs
                  </Text>
                }
              />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <StatCard
                title="Administrateurs"
                value={stats.admins}
                icon={<SafetyCertificateOutlined />}
                color="#faad14"
              />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <StatCard title="Utilisateurs (rôle)" value={stats.utilisateursRole} icon={<UserOutlined />} color="#13c2c2" />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <StatCard
                title="Établissements de santé"
                value={stats.etablissements.total}
                icon={<BankOutlined />}
                color="#52c41a"
                footer={
                  <Text>
                    {stats.etablissements.actifs} actifs · {stats.etablissements.inactifs} inactifs
                  </Text>
                }
              />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <StatCard
                title="Services médicaux"
                value={stats.servicesMedicaux.total}
                icon={<MedicineBoxOutlined />}
                color="#722ed1"
                footer={
                  <Text>
                    {stats.servicesMedicaux.actifs} actifs · {stats.servicesMedicaux.inactifs} inactifs
                  </Text>
                }
              />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <StatCard
                title="Spécialités médicales"
                value={stats.specialites.total}
                icon={<ApartmentOutlined />}
                color="#eb2f96"
                footer={
                  <Text>
                    {stats.specialites.actifs} actives · {stats.specialites.inactifs} inactives
                  </Text>
                }
              />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <StatCard title="Numéros d'urgence" value={stats.numerosUrgence} icon={<PhoneOutlined />} color="#ff4d4f" />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={10}>
              <Card title="Répartition des utilisateurs par rôle" className={styles.chartCard}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats.roleDistribution}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {stats.roleDistribution.map((entry) => (
                        <Cell key={entry.role} fill={ROLE_CHART_COLORS[entry.role]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} lg={14}>
              <Card
                title="Évolution des inscriptions"
                extra={
                  <Segmented
                    options={TREND_OPTIONS}
                    value={trendPeriod}
                    onChange={(value) => setTrendPeriod(value as TrendPeriod)}
                  />
                }
                className={styles.chartCard}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={registrationTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" name="Inscriptions" fill="#1677ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Derniers utilisateurs inscrits">
                <List
                  dataSource={stats.recentUtilisateurs}
                  locale={{ emptyText: 'Aucun utilisateur.' }}
                  renderItem={(item) => (
                    <List.Item extra={<Tag color={ROLE_COLORS[item.role]}>{ROLE_LABELS[item.role]}</Tag>}>
                      <List.Item.Meta
                        title={`${item.prenom} ${item.nom}`}
                        description={
                          <Space size={4} direction="vertical">
                            <Text type="secondary">{item.email}</Text>
                            <Text type="secondary">{formatDateTime(item.dateCreation)}</Text>
                          </Space>
                        }
                      />
                      <StatusTag actif={item.actif} />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Derniers éléments ajoutés">
                <Tabs
                  items={[
                    {
                      key: 'etablissements',
                      label: 'Établissements',
                      children: (
                        <List
                          dataSource={stats.recentEtablissements}
                          locale={{ emptyText: 'Aucun établissement.' }}
                          renderItem={(item) => (
                            <List.Item extra={<StatusTag actif={item.actif} />}>
                              <List.Item.Meta title={item.nom} description={item.typeEtablissementNom} />
                            </List.Item>
                          )}
                        />
                      ),
                    },
                    {
                      key: 'services',
                      label: 'Services',
                      children: (
                        <List
                          dataSource={stats.recentServicesMedicaux}
                          locale={{ emptyText: 'Aucun service.' }}
                          renderItem={(item) => (
                            <List.Item extra={<StatusTag actif={item.actif} />}>
                              <List.Item.Meta title={item.nom} description={item.description} />
                            </List.Item>
                          )}
                        />
                      ),
                    },
                    {
                      key: 'specialites',
                      label: 'Spécialités',
                      children: (
                        <List
                          dataSource={stats.recentSpecialites}
                          locale={{ emptyText: 'Aucune spécialité.' }}
                          renderItem={(item) => (
                            <List.Item extra={<StatusTag actif={item.actif} />}>
                              <List.Item.Meta title={item.nom} description={item.description} />
                            </List.Item>
                          )}
                        />
                      ),
                    },
                    {
                      key: 'urgence',
                      label: "Numéros d'urgence",
                      children: (
                        <List
                          dataSource={stats.recentNumerosUrgence}
                          locale={{ emptyText: 'Aucun numéro.' }}
                          renderItem={(item) => (
                            <List.Item>
                              <List.Item.Meta title={item.nom} description={item.numero} />
                            </List.Item>
                          )}
                        />
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}

      <div>
        <Typography.Title level={4} style={{ marginBottom: 16 }}>
          Statistiques de recherche
        </Typography.Title>

        {isErrorStatsRecherche && (
          <Alert
            type="error"
            showIcon
            message="Erreur de chargement"
            description="Impossible de récupérer les statistiques de recherche depuis le serveur. Vérifiez votre connexion et réessayez."
            action={
              <Button size="small" danger onClick={() => refetchStatsRecherche()}>
                Réessayer
              </Button>
            }
          />
        )}

        {isLoadingStatsRecherche && (
          <div className={styles.centerState}>
            <Spin size="large" tip="Chargement des statistiques de recherche..." />
          </div>
        )}

        {!isLoadingStatsRecherche && !isErrorStatsRecherche && isEmptyStatsRecherche && (
          <Empty description="Aucune recherche enregistrée." />
        )}

        {!isLoadingStatsRecherche && !isErrorStatsRecherche && statsRecherche && !isEmptyStatsRecherche && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Total recherches"
                  value={statsRecherche.totalRecherches}
                  icon={<SearchOutlined />}
                  color="#1677ff"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Aujourd'hui"
                  value={statsRecherche.recherchesAujourdHui}
                  icon={<SearchOutlined />}
                  color="#52c41a"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Ce mois"
                  value={statsRecherche.recherchesCeMois}
                  icon={<SearchOutlined />}
                  color="#722ed1"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Cette année"
                  value={statsRecherche.recherchesCetteAnnee}
                  icon={<SearchOutlined />}
                  color="#fa8c16"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={10}>
                <Card title="Répartition par type de recherche" className={styles.chartCard}>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={statsRecherche.repartitionParType.map((item) => ({
                          ...item,
                          label: TYPE_RECHERCHE_LABELS[item.type],
                        }))}
                        dataKey="nombre"
                        nameKey="label"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {statsRecherche.repartitionParType.map((entry) => (
                          <Cell key={entry.type} fill={TYPE_RECHERCHE_COLORS[entry.type]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col xs={24} lg={14}>
                <Card
                  title="Évolution des recherches"
                  extra={
                    <Segmented
                      options={TREND_OPTIONS}
                      value={rechercheTrendPeriod}
                      onChange={(value) => setRechercheTrendPeriod(value as TrendPeriod)}
                    />
                  }
                  className={styles.chartCard}
                >
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={evolutionRecherche}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="nombre" name="Recherches" fill="#1677ff" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Recherches les plus fréquentes">
                  <div className={styles.tableScrollWrapper}>
                    <Table<RechercheFrequenteItem>
                      dataSource={statsRecherche.recherchesFrequentes}
                      columns={RECHERCHE_FREQUENTES_COLUMNS}
                      rowKey={(item) => `${item.type}-${item.query}`}
                      pagination={false}
                      locale={{ emptyText: 'Aucune recherche enregistrée.' }}
                      scroll={{ x: 500 }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </Space>
        )}
      </div>
    </Space>
  )
}

export default Dashboard