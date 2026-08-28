import type { ReactNode } from 'react'
import PulseLine from '../PulseLine/PulseLine'
import logoUrl from '@/assets/logo-dalil-sante-transparent.png'
import styles from './BrandPanel.module.scss'

interface BrandPanelProps {
  eyebrow: string
  headline: ReactNode
  subtext: string
}

/**
 * BrandPanel — اللوحة اليسرى الداكنة المستخدمة في صفحات المصادقة (Login, ولاحقًا
 * Mot de passe oublié...). مكوّن تصميم بحت (Presentational) بدون أي منطق أعمال،
 * يستقبل نصوصه كخصائص (Props) ليبقى قابلاً لإعادة الاستخدام بمحتوى مختلف.
 */
function BrandPanel({ eyebrow, headline, subtext }: BrandPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.brandRow}>
        <img src={logoUrl} alt="Dalil Santé" className={styles.logoImage} />
      </div>

      <div className={styles.body}>
        <div className={styles.pulseWrapper}>
          <PulseLine />
        </div>

        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          {eyebrow}
        </span>

        <h1 className={styles.headline}>{headline}</h1>
        <p className={styles.subtext}>{subtext}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.stat}>
          <span className={styles.statValue}>JWT</span>
          <span className={styles.statLabel}>Accès sécurisé</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>24/7</span>
          <span className={styles.statLabel}>Disponibilité</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>MR</span>
          <span className={styles.statLabel}>Mauritanie</span>
        </div>
      </div>
    </div>
  )
}

export default BrandPanel
