# Design: Portfolio Replication (Next.js → Astro 5 + React 19 + Tailwind)

## Technical Approach

The site is a single-page Astro application. Static structure is written in `.astro` components; interactive features (typed animation, modals, carousel, contact form, custom cursor, scroll-to-top, theme toggle) are React islands. Content is extracted into Astro Content Collections before any component is written, so every component receives typed, schema-validated data rather than hardcoded strings. Tailwind is configured with explicit design tokens matching the CLAUDE.md palette and type scale; `@astrojs/tailwind` is added to `astro.config.mjs`. Because specs are not yet finalized, this design is derived from `proposal.md` and CLAUDE.md directly — reconciliation with specs is noted in Open Questions.

---

## Architecture Decisions

### Decision: Astro islands strategy — client:load vs client:visible

**Choice**: `client:load` for CustomCursor and TypedHero (above-the-fold, immediately visible on paint); `client:visible` for all other interactive islands (AboutModal, ServiceCards, PortfolioCarousel, ContactForm, ScrollToTop).

**Alternatives considered**: `client:only="react"` for all interactive components (removes SSR entirely); `client:idle` for below-fold islands.

**Rationale**: CustomCursor must be active before the first user interaction, and TypedHero is the first content a visitor sees — both need to hydrate immediately. Every other island is below the fold or triggered by user action; deferring hydration to visibility reduces main-thread blocking during initial load and keeps LCP < 2.5s.

---

### Decision: Tailwind v4 CSS-first configuration (no tailwind.config.mjs)

**Choice**: Tailwind v4 is currently shipping as the default in new Astro 5 scaffolds. Design tokens are defined via CSS custom properties in `src/styles/global.css` using the `@theme` directive, not via `tailwind.config.mjs`.

**Alternatives considered**: Tailwind v3 with `tailwind.config.mjs` (proposal referenced this file); reverting to v3 via explicit pin.

**Rationale**: The project scaffold uses Astro 5.x released in late 2024 / 2025 — `@astrojs/tailwind` no longer ships separately for v4; Tailwind CSS v4 is installed as `tailwindcss` and `@tailwindcss/vite`. Using the CSS-first approach is idiomatic for this stack. If Tailwind v3 is actually installed, the `tailwind.config.mjs` path applies instead — this is flagged in Open Questions.

---

### Decision: Theme system via body class + localStorage

**Choice**: A small inline `<script>` in `BaseLayout.astro` reads `localStorage.getItem("theme-color")` synchronously before first paint and sets the body class (`theme-light` or `theme-dark`). The `ThemeToggle` React island writes to `localStorage` and toggles the class on user interaction.

**Alternatives considered**: CSS `prefers-color-scheme` media query only (no persistence); Nanostores or Zustand for theme state.

**Rationale**: An inline blocking script prevents flash of wrong theme (FOWT). No global state store is needed — the theme is a single string persisted in `localStorage` and reflected as a body class; any component can read or set it directly. This matches the original portfolio's pattern exactly.

---

### Decision: Content Collections for all structured data

**Choice**: Five collections — `projects`, `services`, `skills`, `experience`, `education` — each with a Zod schema in `src/content/config.ts`. Projects and services use Markdown/MDX entries in subdirectories. Skills, experience, and education use JSON data files.

**Alternatives considered**: Hardcode content directly in `.astro` components; use a single `data.ts` file exporting typed constants.

**Rationale**: Content Collections provide Zod validation at build time, IDE autocomplete, and clear separation of content from markup. This is the CLAUDE.md-mandated pattern for this project. JSON files (not `.md`) are used for skills/experience/education because these entries have no prose body — only structured fields.

---

### Decision: react-modal + react-slick compatibility with React 19

**Choice**: Pin `react-modal` to `^3.16.1` and `react-slick` to `^0.30.3`. Wrap both in a compatibility shim (`ReactDOM.createPortal` for modals, manual `ref` forwarding for slick) if runtime warnings appear. Test each island in isolation before composing the page.

**Alternatives considered**: Replace react-modal with Radix UI Dialog; replace react-slick with Embla Carousel (both React 19-native).

**Rationale**: The proposal explicitly requires replicating the original portfolio's library stack. Replacing libraries changes visual behavior and is out of scope. Compatibility shims are minimal and isolated to the island component. If either library is confirmed broken at install time, substitution becomes the fallback — noted in Open Questions.

---

### Decision: AOS initialization via client-side script

**Choice**: Initialize AOS inside a `<script>` tag in `BaseLayout.astro` using `document.addEventListener("DOMContentLoaded", () => AOS.init({ duration: 1200, once: true }))`.

**Alternatives considered**: Initialize AOS inside each island's `useEffect`; use a dedicated `AOSInit.tsx` React island.

**Rationale**: AOS must run after the DOM is ready but does not need React. A plain `<script>` tag in the layout is the lightest approach and avoids hydration cost. Astro renders this script on every page automatically via the layout.

---

### Decision: react-scrollspy-nav maintenance risk mitigation

**Choice**: Attempt installation first. If the package is broken under React 19 or ESM, replace it with a custom `useScrollspy` hook (IntersectionObserver, ~30 lines) inside `Sidebar.astro`'s `<script>` or a small React island.

**Alternatives considered**: Use the npm package regardless; implement scrollspy from scratch immediately without attempting the package.

**Rationale**: The package has not been updated recently. The fallback is straightforward and well-scoped. Attempting the package first avoids unnecessary custom code if it works.

---

### Decision: EmailJS environment variables

**Choice**: Read `import.meta.env.PUBLIC_EMAILJS_SERVICE_ID`, `PUBLIC_EMAILJS_TEMPLATE_ID`, and `PUBLIC_EMAILJS_PUBLIC_KEY` in `ContactForm.tsx`. Provide a `.env.example` file. Form renders but disables submit if vars are absent.

**Alternatives considered**: Hard-code IDs in the component (insecure, not configurable); use server-side API route (out of scope — no backend).

**Rationale**: Astro exposes `PUBLIC_` prefixed variables to the client at build time. This is the idiomatic Astro approach. Graceful degradation prevents a broken form in local dev without credentials.

---

## Data Flow

### Theme toggle

```
BaseLayout <script> ──→ reads localStorage("theme-color")
                    ──→ sets document.body.classList (theme-light | theme-dark)

ThemeToggle.tsx (client:visible)
    │  user clicks
    ▼
toggles body class ──→ writes localStorage("theme-color")
```

### Content to component

```
src/content/config.ts (Zod schema)
    │  build time
    ▼
getCollection("projects") in Portfolio.astro
    │
    ▼
props ──→ PortfolioCarousel.tsx (client:visible)
              │  user opens modal
              ▼
          ProjectModal (react-modal portal)
```

### Contact form submission

```
ContactForm.tsx
    │  user fills form, clicks submit
    ▼
@emailjs/browser.sendForm(serviceId, templateId, formRef, publicKey)
    │  success
    ▼
react-toastify toast("Message Sent Successfully!")
    │  failure
    ▼
react-toastify toast("Ops Message Not Sent!")
```

### Page render (Astro SSG)

```
src/pages/index.astro
    └── BaseLayout.astro
          ├── SEO.astro (meta, OG, canonical)
          ├── JSON-LD <script type="application/ld+json">
          ├── global.css (Poppins, design tokens)
          ├── AOS <script>
          ├── CustomCursor.tsx        [client:load]
          ├── Sidebar.astro
          │     └── ThemeToggle.tsx   [client:visible]
          ├── Hero.astro
          │     └── TypedHero.tsx     [client:load]
          ├── About.astro
          │     └── AboutModal.tsx    [client:visible]
          ├── Service.astro
          │     └── ServiceCards.tsx  [client:visible]
          ├── Portfolio.astro
          │     └── PortfolioCarousel.tsx [client:visible]
          ├── Contact.astro
          │     └── ContactForm.tsx   [client:visible]
          └── ScrollToTop.tsx         [client:visible]
```

---

## File Changes

| File | Action | Description |
|---|---|---|
| `src/pages/index.astro` | Modify | Replace placeholder with `<BaseLayout>` wrapping all section components |
| `src/layouts/BaseLayout.astro` | Create | Layout shell: SEO, JSON-LD, global CSS, AOS init script, ToastContainer mount, CustomCursor island |
| `src/components/layout/Sidebar.astro` | Create | Fixed 320px sidebar, scrollspy nav, hamburger toggle, ThemeToggle island slot |
| `src/components/layout/ThemeToggle.tsx` | Create | React island: toggles body class and localStorage; FaMoon/FaSun icons |
| `src/components/layout/CustomCursor.tsx` | Create | React island (client:load): wraps react-animated-cursor with exact config values |
| `src/components/sections/Hero.astro` | Create | Hero section static shell; slots in TypedHero island, social icons, Download CV button |
| `src/components/sections/TypedHero.tsx` | Create | React island (client:load): react-typed with exact speed/delay/strings config |
| `src/components/sections/About.astro` | Create | About section shell: bio, skill bars from collection, about photo, badge; AboutModal island |
| `src/components/sections/AboutModal.tsx` | Create | React island (client:visible): react-modal with Personal Info / Achievements / Experience / Education tabs |
| `src/components/sections/Service.astro` | Create | Service section shell: renders ServiceCards island with service collection data as props |
| `src/components/sections/ServiceCards.tsx` | Create | React island (client:visible): 4 tilt cards (react-parallax-tilt) + ServiceModal (react-modal) |
| `src/components/sections/Portfolio.astro` | Create | Portfolio section shell: passes project collection data to PortfolioCarousel island |
| `src/components/sections/PortfolioCarousel.tsx` | Create | React island (client:visible): react-slick carousel, react-tooltip on thumbnails, ProjectModal (react-modal) |
| `src/components/sections/Contact.astro` | Create | Contact section shell: address cards, Google Maps iframe, ContactForm island |
| `src/components/sections/ContactForm.tsx` | Create | React island (client:visible): EmailJS form, react-toastify notifications |
| `src/components/ui/Button.astro` | Create | Reusable button primitive: border/radius/hover tokens |
| `src/components/ui/Badge.astro` | Create | Badge primitive used in About section |
| `src/components/ui/ProgressBar.astro` | Create | Skill progress bar: name + percentage, styled with design tokens |
| `src/components/ui/ScrollToTop.tsx` | Create | React island (client:visible): appears after 500px scroll, smooth scroll to top |
| `src/content/config.ts` | Create | Zod schemas for projects, services, skills, experience, education collections |
| `src/content/projects/mento.md` | Create | Mento project entry |
| `src/content/projects/metro-delivery.md` | Create | Metro Delivery project entry |
| `src/content/projects/mingga.md` | Create | Mingga project entry |
| `src/content/services/development-as-service.md` | Create | Service 1 entry |
| `src/content/services/custom-software.md` | Create | Service 2 entry |
| `src/content/services/vulnerability-scan.md` | Create | Service 3 entry |
| `src/content/services/mobile-app-development.md` | Create | Service 4 entry |
| `src/content/skills.json` | Create | Array of `{ name: string, percent: number }` |
| `src/content/experience.json` | Create | Array of work experience entries |
| `src/content/education.json` | Create | Array of education entries |
| `src/seo/SEO.astro` | Create | `<title>`, `<meta description>`, canonical, OG tags — receives props from layout |
| `src/seo/jsonld.ts` | Create | `buildPersonSchema()` and `buildWebSiteSchema()` returning JSON-LD objects |
| `src/styles/global.css` | Create | Poppins @import, `@theme` block (Tailwind v4) or CSS custom properties, base resets |
| `src/env.d.ts` | Modify | Add `/// <reference types="astro/client" />` if missing; add EmailJS env var type declarations |
| `astro.config.mjs` | Modify | Add `@tailwindcss/vite` plugin (Tailwind v4) or `@astrojs/tailwind` integration (v3); verify react integration present |
| `package.json` | Modify | Add all third-party dependencies listed in CLAUDE.md Library Reference |
| `public/og-image.jpg` | Create | OG image placeholder (1200×630) |
| `public/robots.txt` | Create | `User-agent: * / Allow: /` |
| `public/cv.pdf` | Create | CV PDF placeholder (real file added before deploy) |
| `.env.example` | Create | Documents `PUBLIC_EMAILJS_SERVICE_ID`, `PUBLIC_EMAILJS_TEMPLATE_ID`, `PUBLIC_EMAILJS_PUBLIC_KEY` |

---

## Interfaces / Contracts

### Content Collection schemas (`src/content/config.ts`)

```ts
import { defineCollection, z } from 'astro:content'

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    category: z.string(),
    date: z.string(),
    liveUrl: z.string().url().optional(),
    stack: z.array(z.string()),
    thumbnail: z.string(), // path relative to src/assets/
    order: z.number(),
  }),
})

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    icon: z.string(),           // icon identifier string
    shortDescription: z.string(),
    order: z.number(),
  }),
})

// skills.json — no collection needed, imported directly
export interface Skill {
  name: string
  percent: number
}

// experience.json
export interface Experience {
  period: string
  role: string
  company: string
}

// education.json
export interface Education {
  year: string
  degree: string
  institution: string
}

export const collections = { projects, services }
```

### SEO component props (`src/seo/SEO.astro`)

```ts
interface Props {
  title: string
  description: string
  canonicalUrl: string
  ogImage?: string
  ogType?: 'website' | 'article'
}
```

### BaseLayout props (`src/layouts/BaseLayout.astro`)

```ts
interface Props {
  title: string
  description: string
  canonicalUrl?: string // defaults to Astro.url.href
  ogImage?: string      // defaults to '/og-image.jpg'
}
```

### JSON-LD helpers (`src/seo/jsonld.ts`)

```ts
export function buildPersonSchema(): Record<string, unknown>
export function buildWebSiteSchema(url: string): Record<string, unknown>
```

### ThemeToggle (`src/components/layout/ThemeToggle.tsx`)

```ts
// No props — reads/writes document.body.classList and localStorage directly
export default function ThemeToggle(): JSX.Element
```

### TypedHero (`src/components/sections/TypedHero.tsx`)

```ts
// No props — strings are hardcoded per CLAUDE.md spec
export default function TypedHero(): JSX.Element
```

### ServiceCards props

```ts
interface ServiceItem {
  id: string
  title: string
  icon: string
  shortDescription: string
  body: string // rendered MDX/MD body
}

interface Props {
  services: ServiceItem[]
}
```

### PortfolioCarousel props

```ts
interface Project {
  id: string
  title: string
  client: string
  category: string
  date: string
  liveUrl?: string
  stack: string[]
  thumbnail: string
  body: string
}

interface Props {
  projects: Project[]
}
```

---

## Testing Strategy

No test runner is present in the project (confirmed in context.md). Testing is out of scope for this change per the proposal. Manual verification against the success criteria in `proposal.md` is the acceptance gate.

| Layer | What to Test | Approach |
|---|---|---|
| Manual — build | Zero TypeScript errors, zero lint errors | `npm run build` + `npm run lint` |
| Manual — visual | All 5 sections render in light and dark themes | Browser inspection in dev and preview |
| Manual — interactions | Typed animation, modals, carousel, form, scroll-to-top, scrollspy | Browser interaction walkthrough |
| Manual — SEO | Title, description, canonical, OG tags, JSON-LD present | View source / browser devtools |
| Manual — responsive | Sidebar mobile slide-in, carousel 1-item mobile, font size 16px | Browser responsive mode at <1199px and <575px |

---

## Migration / Rollout

No data migration required. The project is a fresh Astro scaffold. The single existing file (`src/pages/index.astro`) is modified in-place. All other files are created. Rollback is a `git clean + git checkout` as described in the proposal.

---

## Open Questions

- [ ] **Tailwind version**: Confirm whether the scaffold installed Tailwind v3 (requires `tailwind.config.mjs` + `@astrojs/tailwind`) or Tailwind v4 (requires `@tailwindcss/vite` + CSS `@theme` directive). The design assumes v4; if v3, the config file path and token structure differ.
- [ ] **react-scrollspy-nav compatibility**: Verify at install time whether the package installs and runs without error under React 19. If broken, the fallback IntersectionObserver implementation must be written.
- [ ] **react-modal / react-slick React 19 runtime warnings**: Confirm at install time. If `ReactDOM.render` deprecation errors appear, evaluate whether compatibility shims are sufficient or library substitution is needed.
- [ ] **Specs reconciliation**: This design was derived from `proposal.md` and CLAUDE.md only — specs were not yet available when the design phase ran. Before generating tasks, the specs artifact must be reviewed and any conflicts with this design document resolved.
- [ ] **Image assets**: Hero photo, about photo, and 3 portfolio thumbnails are not in the repository. Tasks should use placeholder images (e.g. `public/placeholder-*.jpg`) during development. The owner must supply real assets before production deploy.
- [ ] **Tailwind integration approach for `astro.config.mjs`**: The current config only registers `@astrojs/react`. The Tailwind integration must be added. Confirm which Tailwind adapter is correct for the installed version before the apply phase.
