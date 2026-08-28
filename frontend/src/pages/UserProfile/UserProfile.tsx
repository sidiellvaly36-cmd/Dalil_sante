import { Avatar, Button, Card, Form, Input, Space, Tag, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '@/components'
import { useAuthStore } from '@/store/authStore'
import { useChangePassword } from '@/hooks/useAuth'
import { ROLE_COLORS, ROLE_LABELS } from '@/constants'
import { changePasswordSchema, type ChangePasswordFormValues } from './userProfileSchema'
import styles from './UserProfile.module.scss'

const { Title, Text } = Typography

const emptyValues: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

/**
 * Profil (espace UTILISATEUR) - affiche les informations réelles de la session
 * (déjà en cache dans authStore, provenant de GET /auth/me) et permet de
 * changer le mot de passe via PUT /auth/change-password (useChangePassword,
 * déjà existant dans hooks/useAuth.ts mais inutilisé par aucune page jusqu'ici).
 */
function UserProfile() {
  const user = useAuthStore((state) => state.user)
  const { mutate: changePassword, isPending } = useChangePassword()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: emptyValues,
  })

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword(values, { onSuccess: () => reset(emptyValues) })
  }

  return (
    <div>
      <PageHeader title="Mon profil" subtitle="Vos informations personnelles et vos paramètres de sécurité." />

      <Card className={styles.profileCard}>
        <Avatar size={64} icon={<UserOutlined />} className={styles.avatar} />
        <Title level={4} style={{ marginBottom: 4 }}>
          {user?.fullName}
        </Title>
        {user && <Tag color={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Tag>}

        <div style={{ marginTop: 16 }}>
          <Space direction="vertical" size={4}>
            <Text>
              <strong>Email :</strong> {user?.email}
            </Text>
            <Text>
              <strong>Téléphone :</strong> {user?.phone}
            </Text>
          </Space>
        </div>
      </Card>

      <Card title="Changer le mot de passe" className={styles.formCard}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Mot de passe actuel"
            validateStatus={errors.currentPassword ? 'error' : ''}
            help={errors.currentPassword?.message}
          >
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Nouveau mot de passe"
            validateStatus={errors.newPassword ? 'error' : ''}
            help={errors.newPassword?.message}
          >
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Confirmer le nouveau mot de passe"
            validateStatus={errors.confirmPassword ? 'error' : ''}
            help={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isPending}>
            Enregistrer
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default UserProfile