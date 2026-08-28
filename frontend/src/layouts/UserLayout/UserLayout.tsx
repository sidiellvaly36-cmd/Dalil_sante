import { useState } from 'react'
import { Avatar, Button, Drawer, Dropdown, Layout, Menu, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { IdcardOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'
import { ROUTES } from '@/constants'
import { useI18n } from '@/i18n'
import logoUrl from '@/assets/logo-dalil-sante-transparent.png'
import { USER_MENU_ITEMS } from './menuConfig'
import styles from './UserLayout.module.scss'

const { Header, Content, Footer } = Layout
const { Text } = Typography

function UserLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { t } = useI18n()
  const selectedKey = USER_MENU_ITEMS.find((item) => item.route === location.pathname)?.key ?? 'home'

  const navMenuItems: MenuProps['items'] = USER_MENU_ITEMS.map((item) => ({ key: item.key, icon: item.icon, label: t(item.labelKey) }))
  const handleNavClick: MenuProps['onClick'] = ({ key }) => {
    const target = USER_MENU_ITEMS.find((item) => item.key === key)
    if (target) navigate(target.route)
    setDrawerOpen(false)
  }
  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <IdcardOutlined />, label: t('navigation.profile'), onClick: () => navigate(ROUTES.PROFILE) },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: t('navigation.logout'), danger: true, onClick: () => logout() },
  ]

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate(ROUTES.HOME)}>
          <img src={logoUrl} alt="Dalil Sante" className={styles.logoImage} />
        </div>
        <Menu mode="horizontal" selectedKeys={[selectedKey]} items={navMenuItems} onClick={handleNavClick} className={styles.nav} />
        <Space className={styles.right}>
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <Space className={styles.userMenu}>
              <Avatar icon={<UserOutlined />} className={styles.avatar} />
              <Text strong className={styles.userName}>{user?.fullName}</Text>
            </Space>
          </Dropdown>
          <Button type="text" className={styles.burger} icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} aria-label={t('navigation.menu')} />
        </Space>
      </Header>
      <Drawer title={t('navigation.menu')} placement="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Menu mode="vertical" selectedKeys={[selectedKey]} items={navMenuItems} onClick={handleNavClick} />
      </Drawer>
      <Content className={styles.content}><Outlet /></Content>
      <Footer className={styles.footer}><Text type="secondary">Dalil Sante — votre guide sante au quotidien.</Text></Footer>
    </Layout>
  )
}

export default UserLayout
