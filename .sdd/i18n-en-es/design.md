# Design: Bilingual i18n Support (English / Spanish)

## Technical Approach

Use Astro's built-in `i18n` configuration (stable in Astro 5.x) with `prefixDefaultLocale: true` to generate explicit `/en` and `/es` URL trees from a single `[lang]/index.astro` page. All UI strings are centralized in two JSON message files accessed via a typed `getTranslation()` helper — no dynamic key lookups, no runtime i18n library. Content collections are restructured into `en/` and `es/` locale subdirectories with a `lang` field in the Zod schema, enabling a single `getCollection()` call filtered by `lang` at build time. The language toggle is a lightweight `.astro` component with an inline `<script is:inline>` for no-flash locale detection, mirroring the existing theme-toggle pattern in `BaseLayout.astro`.

---

## Architecture Decisions

### Decision: Astro Built-in i18n vs. Runtime Library

**Choice**: Astro built-in `i18n` config block in `astro.config.mjs`
**Alternatives considered**: `i18next` with `react-i18next`; `Lingui`
**Rationale**: The site is a static-output Astro site with no server runtime. Astro's built-in i18n integrates directly with `getStaticPaths` and generates locale-prefixed routes at build time with zero JS overhead. `i18next` requires a client-side runtime and complicates static generation. `Lingui` adds compiler tooling complexity unjustified at two-locale scale.

---

### Decision: Content Collection Restructure — Subdirectory + `lang` Field

**Choice**: Move existing markdown files into `src/content/projects/en/` and `src/content/services/en/`, create sibling `es/` directories, and add a `lang: z.enum(["en", "es"])` field to each collection schema. Query by filtering on `entry.data.lang`.
**Alternatives considered**: Two separate collections (`projects-en`, `projects-es`); flat files with a `lang` field but no subdirectories; entirely separate content directories
**Rationale**: Subdirectories make it impossible to accidentally query cross-locale content (each locale's files are physically isolated). A single `lang` field in the schema keeps the collection definition minimal — one `defineCollection` call per content type, not two. The filtering pattern (`getCollection('projects').then(entries => entries.filter(e => e.data.lang === lang))`) is idiomatic Astro. Having both `en/` in the path and a `lang` field may seem redundant, but the field is the authoritative filter used in code; the directory structure is for human navigation.

---

### Decision: JSON Message Files vs. Inline Translations

**Choice**: `src/i18n/messages/en.json` and `src/i18n/messages/es.json` imported at build time via a typed `getTranslation(lang)` function
**Alternatives considered**: Hardcoded strings per locale in each `.astro` component; TypeScript `const` maps per locale
**Rationale**: A single JSON source of truth per locale makes auditing translations trivial — reviewers diff one file per language. TypeScript inference from `satisfies Messages` ensures no missing keys. Unlike hardcoded per-component strings, a central file prevents the same string being translated differently in two components.

---

### Decision: Language Toggle as `.astro` Component with Inline Script

**Choice**: `src/components/ui/LangToggle.astro` — two `<a>` links pointing to `/en` and `/es`, plus an `<script is:inline>` that reads `localStorage.getItem('portfolio-lang')` before first paint and redirects if the stored locale differs from the current URL segment
**Alternatives considered**: React island (`LangToggle.tsx`) with `client:load`; `<script>` tag inside `Sidebar.astro`
**Rationale**: The toggle has no interactive state beyond "which locale am I on" — that information is in the URL. A React island adds hydration cost for a navigation element. Using an `.astro` component with `is:inline` script matches the existing pattern used for the theme-color no-flash script in `BaseLayout.astro`. Extracting the script into a dedicated component (not inlined into `Sidebar.astro`) keeps `Sidebar.astro` readable.

---

### Decision: Locale Passed via Prop Drilling (Not Context)

**Choice**: `lang: Locale` prop threaded from `[lang]/index.astro` → section components → React islands
**Alternatives considered**: Astro `Astro.currentLocale`; React Context inside islands
**Rationale**: Astro 5.x does expose `Astro.currentLocale` (available when Astro's i18n routing is active), but relying on it inside React islands is not possible — React runs client-side and has no access to Astro's server context. Prop drilling is explicit, statically typed, and does not require a context provider wrapping each island. The island tree is shallow (one island per section at most) so drilling one extra prop is not a maintenance burden.

---

### Decision: Static JSON Files for Skills / Experience / Education

**Choice**: Create `src/content/skills.es.json`, `src/content/experience.es.json`, `src/content/education.es.json` as sibling files. The `.astro` section components import the correct file based on the `lang` prop using a conditional import map.
**Alternatives considered**: Single JSON with `{ en: [...], es: [...] }` shape; Content Collection for these files
**Rationale**: These three data files are small and static. Adding them to an Astro Content Collection introduces schema boilerplate for no query-time benefit. The conditional import pattern (`lang === 'es' ? skillsEs : skillsEn`) is explicit and zero-overhead. A nested `{ en, es }` object would leak the locale structure into every consumer.

---

## Data Flow

```
astro.config.mjs (i18n: { defaultLocale:'en', locales:['en','es'] })
        │
        ▼
src/pages/[lang]/index.astro
  getStaticPaths() → [{ params:{lang:'en'} }, { params:{lang:'es'} }]
        │
        │  lang: Locale
        ▼
BaseLayout.astro (lang prop → <html lang={lang}>, hreflang tags)
        │
        ├── Sidebar.astro (lang prop → LangToggle.astro, nav labels)
        │       └── LangToggle.astro (is:inline script → localStorage)
        │
        ├── Hero.astro (lang → t.hero.* strings, TypedHero strings=[t.hero.typedStrings])
        │       └── TypedHero.tsx (strings: string[] prop)
        │
        ├── About.astro (lang → t.about.* strings, conditional JSON import)
        │       └── AboutIsland.tsx (lang prop → AboutModal.tsx)
        │               └── AboutModal.tsx (lang prop → t.about.modal.*)
        │
        ├── Service.astro (lang → getCollection filtered by lang, t.service.*)
        │       └── ServiceCards.tsx (lang prop → t.service.modal.close)
        │
        ├── Portfolio.astro (lang → getCollection filtered by lang, t.portfolio.*)
        │       └── PortfolioCarousel.tsx (lang prop → t.portfolio.modal.*)
        │
        └── Contact.astro (lang → t.contact.*)
                └── ContactForm.tsx (lang prop → t.contact.form.*)

localStorage key: 'portfolio-lang'  (persists selected locale across visits)
```

---

## File Changes

| File | Action | Description |
|---|---|---|
| `astro.config.mjs` | Modify | Add `i18n` config block |
| `src/pages/index.astro` | Delete | Replaced by `[lang]/index.astro` |
| `src/pages/[lang]/index.astro` | Create | Dynamic locale route with `getStaticPaths` |
| `src/i18n/utils.ts` | Create | `Locale` type, `Messages` type, `getLang()`, `getTranslation()`, `getAlternates()` |
| `src/i18n/messages/en.json` | Create | All English UI strings (namespaced) |
| `src/i18n/messages/es.json` | Create | All Spanish UI strings (namespaced) |
| `src/layouts/BaseLayout.astro` | Modify | Accept `lang` prop; set `<html lang={lang}>`; inject hreflang; no-flash locale script |
| `src/seo/SEO.astro` | Modify | Accept `lang` + `alternates` props; emit `<link rel="alternate" hreflang>` tags |
| `src/seo/jsonld.ts` | Modify | `buildPersonSchema(lang)`, `buildWebSiteSchema(url, lang)` — add `inLanguage`, locale description |
| `src/components/layout/Sidebar.astro` | Modify | Accept `lang` prop; translate nav labels; import `LangToggle.astro` |
| `src/components/ui/LangToggle.astro` | Create | EN/ES toggle links + `is:inline` no-flash script |
| `src/components/sections/Hero.astro` | Modify | Accept `lang`; pass typed strings and bio text from messages |
| `src/components/sections/TypedHero.tsx` | Modify | Add `strings: string[]` prop; remove hardcoded array |
| `src/components/sections/About.astro` | Modify | Accept `lang`; conditional JSON import for skills/experience/education; pass translated strings |
| `src/components/sections/AboutIsland.tsx` | Modify | Accept `lang`; pass to `AboutModal` |
| `src/components/sections/AboutModal.tsx` | Modify | Accept `lang`; use `t.about.modal.*` for tab labels and section headings |
| `src/components/sections/Service.astro` | Modify | Accept `lang`; filter `getCollection('services')` by `lang`; pass label strings |
| `src/components/sections/ServiceCards.tsx` | Modify | Accept `lang`; translate close button aria-label |
| `src/components/sections/Portfolio.astro` | Modify | Accept `lang`; filter `getCollection('projects')` by `lang`; pass label strings |
| `src/components/sections/PortfolioCarousel.tsx` | Modify | Accept `lang`; translate modal meta labels (Client, Category, Date) and live link text |
| `src/components/sections/Contact.astro` | Modify | Accept `lang`; translate section labels and address card titles |
| `src/components/sections/ContactForm.tsx` | Modify | Accept `lang`; translate field labels, placeholders, submit button |
| `src/content/config.ts` | Modify | Add `lang: z.enum(["en", "es"])` to `projects` and `services` schemas |
| `src/content/projects/en/mento.md` | Create | Move from `projects/mento.md`; add `lang: en` frontmatter |
| `src/content/projects/en/metro-delivery.md` | Create | Move from flat; add `lang: en` |
| `src/content/projects/en/mingga.md` | Create | Move from flat; add `lang: en` |
| `src/content/projects/en/foundry-vtt.md` | Create | Move from flat; add `lang: en` |
| `src/content/projects/en/forgeai.md` | Create | Move from flat; add `lang: en` |
| `src/content/projects/en/cyberquest.md` | Create | Move from flat; add `lang: en` |
| `src/content/projects/en/metrologistica.md` | Create | Move from flat; add `lang: en` |
| `src/content/projects/es/*.md` | Create | Spanish translations of each project (title, description, category in ES) |
| `src/content/projects/*.md` (flat) | Delete | Replaced by `en/` subdirectory counterparts |
| `src/content/services/en/development-as-service.md` | Create | Move from flat; add `lang: en` |
| `src/content/services/en/custom-software.md` | Create | Move from flat; add `lang: en` |
| `src/content/services/en/vulnerability-scan.md` | Create | Move from flat; add `lang: en` |
| `src/content/services/en/mobile-app-development.md` | Create | Move from flat; add `lang: en` |
| `src/content/services/es/*.md` | Create | Spanish translations of each service |
| `src/content/services/*.md` (flat) | Delete | Replaced by `en/` subdirectory counterparts |
| `src/content/skills.es.json` | Create | Spanish skill names (percent values unchanged) |
| `src/content/experience.es.json` | Create | Spanish role/company translations |
| `src/content/education.es.json` | Create | Spanish degree/institution translations |

---

## Interfaces / Contracts

### `src/i18n/utils.ts`

```typescript
export type Locale = 'en' | 'es'

export interface NavMessages {
  home: string
  about: string
  service: string
  portfolio: string
  contact: string
}

export interface HeroMessages {
  greeting: string          // "Hello, I'm"
  typedStrings: string[]    // ["Fullstack Developer", "Web Developer", "Mobile Developer"]
  bio: string
  cvButton: string          // "View CV"
}

export interface AboutMessages {
  sectionLabel: string      // "Who am I?"
  sectionTitle: string      // "About Me"
  skillsHeading: string     // "My Skills"
  experienceBadge: string   // "6+ Years of Experience"
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
      freelanceValue: string // "Available" / "Disponible"
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
  sectionLabel: string      // "What I Do"
  sectionTitle: string      // "My Services"
  modal: {
    closeAriaLabel: string
  }
}

export interface PortfolioMessages {
  sectionLabel: string      // "My Work"
  sectionTitle: string      // "Portfolio"
  modal: {
    closeAriaLabel: string
    clientLabel: string     // "Client"
    categoryLabel: string   // "Category"
    dateLabel: string       // "Date"
    liveLinkText: string    // "View Live Project →"
  }
}

export interface ContactMessages {
  sectionLabel: string      // "Get In Touch"
  sectionTitle: string      // "Contact Me"
  phone: string
  email: string
  location: string
  form: {
    namePlaceholder: string
    nameLabel: string
    emailPlaceholder: string
    emailLabel: string
    messagePlaceholder: string
    messageLabel: string
    submitButton: string
  }
}

export interface CommonMessages {
  themeToggle: {
    dark: string
    light: string
  }
  langToggle: {
    switchToEs: string   // "Español"
    switchToEn: string   // "English"
  }
  closeModal: string     // "Close"
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

/**
 * Extract the locale segment from the current URL path.
 * /en/... → 'en'   /es/... → 'es'   fallback → 'en'
 */
export function getLang(url: URL): Locale {
  const [, segment] = url.pathname.split('/')
  return (segment === 'es' ? 'es' : 'en') satisfies Locale
}

/**
 * Return the typed Messages object for the given locale.
 * Import is static — both files are bundled; no dynamic imports.
 */
export function getTranslation(lang: Locale): Messages

/**
 * Build hreflang alternate URL pairs for a given canonical path.
 * path should be the locale-agnostic path segment, e.g. '' for index.
 */
export interface AlternateLink {
  hreflang: 'en' | 'es' | 'x-default'
  href: string
}
export function getAlternates(siteBase: string, path?: string): AlternateLink[]
// Returns:
// [
//   { hreflang: 'en',       href: 'https://davshn.dev/en/' },
//   { hreflang: 'es',       href: 'https://davshn.dev/es/' },
//   { hreflang: 'x-default', href: 'https://davshn.dev/en/' },
// ]
```

---

### `src/i18n/messages/en.json` — Key Schema

```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "service": "Services",
    "portfolio": "Portfolio",
    "contact": "Contact"
  },
  "hero": {
    "greeting": "Hello, I'm",
    "typedStrings": ["Fullstack Developer", "Web Developer", "Mobile Developer"],
    "bio": "Fullstack Developer based in Colombia, over 6 years of professional experience.",
    "cvButton": "View CV"
  },
  "about": {
    "sectionLabel": "Who am I?",
    "sectionTitle": "About Me",
    "skillsHeading": "My Skills",
    "experienceBadge": "6+ Years of Experience",
    "seeMoreButton": "See More",
    "modal": {
      "tabs": {
        "personal": "Personal Info",
        "achievements": "Achievements",
        "experience": "Experience",
        "education": "Education"
      },
      "personal": {
        "heading": "Personal Information",
        "fullName": "Full Name",
        "location": "Location",
        "phone": "Phone",
        "email": "Email",
        "languages": "Languages",
        "discord": "Discord",
        "freelance": "Freelance",
        "freelanceValue": "Available"
      },
      "achievements": {
        "heading": "Achievements",
        "yearsLabel": "Years Experience",
        "projectsLabel": "Completed Projects",
        "customersLabel": "Happy Customers"
      },
      "experience": { "heading": "Work Experience" },
      "education": { "heading": "Education" }
    }
  },
  "service": {
    "sectionLabel": "What I Do",
    "sectionTitle": "My Services",
    "modal": { "closeAriaLabel": "Close modal" }
  },
  "portfolio": {
    "sectionLabel": "My Work",
    "sectionTitle": "Portfolio",
    "modal": {
      "closeAriaLabel": "Close modal",
      "clientLabel": "Client",
      "categoryLabel": "Category",
      "dateLabel": "Date",
      "liveLinkText": "View Live Project →"
    }
  },
  "contact": {
    "sectionLabel": "Get In Touch",
    "sectionTitle": "Contact Me",
    "phone": "Phone",
    "email": "Email",
    "location": "Location",
    "form": {
      "nameLabel": "Name",
      "namePlaceholder": "Your name",
      "emailLabel": "Email",
      "emailPlaceholder": "your@email.com",
      "messageLabel": "Message",
      "messagePlaceholder": "Your message...",
      "submitButton": "Send Message"
    }
  },
  "common": {
    "themeToggle": { "dark": "Dark", "light": "Light" },
    "langToggle": { "switchToEs": "Español", "switchToEn": "English" },
    "closeModal": "Close"
  }
}
```

`es.json` mirrors this exact key structure with Spanish values.

---

### `astro.config.mjs` — i18n Config Object

```js
export default defineConfig({
  site: "https://davshn.dev",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
})
```

`prefixDefaultLocale: true` means both `/en` and `/es` are explicit URL prefixes. `redirectToDefaultLocale: true` means a request to `/` is automatically redirected to `/en` by Astro's middleware — no manual redirect rule required.

---

### `src/pages/[lang]/index.astro` — `getStaticPaths`

```typescript
import type { Locale } from '../../i18n/utils'

export function getStaticPaths() {
  return [
    { params: { lang: 'en' } },
    { params: { lang: 'es' } },
  ]
}

// In frontmatter:
const { lang } = Astro.params as { lang: Locale }
const t = getTranslation(lang)
const alternates = getAlternates(Astro.site?.origin ?? 'https://davshn.dev')
```

The `Astro.params.lang` value is guaranteed to be `'en'` or `'es'` because `getStaticPaths` only yields those two values. The cast to `{ lang: Locale }` is safe and avoids a runtime check.

---

### `src/layouts/BaseLayout.astro` — Updated Props Interface

```typescript
interface Props {
  title: string
  description: string
  canonicalUrl?: string
  ogImage?: string
  lang: Locale                      // NEW — required
  alternates?: AlternateLink[]      // NEW — optional, passed to SEO
}
```

Changes to template:
- `<html lang="en">` → `<html lang={lang}>`
- Pass `lang` and `alternates` down to `<SEO>`
- Keep existing `is:inline` no-flash theme script unchanged
- Add a new `is:inline` no-flash locale script (see LangToggle section below)

---

### `src/seo/SEO.astro` — Updated Props Interface

```typescript
interface Props {
  title: string
  description: string
  canonicalUrl: string
  ogImage?: string
  ogType?: 'website' | 'article'
  lang?: Locale                  // NEW
  alternates?: AlternateLink[]   // NEW
}
```

New template addition (after the canonical link):
```astro
{alternates?.map((alt) => (
  <link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
))}
```

---

### `src/seo/jsonld.ts` — Updated Signatures

```typescript
export function buildPersonSchema(lang: Locale): Record<string, unknown>
// Adds: inLanguage: lang === 'es' ? 'es-CO' : 'en-US'
// Adds: description: lang-specific description string

export function buildWebSiteSchema(url: string, lang: Locale): Record<string, unknown>
// Adds: inLanguage: lang === 'es' ? 'es-CO' : 'en-US'
// Changes: description to locale-specific string
```

---

### `src/components/ui/LangToggle.astro`

Props interface:
```typescript
interface Props {
  lang: Locale
}
```

Template structure:
```astro
---
import type { Locale } from '../../i18n/utils'
import { getTranslation } from '../../i18n/utils'

const { lang } = Astro.props as { lang: Locale }
const t = getTranslation(lang)
---
<div class="lang-toggle">
  <a
    href="/en"
    class:list={['lang-btn', { active: lang === 'en' }]}
    aria-label={t.common.langToggle.switchToEn}
  >EN</a>
  <span class="lang-divider">|</span>
  <a
    href="/es"
    class:list={['lang-btn', { active: lang === 'es' }]}
    aria-label={t.common.langToggle.switchToEs}
  >ES</a>
</div>

<script is:inline>
  ;(function () {
    const stored = localStorage.getItem('portfolio-lang')
    const pathLang = window.location.pathname.split('/')[1]
    if (stored && stored !== pathLang && (stored === 'en' || stored === 'es')) {
      window.location.replace('/' + stored)
    }
  })()
</script>
```

When the user clicks EN or ES, the page navigates to `/en` or `/es`. A separate click handler (in a `<script>` tag) writes the chosen locale to `localStorage.setItem('portfolio-lang', chosen)`. The `is:inline` script above handles auto-redirect on page load if stored preference differs from current URL segment.

The full click-handler script (not `is:inline` — uses module):
```astro
<script>
  document.querySelectorAll<HTMLAnchorElement>('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chosen = btn.getAttribute('href')?.replace('/', '') ?? 'en'
      localStorage.setItem('portfolio-lang', chosen)
    })
  })
</script>
```

---

### Sidebar.astro — Updated Props and Nav

```typescript
interface Props {
  lang: Locale
}
```

Nav labels sourced from `t.nav.*` instead of hardcoded strings. `ThemeToggle` remains a React island (`client:visible`). `LangToggle` is added below `ThemeToggle`:

```astro
<LangToggle lang={lang} />
```

---

### Section Component Props Additions

Each section component gains `lang: Locale` as a required prop. For React islands, `lang` is passed directly as a JSX prop.

| Component | New prop signature addition |
|---|---|
| `Hero.astro` | `interface Props { lang: Locale }` |
| `TypedHero.tsx` | `interface Props { strings: string[] }` — replaces hardcoded array |
| `About.astro` | `interface Props { lang: Locale }` |
| `AboutIsland.tsx` | `interface Props { experience: Experience[]; education: Education[]; lang: Locale }` |
| `AboutModal.tsx` | `interface Props { isOpen: boolean; onClose: () => void; experience: Experience[]; education: Education[]; lang: Locale }` |
| `Service.astro` | `interface Props { lang: Locale }` |
| `ServiceCards.tsx` | `interface Props { services: ServiceItem[]; lang: Locale }` |
| `Portfolio.astro` | `interface Props { lang: Locale }` |
| `PortfolioCarousel.tsx` | `interface Props { projects: Project[]; lang: Locale }` |
| `Contact.astro` | `interface Props { lang: Locale }` |
| `ContactForm.tsx` | `interface Props { lang: Locale }` |

React island components receive a `messages` prop (their relevant namespace slice) rather than the full `Messages` object, to keep prop surfaces narrow:

```typescript
// ServiceCards.tsx
interface Props {
  services: ServiceItem[]
  messages: ServiceMessages   // only the service namespace
}

// PortfolioCarousel.tsx
interface Props {
  projects: Project[]
  messages: PortfolioMessages
}

// ContactForm.tsx
interface Props {
  messages: ContactMessages
}

// AboutIsland.tsx
interface Props {
  experience: Experience[]
  education: Education[]
  messages: AboutMessages
}

// AboutModal.tsx
interface Props {
  isOpen: boolean
  onClose: () => void
  experience: Experience[]
  education: Education[]
  messages: AboutMessages
}
```

The parent `.astro` component resolves `const t = getTranslation(lang)` and passes `t.service` / `t.portfolio` / etc. to the island — no `lang` string crosses the island boundary. This avoids islands re-resolving translations client-side, keeping translation logic entirely at build time.

---

### Content Collection `lang` Field

```typescript
// src/content/config.ts
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    category: z.string(),
    date: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    thumbnail: z.string(),
    liveUrl: z.string().url().optional(),
    order: z.number(),
    lang: z.enum(['en', 'es']),   // NEW — required
  }),
})

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    shortDescription: z.string(),
    icon: z.string().optional(),
    order: z.number(),
    lang: z.enum(['en', 'es']),   // NEW — required
  }),
})
```

Query pattern in `Service.astro` and `Portfolio.astro`:
```typescript
const all = await getCollection('services')
const services = all
  .filter((e) => e.data.lang === lang)
  .sort((a, b) => a.data.order - b.data.order)
  .map((e) => ({ ... }))
```

Note: Astro Content Collections use the relative file path as the `id`. With the subdirectory structure, an entry's `id` becomes `en/mento` instead of `mento`. Any component that compares by `entry.id` must be updated to strip the locale prefix or rely on a stable slug field instead.

---

### Content File Frontmatter (ES Example)

```markdown
---
title: "Mento"
client: "Mento S.A"
category: "Aplicación Fintech Móvil"
date: "2023"
description: "Mento es una fintech chilena enfocada en préstamos personales. Construí la app móvil desde cero — la app cubre el ciclo completo del préstamo: solicitud, flujo de aprobación, seguimiento del desembolso y gestión de pagos."
stack: ["React Native", "Redux", "Redux Saga", "React Navigation", "Node.js", "Express", "PostgreSQL"]
thumbnail: "/assets/portfolio-mento.jpg"
liveUrl: "https://www.mento.cl/"
order: 3
lang: "es"
---
```

Stack tech names remain in English (they are proper nouns).

---

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | `getLang(url)` returns correct locale for `/en`, `/es`, and fallback paths | Vitest unit test (no DOM needed — pure function) |
| Unit | `getTranslation('en')` and `getTranslation('es')` return all required keys | Type check at compile time via `satisfies Messages`; runtime test to verify no undefined nested values |
| Unit | `getAlternates(base)` returns correct `hreflang` and `href` values | Vitest unit test |
| Integration | `astro build` produces `/en/index.html` and `/es/index.html` | Run `astro build` in CI; check output directory |
| Integration | Both HTML files contain correct `<html lang>` attribute | Grep build output |
| Integration | Both HTML files contain `<link rel="alternate" hreflang>` for `en`, `es`, `x-default` | Grep build output |
| E2E | Language toggle persists locale in `localStorage` and auto-redirects on revisit | Playwright: navigate to `/en`, click ES toggle, reload, assert URL is `/es` |
| E2E | All visible text on `/es` is in Spanish (no English fallback strings) | Playwright: navigate to `/es`, assert key strings match expected Spanish values |

Note: The project currently has no test runner configured (per `context.md`). Unit tests require installing Vitest. E2E tests require Playwright. If no testing infrastructure is added in this change, the testing phase should focus on manual build verification and browser testing of the toggle behaviour.

---

## Migration / Rollout

**Content file migration**: Existing flat content files in `src/content/projects/` and `src/content/services/` must be moved into `en/` subdirectories and given `lang: en` in frontmatter before the Spanish files are created. This is a breaking rename — do it in a single commit so there is no intermediate state where both the old flat files and new `en/` files coexist (Astro would see duplicate content IDs).

**Entry ID change**: Moving `mento.md` to `en/mento.md` changes the Astro content entry `id` from `mento` to `en/mento`. The `ServiceCards.tsx` `SERVICE_ICONS` record key uses the raw entry `id` (`'development-as-service'` etc.). These keys will break. Two options:
1. Strip the locale prefix when mapping: `entry.id.replace(/^(en|es)\//, '')`
2. Add a stable `slug` field to the content schema and use that as the icon key.
**Chosen**: Option 1 — strip the prefix in the `.astro` mapping layer before passing to the React island, keeping `ServiceCards.tsx`'s `SERVICE_ICONS` map unchanged.

**No database migrations required.** No external service changes required. `@emailjs/browser` contact form is unaffected.

---

## Open Questions

- [ ] **`Astro.currentLocale` vs. prop drilling**: Astro 5.x exposes `Astro.currentLocale` in `.astro` components when i18n routing is active. If this is reliable across all component contexts (including those used inside `client:only` render trees), it could replace prop drilling in `.astro` components — but not in React islands. Verify whether `Astro.currentLocale` is available in nested `.astro` components; if so, only React islands need an explicit `messages` prop.
- [ ] **`designed_from_proposal_only`**: Specs were not yet available when this design was written. The design was derived from the proposal. Once specs are generated, reconcile the following before proceeding to tasks: (a) confirmation of the `lang` field + subdirectory dual-key strategy for content collections; (b) confirmation that `messages` namespace slices (not full `Messages`) are the right prop surface for islands; (c) exact Spanish copy for all message keys in `es.json`.
- [ ] **`portfolio-lang` vs. `i18n-lang` localStorage key**: The proposal specifies `portfolio-lang` as the localStorage key. Confirm this does not conflict with any existing key (current keys in use: `theme-color`).
- [ ] **Entry ID collision prevention**: With subdirectory structure, Astro's content layer derives IDs from the file path. Confirm that `en/mento` and `es/mento` do not cause a slug collision within the `projects` collection (they should not, since the IDs are distinct).
- [ ] **`client:only="react"` vs. `client:visible` on About island**: `AboutIsland` currently uses `client:only="react"`. With the `messages` prop passed from Astro, this remains fine (Astro serializes the prop at build time). No change needed, but confirm that passing a large `messages` object does not cause prop serialisation issues (likely under 2KB).
