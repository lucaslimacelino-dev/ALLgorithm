import { useEffect } from 'react'
import { SITE } from '../config/site'
import { useI18n } from '../i18n'

export function usePageTitle(title) {
  const { t } = useI18n()
  const tagline = t('site.tagline')
  useEffect(() => {
    document.title = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${tagline}`
  }, [title, tagline])
}
