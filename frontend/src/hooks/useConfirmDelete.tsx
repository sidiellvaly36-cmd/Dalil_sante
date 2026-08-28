import { App } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'

interface ConfirmDeleteOptions {
  title: string
  content?: string
  onConfirm: () => void
}

export function useConfirmDelete() {
  const { modal } = App.useApp()

  return ({ title, content, onConfirm }: ConfirmDeleteOptions) => {
    modal.confirm({
      title,
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: content ?? 'Cette action est irréversible. Voulez-vous continuer ?',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: onConfirm,
    })
  }
}
