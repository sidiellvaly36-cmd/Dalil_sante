import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { useRegister } from '@/hooks/useAuth'
import { ROUTES } from '@/constants'
import logoUrl from '@/assets/logo-dalil-sante-transparent.png'
import { registerSchema, type RegisterFormValues } from './registerSchema'
import styles from './Register.module.scss'

/**
 * صفحة إنشاء حساب (Inscription) - إعادة تصميم للواجهة فقط لتطابق هوية صفحة
 * Login الجديدة (بطاقة واحدة متمركزة، الشعار الشفاف أعلى المنتصف، ألوان
 * #0D6EFD/#1EA34A). المنطق البرمجي لم يتغيّر: نفس useRegister (POST
 * /auth/register ثم بناء الجلسة)، نفس registerSchema، الدور UTILISATEUR
 * يفرضه الـ Backend دون أي حقل اختيار دور في هذا النموذج.
 */
function Register() {
  const { mutate: register, isPending } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values: RegisterFormValues) => {
    const { confirmPassword: _confirmPassword, ...payload } = values
    register(payload)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={logoUrl} alt="Dalil Santé" className={styles.logo} />

        <h1 className={styles.title}>Créer votre compte</h1>
        <p className={styles.subtitle}>Renseignez vos informations pour commencer</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.fieldRow}>
            <div>
              <label className={styles.fieldLabel} htmlFor="prenom">
                Prénom
              </label>
              <Controller
                name="prenom"
                control={control}
                render={({ field }) => (
                  <div
                    className={`${styles.inputWrapper} ${errors.prenom ? styles.inputWrapperError : ''}`}
                  >
                    <UserOutlined className={styles.inputIcon} />
                    <input
                      {...field}
                      id="prenom"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Amina"
                      disabled={isPending}
                      className={styles.input}
                    />
                  </div>
                )}
              />
              {errors.prenom && <p className={styles.errorText}>{errors.prenom.message}</p>}
            </div>

            <div>
              <label className={styles.fieldLabel} htmlFor="nom">
                Nom
              </label>
              <Controller
                name="nom"
                control={control}
                render={({ field }) => (
                  <div className={`${styles.inputWrapper} ${errors.nom ? styles.inputWrapperError : ''}`}>
                    <UserOutlined className={styles.inputIcon} />
                    <input
                      {...field}
                      id="nom"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Mint Sidi"
                      disabled={isPending}
                      className={styles.input}
                    />
                  </div>
                )}
              />
              {errors.nom && <p className={styles.errorText}>{errors.nom.message}</p>}
            </div>
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="telephone">
              Numéro de téléphone
            </label>
            <Controller
              name="telephone"
              control={control}
              render={({ field }) => (
                <div
                  className={`${styles.inputWrapper} ${errors.telephone ? styles.inputWrapperError : ''}`}
                >
                  <PhoneOutlined className={styles.inputIcon} />
                  <input
                    {...field}
                    id="telephone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="22222222"
                    disabled={isPending}
                    className={styles.input}
                  />
                </div>
              )}
            />
            {errors.telephone && <p className={styles.errorText}>{errors.telephone.message}</p>}
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="email">
              Adresse email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div className={`${styles.inputWrapper} ${errors.email ? styles.inputWrapperError : ''}`}>
                  <MailOutlined className={styles.inputIcon} />
                  <input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="vous@example.com"
                    disabled={isPending}
                    className={styles.input}
                  />
                </div>
              )}
            />
            {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
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
                    autoComplete="new-password"
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

          <div>
            <label className={styles.fieldLabel} htmlFor="confirmPassword">
              Confirmation du mot de passe
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <div
                  className={`${styles.inputWrapper} ${errors.confirmPassword ? styles.inputWrapperError : ''}`}
                >
                  <LockOutlined className={styles.inputIcon} />
                  <input
                    {...field}
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    disabled={isPending}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                    }
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              )}
            />
            {errors.confirmPassword && (
              <p className={styles.errorText}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isPending}>
            {isPending ? <LoadingOutlined className={styles.spinnerIcon} /> : 'Créer mon compte'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <Link to={ROUTES.LOGIN} className={styles.loginButton}>
          Vous avez déjà un compte ? Se connecter
        </Link>
      </div>
    </div>
  )
}

export default Register