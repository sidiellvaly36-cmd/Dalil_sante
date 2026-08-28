import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from '@ant-design/icons'
import { useLogin } from '@/hooks/useAuth'
import { ROUTES } from '@/constants'
import logoUrl from '@/assets/logo-dalil-sante-transparent.png'
import { loginSchema, type LoginFormValues } from './loginSchema'
import styles from './Login.module.scss'

/**
 * صفحة تسجيل الدخول - إعادة تصميم كاملة للواجهة فقط (بطاقة واحدة متمركزة،
 * الشعار الرسمي أعلى المنتصف)، اعتمادًا على مرجع بصري قدّمه المستخدم.
 * المنطق البرمجي لم يتغيّر إطلاقًا: نفس useLogin (POST /auth/login ثم
 * GET /auth/me)، نفس loginSchema (identifiant يقبل بريدًا أو هاتفًا، مطابقًا
 * لسلوك الـ Backend الفعلي findByEmailOrTelephone - لم أُقيّده بصيغة بريد
 * فقط حتى لا أُفقد وظيفة الدخول بالهاتف الموجودة فعليًا).
 *
 * ملاحظتان بخصوص عناصر واجهة طُلبت في المرجع البصري:
 * - "Mot de passe oublié ?" لم تُضَف: لا يوجد أي Endpoint لاستعادة كلمة المرور
 *   في الـ Backend حاليًا (تحقّقتُ سابقًا)، وطُلب صراحةً عدم إنشاء وظيفة وهمية.
 * - "Se souvenir de moi" أُضيفت كعنصر واجهة (checkbox) كما طُلب، لكنها لا تُغيّر
 *   فعليًا آلية تخزين الجلسة (تبقى localStorage كما هي حاليًا) لأن ذلك يتطلب
 *   تعديل authService/httpClient، وهو ممنوع إلا لإصلاح خطأ حقيقي.
 */
function Login() {
  const { mutate: login, isPending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifiant: '', password: '' },
  })

  const onSubmit = (values: LoginFormValues) => {
    login(values)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={logoUrl} alt="Dalil Santé" className={styles.logo} />

        <h1 className={styles.title}>Bienvenue dans Dalil Santé</h1>
        <p className={styles.subtitle}>Connectez-vous pour accéder à votre espace</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className={styles.fieldLabel} htmlFor="identifiant">
              Email ou téléphone
            </label>
            <Controller
              name="identifiant"
              control={control}
              render={({ field }) => (
                <div
                  className={`${styles.inputWrapper} ${errors.identifiant ? styles.inputWrapperError : ''}`}
                >
                  <UserOutlined className={styles.inputIcon} />
                  <input
                    {...field}
                    id="identifiant"
                    type="text"
                    autoComplete="username"
                    placeholder="admin@dalilsante.mr"
                    disabled={isPending}
                    className={styles.input}
                  />
                </div>
              )}
            />
            {errors.identifiant && <p className={styles.errorText}>{errors.identifiant.message}</p>}
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="password">
              Mot de passe
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div
                  className={`${styles.inputWrapper} ${errors.password ? styles.inputWrapperError : ''}`}
                >
                  <LockOutlined className={styles.inputIcon} />
                  <input
                    {...field}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    disabled={isPending}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              )}
            />
            {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
          </div>

          <label className={styles.rememberRow} htmlFor="rememberMe">
            <input
              id="rememberMe"
              type="checkbox"
              className={styles.checkbox}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Se souvenir de moi</span>
          </label>

          <button type="submit" className={styles.submitButton} disabled={isPending}>
            {isPending ? <LoadingOutlined className={styles.spinnerIcon} /> : 'Se connecter'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <Link to={ROUTES.REGISTER} className={styles.registerButton}>
          Créer un compte
        </Link>
      </div>
    </div>
  )
}

export default Login