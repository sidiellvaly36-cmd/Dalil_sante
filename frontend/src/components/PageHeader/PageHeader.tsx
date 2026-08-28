import type { ReactNode } from 'react'
import { Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from './PageHeader.module.scss'

const { Title, Text } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  extra?: ReactNode
}

function PageHeader({ title, subtitle, actionLabel, onAction, extra }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleBlock}>
        <Title level={4} className={styles.title}>
          {title}
        </Title>
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </div>

      <div className={styles.actions}>
        {extra}
        {actionLabel && onAction && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default PageHeader
