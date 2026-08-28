import { Select } from 'antd'
import { useI18n } from './I18nProvider'

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n()

  return (
    <Select
      aria-label={t('language.label')}
      value={language}
      onChange={setLanguage}
      options={[
        { value: 'fr', label: t('language.french') },
        { value: 'ar', label: t('language.arabic') },
      ]}
      style={{ minWidth: 112 }}
    />
  )
}
