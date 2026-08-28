import { Layout, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { MedicineBoxOutlined } from '@ant-design/icons'
import { MENU_ITEMS } from './menuConfig'
import { useI18n } from '@/i18n'
import styles from './AdminLayout.module.scss'

const { Sider } = Layout

interface SidebarProps {
  collapsed: boolean
}

/** الشريط الجانبي الثابت (Dark Sidebar) على غرار Ant Design Pro */
function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useI18n()

  const selectedKey =
    MENU_ITEMS.find((item) => item.route === location.pathname)?.key ?? 'dashboard'

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={256} className={styles.sider}>
      <div className={styles.logoWrapper}>
        <MedicineBoxOutlined className={styles.logoIcon} />
        {!collapsed && <span className={styles.logoText}>Dalil Santé</span>}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={MENU_ITEMS.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: t(item.labelKey),
          onClick: () => navigate(item.route),
        }))}
      />
    </Sider>
  )
}

export default Sidebar
