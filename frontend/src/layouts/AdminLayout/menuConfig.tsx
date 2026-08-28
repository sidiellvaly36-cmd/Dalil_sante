import {
  ApartmentOutlined,
  BankOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  CompassOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons'

import type { ReactNode } from 'react'
import { ROUTES } from '@/constants'

export interface MenuConfigItem {
  key: string
  labelKey: string
  icon: ReactNode
  route: string
}

export const MENU_ITEMS: MenuConfigItem[] = [
  {
    key: 'dashboard',
    labelKey: 'navigation.dashboard',
    icon: <DashboardOutlined />,
    route: ROUTES.DASHBOARD,
  },
  {
    key: 'users',
    labelKey: 'navigation.users',
    icon: <TeamOutlined />,
    route: ROUTES.USERS,
  },
  {
    key: 'admins',
    labelKey: 'navigation.administrators',
    icon: <SafetyCertificateOutlined />,
    route: ROUTES.ADMINS,
  },
  {
    key: 'establishments',
    labelKey: 'navigation.establishments',
    icon: <BankOutlined />,
    route: ROUTES.ESTABLISHMENTS,
  },
  {
    key: 'locations',
    labelKey: 'navigation.locations',
    icon: <EnvironmentOutlined />,
    route: ROUTES.LOCATIONS,
  },
  {
    key: 'medical-services',
    labelKey: 'navigation.services',
    icon: <MedicineBoxOutlined />,
    route: ROUTES.MEDICAL_SERVICES,
  },
  {
    key: 'specialties',
    labelKey: 'navigation.specialties',
    icon: <ApartmentOutlined />,
    route: ROUTES.SPECIALTIES,
  },
  {
    key: 'schedules',
    labelKey: 'navigation.schedules',
    icon: <ClockCircleOutlined />,
    route: ROUTES.SCHEDULES,
  },
  {
    key: 'emergency-numbers',
    labelKey: 'navigation.emergency',
    icon: <PhoneOutlined />,
    route: ROUTES.ADMIN_EMERGENCY_NUMBERS,
  },
  {
    key: 'medical-orientation',
    labelKey: 'navigation.orientation',
    icon: <CompassOutlined />,
    route: ROUTES.ORIENTATION_QUESTIONS,
  },
  {
    key: 'health-advice',
    labelKey: 'navigation.advice',
    icon: <BulbOutlined />,
    route: ROUTES.HEALTH_ADVICE_MANAGEMENT,
  },
]