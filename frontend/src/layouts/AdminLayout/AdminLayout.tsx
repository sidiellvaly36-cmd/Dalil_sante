import { useState } from 'react'
import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import styles from './AdminLayout.module.scss'

const { Content } = Layout

/**
 * الهيكل العام (Layout) لكل صفحات لوحة التحكم المحمية.
 * يحتوي Sidebar ثابت على اليسار + Header علوي + Content تُعرض بداخلها
 * الصفحة الحالية عبر <Outlet /> (React Router Nested Routes).
 */
function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <Layout className={styles.layout}>
      <Sidebar collapsed={collapsed} />

      <Layout
        className={`${styles.contentLayout} ${collapsed ? styles.contentLayoutCollapsed : ''}`}
      >
        <Header
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          currentPath={location.pathname}
        />

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
