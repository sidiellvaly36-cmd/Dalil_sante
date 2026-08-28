import { useState } from 'react'
import {
  Avatar,
  Button,
  Drawer,
  Layout,
  Menu,
  Space,
  Typography,
} from 'antd'
import type { MenuProps } from 'antd'
import {
  AppstoreOutlined,
  BookOutlined,
  FileTextOutlined,
  LoginOutlined,
  MenuOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import logoUrl from '@/assets/logo-dalil-sante-transparent.png'
import styles from './PublicLayout.module.scss'
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher'

const { Header, Content, Footer } = Layout
const { Text } = Typography

interface PublicMenuItem {
  key: string
  route: string
  label: string
  icon: React.ReactNode
}

const PUBLIC_MENU_ITEMS: PublicMenuItem[] = [
  {
    key: 'home',
    route: ROUTES.PUBLIC_HOME,
    label: 'Accueil',
    icon: <AppstoreOutlined />,
  },
  {
    key: 'search',
    route: ROUTES.SEARCH,
    label: 'Recherche',
    icon: <SearchOutlined />,
  },
  {
    key: 'services',
    route: ROUTES.SERVICES_SEARCH,
    label: 'Services médicaux',
    icon: <FileTextOutlined />,
  },
  {
    key: 'advice',
    route: ROUTES.HEALTH_ADVICE,
    label: 'Conseils de santé',
    icon: <BookOutlined />,
  },
  {
    key: 'emergency',
    route: ROUTES.EMERGENCY_NUMBERS,
    label: "Numéros d'urgence",
    icon: <PhoneOutlined />,
  },
  {
    key: 'orientation',
    route: ROUTES.MEDICAL_ORIENTATION,
    label: 'Orientation médicale',
    icon: <QuestionCircleOutlined />,
  },
]

function PublicLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const selectedKey =
    PUBLIC_MENU_ITEMS.find((item) => {
      if (item.route === ROUTES.PUBLIC_HOME) {
        return location.pathname === item.route
      }

      return (
        location.pathname === item.route ||
        location.pathname.startsWith(`${item.route}/`)
      )
    })?.key ?? ''

  const handleNavigate = (route: string) => {
    navigate(route)
    setDrawerOpen(false)
  }

  const menuItems: MenuProps['items'] = PUBLIC_MENU_ITEMS.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }))

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const item = PUBLIC_MENU_ITEMS.find(
      (menuItem) => menuItem.key === key,
    )

    if (item) {
      handleNavigate(item.route)
    }
  }

  return (
    <Layout className={styles.layout}>
     <Header className={styles.header}>
  <div className={styles.leftSection}>
    <div
      className={styles.logo}
      onClick={() => handleNavigate(ROUTES.PUBLIC_HOME)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleNavigate(ROUTES.PUBLIC_HOME)
        }
      }}
      aria-label="Dalil Sante"
    >
      <img
        src={logoUrl}
        alt="Dalil Sante"
        className={styles.logoImage}
      />
    </div>

    <Button
      type="text"
      className={styles.burger}
      icon={<MenuOutlined />}
      onClick={() => setDrawerOpen(true)}
      aria-label="Menu"
    />
  </div>

  <Space className={styles.actions}>
    <LanguageSwitcher />

    <Button
      type="text"
      icon={<LoginOutlined />}
      className={styles.loginButton}
      onClick={() => handleNavigate(ROUTES.LOGIN)}
    >
      Se connecter
    </Button>

    <Button
      type="primary"
      icon={<UserAddOutlined />}
      className={styles.registerButton}
      onClick={() => handleNavigate(ROUTES.REGISTER)}
    >
      Créer un compte
    </Button>
  </Space>
</Header>

      <Drawer
        title={
          <div className={styles.drawerTitle}>
            <Avatar
              src={logoUrl}
              shape="square"
              size={42}
            />
            <Text strong>Dalil Sante</Text>
          </div>
        }
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={styles.drawer}
        width={300}
      >
        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
        />

        <div className={styles.drawerActions}>
          <Button
            block
            size="large"
            icon={<LoginOutlined />}
            onClick={() => handleNavigate(ROUTES.LOGIN)}
          >
            Se connecter
          </Button>

          <Button
            block
            type="primary"
            size="large"
            icon={<UserAddOutlined />}
            onClick={() => handleNavigate(ROUTES.REGISTER)}
          >
            Créer un compte
          </Button>
        </div>
      </Drawer>

      <Content className={styles.content}>
        <Outlet />
      </Content>

      <Footer className={styles.footer}>
        <Text type="secondary">
          Dalil Sante — votre guide santé au quotidien.
        </Text>
      </Footer>
    </Layout>
  )
}

export default PublicLayout