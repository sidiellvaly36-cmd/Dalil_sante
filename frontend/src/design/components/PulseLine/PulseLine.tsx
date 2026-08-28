import styles from './PulseLine.module.scss'

/**
 * PulseLine — العنصر البصري المميّز (Signature Element) لهوية Dalil Santé.
 *
 * خط واحد مستمر يبدأ كنبضة قلب طبية (Heartbeat/ECG)، ثم يتحوّل تدريجيًا إلى
 * منحنى كثيب رملي هادئ (إشارة بصرية لموريتانيا) قبل أن يستقر أفقيًا - رمزية
 * "إشارة حياة تلتقي بأرض الصحراء". يُرسم مرة واحدة عند التحميل (stroke draw-in)
 * ويحترم prefers-reduced-motion تلقائيًا عبر CSS.
 */
function PulseLine() {
  return (
    <svg
      viewBox="0 0 640 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.svg}
      aria-hidden="true"
    >
      <path
        className={styles.path}
        d="M0 60 H90 L110 60 L124 20 L142 100 L158 40 L172 60 H230
           C 280 60, 300 20, 350 30
           C 400 40, 420 90, 470 80
           C 520 70, 540 40, 590 50
           C 610 54, 620 60, 640 60"
        stroke="url(#pulseGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className={styles.dot} cx="640" cy="60" r="5" fill="#E7B166" />
      <defs>
        <linearGradient id="pulseGradient" x1="0" y1="0" x2="640" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1B9384" />
          <stop offset="55%" stopColor="#DCF0EA" />
          <stop offset="100%" stopColor="#E7B166" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default PulseLine
