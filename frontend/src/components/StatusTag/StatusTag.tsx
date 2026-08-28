import { Tag } from 'antd'
import { getActifColor, getActifLabel } from '@/constants'

interface StatusTagProps {
  actif: boolean
}

function StatusTag({ actif }: StatusTagProps) {
  return <Tag color={getActifColor(actif)}>{getActifLabel(actif)}</Tag>
}

export default StatusTag
