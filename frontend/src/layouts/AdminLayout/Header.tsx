import { Avatar, Dropdown, Layout, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { IdcardOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'
import { ROUTES } from '@/constants'
import { useI18n } from '@/i18n'
import { MENU_ITEMS } from './menuConfig'
import styles from './AdminLayout.module.scss'

const { Header: AntHeader } = Layout
const { Text } = Typography

interface HeaderProps {
  collapsed: boolean
  onToggleCollapse: () => void
  currentPath: string
}

function Header({ collapsed, onToggleCollapse, currentPath }: HeaderProps) {
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()
  const navigate = useNavigate()
  const { t } = useI18n()
  const currentPageTitle = t(MENU_ITEMS.find((item) => item.route === currentPath)?.labelKey ?? 'navigation.dashboard')

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <IdcardOutlined />, label: t('navigation.profile'), onClick: () => navigate(ROUTES.PROFILE) },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: t('navigation.logout'), danger: true, onClick: () => logout() },
  ]

  return (
    <AntHeader className={styles.header}>
      <div className={styles.headerLeft}>
        <button type="button" onClick={onToggleCollapse} className={styles.collapseButton} aria-label={t('navigation.menu')}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
        <Text strong className={styles.pageTitle}>{currentPageTitle}</Text>
      </div>

      <Space>
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <Space className={styles.userMenu}>
            <Avatar icon={<UserOutlined />} className={styles.avatar} />
            <div className={styles.userInfo}>
              <Text strong className={styles.userName}>{user?.fullName}</Text>
              <Text type="secondary" className={styles.userRole}>{user?.role ?? ''}</Text>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header
