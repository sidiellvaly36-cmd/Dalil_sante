import type { BackendRole, SelectOption } from '@/types'

/** خيارات الأدوار المستخدمة في القوائم المنسدلة (Select) - مطابقة لـ enums/Role.java */
export const ROLE_OPTIONS: SelectOption[] = [
  { label: 'Administrateur', value: 'ADMIN' },
  { label: 'Utilisateur', value: 'UTILISATEUR' },
]

/** تسميات الأدوار بالفرنسية للعرض المباشر */
export const ROLE_LABELS: Record<BackendRole, string> = {
  ADMIN: 'Administrateur',
  UTILISATEUR: 'Utilisateur',
}

/** لون شارة (Tag) كل دور في Ant Design */
export const ROLE_COLORS: Record<BackendRole, string> = {
  ADMIN: 'gold',
  UTILISATEUR: 'blue',
}
