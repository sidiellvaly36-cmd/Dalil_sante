import type { ReactNode } from 'react'
import styles from './AuthCard.module.scss'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

/**
 * AuthCard — الجانب الأيمن الفاتح لصفحات المصادقة. يوفّر رأسًا (عنوان + وصف)
 * ومساحة للنموذج (children) وتذييلًا اختياريًا. مكوّن تصميم بحت بدون منطق أعمال.
 */
function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className={styles.side}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {children}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  )
}

export default AuthCard
