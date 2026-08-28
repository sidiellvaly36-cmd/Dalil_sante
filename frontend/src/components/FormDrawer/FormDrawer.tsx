import type { ReactNode } from 'react'
import { Button, Drawer, Space } from 'antd'
import { useI18n } from '@/i18n'

interface FormDrawerProps {
  title: string
  open: boolean
  onClose: () => void
  onSubmit: () => void
  loading?: boolean
  submitLabel?: string
  width?: number | string
  children: ReactNode
}

function FormDrawer({ title, open, onClose, onSubmit, loading = false, submitLabel, width = 480, children }: FormDrawerProps) {
  const { t } = useI18n()
  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={width}
      destroyOnHidden
      extra={
        <Space>
          <Button onClick={onClose} disabled={loading}>{t('common.cancel')}</Button>
          <Button type="primary" onClick={onSubmit} loading={loading}>{submitLabel ?? t('common.save')}</Button>
        </Space>
      }
    >
      {children}
    </Drawer>
  )
}

export default FormDrawer
