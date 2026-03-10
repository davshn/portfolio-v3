import type { Locale } from '../i18n/utils'
import { getTranslation } from '../i18n/utils'

export function buildPersonSchema(lang: Locale = 'en'): Record<string, unknown> {
  const t = getTranslation(lang)
  const inLanguage = lang === 'es' ? 'es-CO' : 'en-US'

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Hernán David Figueroa Cárdenas',
    jobTitle: 'Fullstack Developer',
    email: 'davshn@gmail.com',
    description: t.hero.seo.description,
    inLanguage,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bogota',
      addressCountry: 'CO',
    },
    sameAs: [
      'https://www.facebook.com/david.figueroa.184',
      'https://twitter.com/davshmr',
      'https://www.instagram.com/davidfigueroa9055',
      'https://github.com/davshn',
      'https://www.linkedin.com/in/davshn',
    ],
  }
}

export function buildWebSiteSchema(url: string, lang: Locale = 'en'): Record<string, unknown> {
  const t = getTranslation(lang)
  const inLanguage = lang === 'es' ? 'es-CO' : 'en-US'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t.hero.seo.title,
    url,
    description: t.hero.seo.description,
    inLanguage,
  }
}
