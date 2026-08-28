import type { ReactNode } from 'react'
import { Card, Skeleton, Statistic } from 'antd'
import styles from './StatCard.module.scss'

interface StatCardProps {
  title: string
  value: number
  icon: ReactNode
  color: string
  footer?: ReactNode
  loading?: boolean
}

/** بطاقة إحصائية عامة (رقم + أيقونة + عنوان + تذييل اختياري) تُستخدم في لوحة التحكم */
function StatCard({ title, value, icon, color, footer, loading }: StatCardProps) {
  return (
    <Card className={styles.card}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} />
      ) : (
        <>
          <div className={styles.header}>
            <span className={styles.iconBadge} style={{ backgroundColor: `${color}1a`, color }}>
              {icon}
            </span>
            <Statistic title={title} value={value} valueStyle={{ fontSize: 26, fontWeight: 600 }} />
          </div>
          {footer && <div className={styles.footer}>{footer}</div>}
        </>
      )}
    </Card>
  )
}

export default StatCard