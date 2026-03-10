import enMessages from './messages/en.json'
import esMessages from './messages/es.json'

// ---------------------------------------------------------------------------
// Locale type — the only two supported locales in this project
// ---------------------------------------------------------------------------

export type Locale = 'en' | 'es'

export const LOCALES: Locale[] = ['en', 'es']
export const DEFAULT_LOCALE: Locale = 'en'

// ---------------------------------------------------------------------------
// Message interfaces — one per section namespace
// ---------------------------------------------------------------------------

export interface NavMessages {
  home: string
  about: string
  service: string
  portfolio: string
  contact: string
}

export interface HeroMessages {
  greeting: string
  typedStrings: string[]
  bio: string
  cvButton: string
  seo: {
    title: string
    description: string
  }
}

export interface AboutMessages {
  sectionLabel: string
  sectionTitle: string
  bioP1: string
  bioP2: string
  skillsHeading: string
  experienceBadge: string
  seeMoreButton: string
  modal: {
    tabs: {
      personal: string
      achievements: string
      experience: string
      education: string
    }
    personal: {
      heading: string
      fullName: string
      location: string
      phone: string
      email: string
      languages: string
      discord: string
      freelance: string
      freelanceValue: string
    }
    achievements: {
      heading: string
      yearsLabel: string
      projectsLabel: string
      customersLabel: string
    }
    experience: {
      heading: string
    }
    education: {
      heading: string
    }
  }
}

export interface ServiceMessages {
  sectionLabel: string
  sectionTitle: string
  modal: {
    closeAriaLabel: string
  }
}

export interface PortfolioMessages {
  sectionLabel: string
  sectionTitle: string
  modal: {
    closeAriaLabel: string
    clientLabel: string
    categoryLabel: string
    dateLabel: string
    liveLinkText: string
  }
}

export interface ContactMessages {
  sectionLabel: string
  sectionTitle: string
  phone: string
  email: string
  location: string
  form: {
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    submitButton: string
  }
  toast: {
    success: string
    error: string
  }
}

export interface CommonMessages {
  themeToggle: {
    dark: string
    light: string
    switchToDark: string
    switchToLight: string
  }
  langToggle: {
    switchToEs: string
    switchToEn: string
  }
  closeModal: string
}

export interface Messages {
  nav: NavMessages
  hero: HeroMessages
  about: AboutMessages
  service: ServiceMessages
  portfolio: PortfolioMessages
  contact: ContactMessages
  common: CommonMessages
}

// ---------------------------------------------------------------------------
// Alternate link type for hreflang SEO tags
// ---------------------------------------------------------------------------

export interface AlternateLink {
  hreflang: 'en' | 'es' | 'x-default'
  href: string
}

// ---------------------------------------------------------------------------
// getLang — extract and validate the locale segment from a URL
// Input is sanitised against the Locale union — no user-controlled string
// is passed through without validation.
// ---------------------------------------------------------------------------

export function getLang(url: URL): Locale {
  const segments = url.pathname.split('/')
  // segments[0] is always '' (leading slash), segments[1] is the lang segment
  const segment = segments[1]
  if (segment === 'es') return 'es'
  return 'en'
}

// ---------------------------------------------------------------------------
// getTranslation — return the typed Messages object for a given locale.
// Both JSON files are statically imported at the top of the module so no
// dynamic import is needed at runtime; the bundle includes both locales.
// ---------------------------------------------------------------------------

const translations: Record<Locale, Messages> = {
  en: enMessages as Messages,
  es: esMessages as Messages,
}

export function getTranslation(lang: Locale): Messages {
  return translations[lang]
}

// ---------------------------------------------------------------------------
// getAlternates — build hreflang alternate link objects for SEO
// ---------------------------------------------------------------------------

export function getAlternates(siteBase: string, path = ''): AlternateLink[] {
  // Normalise: strip trailing slashes from base, leading slashes from path
  const base = siteBase.replace(/\/+$/, '')
  const cleanPath = path.replace(/^\/+/, '')
  const suffix = cleanPath.length > 0 ? `/${cleanPath}` : ''

  return [
    { hreflang: 'en', href: `${base}/en${suffix}` },
    { hreflang: 'es', href: `${base}/es${suffix}` },
    { hreflang: 'x-default', href: `${base}/en${suffix}` },
  ]
}

// ---------------------------------------------------------------------------
// getI18nStaticPaths — convenience helper for getStaticPaths in page files
// ---------------------------------------------------------------------------

export function getI18nStaticPaths(): Array<{ params: { lang: Locale } }> {
  return LOCALES.map((lang) => ({ params: { lang } }))
}
