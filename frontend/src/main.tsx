import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import frFR from 'antd/locale/fr_FR'
import arEG from 'antd/locale/ar_EG'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClient } from '@/config/queryClient'
import { themeConfig } from '@/config/theme'
import App from '@/App'
import { I18nProvider, useI18n } from '@/i18n'

import 'antd/dist/reset.css'
import '@/styles/global.scss'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    'عنصر الجذر (root) غير موجود في index.html. تأكد من وجود <div id="root"></div>',
  )
}

function LocalizedProviders() {
  const { language } = useI18n()

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={language === 'ar' ? arEG : frFR} direction={language === 'ar' ? 'rtl' : 'ltr'} theme={themeConfig}>
          {/* AntApp يوفر سياق (Context) لمكونات message / notification / Modal.confirm */}
          <AntApp>
            <App />
          </AntApp>
        </ConfigProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  )
}

createRoot(rootElement).render(
  <StrictMode>
    <I18nProvider>
      <LocalizedProviders />
    </I18nProvider>
  </StrictMode>,
)
