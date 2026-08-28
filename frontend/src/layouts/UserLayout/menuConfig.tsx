import type { ReactNode } from 'react'
import {
  BulbOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { ROUTES } from '@/constants'

export interface UserMenuConfigItem {
  key: string
  labelKey: string
  icon: ReactNode
  route: string
}

export const USER_MENU_ITEMS: UserMenuConfigItem[] = [
  { key: 'home', labelKey: 'navigation.home', icon: <HomeOutlined />, route: ROUTES.HOME },
  { key: 'emergency', labelKey: 'navigation.emergency', icon: <PhoneOutlined />, route: ROUTES.EMERGENCY },
  { key: 'search', labelKey: 'navigation.establishments', icon: <SearchOutlined />, route: ROUTES.SEARCH },
  { key: 'services', labelKey: 'navigation.services', icon: <MedicineBoxOutlined />, route: ROUTES.SERVICES_SEARCH },
  { key: 'health-advice', labelKey: 'navigation.advice', icon: <BulbOutlined />, route: ROUTES.HEALTH_ADVICE },
  { key: 'ask-question', labelKey: 'navigation.askQuestion', icon: <QuestionCircleOutlined />, route: ROUTES.MEDICAL_ORIENTATION },
  { key: 'profile', labelKey: 'navigation.profile', icon: <UserOutlined />, route: ROUTES.PROFILE },
]
