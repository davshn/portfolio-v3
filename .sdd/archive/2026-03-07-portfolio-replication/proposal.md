# Proposal: Portfolio Replication (Next.js → Astro 5 + React 19 + Tailwind)

## Intent

The existing portfolio was built in Next.js/React. The new codebase has been scaffolded with Astro 5, React 19, TypeScript (strict), and Tailwind CSS, but contains only a blank placeholder page. This change replicates all content, design, and interactivity of the original portfolio into the new tech stack, preserving every section, visual detail, and third-party library integration while following the architecture rules defined in CLAUDE.md.

## Scope

### In Scope
- `src/pages/index.astro` — single-page entry point with full SEO, JSON-LD, and canonical URL via BaseLayout
- `src/layouts/BaseLayout.astro` — layout injecting SEO component, structured data, and global styles
- `src/components/layout/Sidebar.astro` — fixed left sidebar with scrollspy nav, dark/light theme toggle, hamburger for mobile
- `src/components/sections/Hero.astro` — photo, typed role titles (React island), bio, social icons, Download CV button
- `src/components/sections/About.astro` — bio text, skill progress bars, about photo, "See More" modal (React island)
- `src/components/sections/Service.astro` — 4 cards with parallax tilt, each opening a detail modal (React island)
- `src/components/sections/Portfolio.astro` — carousel (react-slick, 3/1 responsive), each item with tooltip and detail modal (React island)
- `src/components/sections/Contact.astro` — address cards, EmailJS contact form (React island), embedded Google Maps
- `src/components/ui/` — reusable primitives: Button, Badge, Icon, Modal, ProgressBar, ThemeToggle
- `src/content/` — Astro Content Collections with Zod schemas for: projects (portfolio), services, skills, experience, education
- `src/seo/` — SEO component, JSON-LD helpers (Person schema + WebSite schema), OG tag utilities
- `src/styles/` — global CSS with Poppins font import, design tokens (colors, typography scale matching CLAUDE.md spec)
- `src/assets/` — all images (hero photo, about photo, portfolio thumbnails) processed via astro:assets
- `public/` — favicon, CV PDF, OG image, robots.txt
- Theme system — `theme-light` / `theme-dark` body classes persisted to `localStorage` under key `theme-color`
- All third-party libraries installed and integrated: react-animated-cursor, react-typed, react-parallax-tilt, aos, react-slick + slick-carousel, react-modal, react-tooltip, react-scrollspy-nav, react-toastify, react-icons, @emailjs/browser
- Full TypeScript strict typing across all components and content schemas
- Tailwind design system matching the exact color palette, typography, and spacing from CLAUDE.md

### Out of Scope
- Backend API or server-side functionality (EmailJS handles email with no backend)
- CMS integration (content lives in Astro Content Collections)
- Blog or additional pages beyond the single-page portfolio
- Automated test suite (no test runner detected in project)
- CI/CD pipeline configuration
- Analytics integration
- i18n / multi-language support
- Performance benchmarking beyond hitting LCP < 2.5s and CLS < 0.1 targets

## Approach

Build the site section by section, starting with the layout shell (BaseLayout + Sidebar), then each section component in page order (Hero → About → Service → Portfolio → Contact). Static structure uses `.astro` components; interactive features (typed text, modals, carousel, contact form, custom cursor, theme toggle) are React islands with `client:visible` (or `client:load` for above-the-fold elements like the cursor and hero typed text). Content is extracted into Astro Content Collections before components are written, so components consume typed data rather than hardcoded strings. The SEO layer (SEO component + JSON-LD Person schema) is wired into BaseLayout first so every render is SEO-complete from the start. Tailwind is configured with design tokens matching the exact palette and type scale from CLAUDE.md; no arbitrary values.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/pages/index.astro` | Modified | Replace placeholder with full single-page layout using BaseLayout and all section components |
| `src/layouts/BaseLayout.astro` | New | Global layout with SEO component, JSON-LD, canonical URL, global style imports, ToastContainer |
| `src/components/layout/Sidebar.astro` | New | Fixed 320px left sidebar with scrollspy nav, theme toggle, mobile hamburger |
| `src/components/sections/Hero.astro` | New | Hero section shell; TypedHero.tsx React island for animated text |
| `src/components/sections/About.astro` | New | About section shell; AboutModal.tsx React island for "See More" modal |
| `src/components/sections/Service.astro` | New | Service cards shell; ServiceModal.tsx React island for detail modals with tilt |
| `src/components/sections/Portfolio.astro` | New | Portfolio shell; PortfolioCarousel.tsx React island for carousel + modals |
| `src/components/sections/Contact.astro` | New | Contact shell; ContactForm.tsx React island for EmailJS form |
| `src/components/ui/` | New | Button, Badge, Icon, Modal, ProgressBar, ThemeToggle, ScrollToTop primitives |
| `src/components/layout/CustomCursor.tsx` | New | React island (client:load, ssr:false) wrapping react-animated-cursor |
| `src/content/config.ts` | New | Zod schemas for projects, services, skills, experience, education collections |
| `src/content/projects/` | New | 3 portfolio project entries (Mento, Metro Delivery, Mingga) |
| `src/content/services/` | New | 4 service entries |
| `src/content/skills.json` | New | Skill name → percentage data |
| `src/content/experience.json` | New | Work experience entries |
| `src/content/education.json` | New | Education entries |
| `src/seo/SEO.astro` | New | Meta tags, OG tags, canonical URL component |
| `src/seo/jsonld.ts` | New | JSON-LD Person and WebSite schema helpers |
| `src/styles/global.css` | New | Poppins font import, CSS custom properties for design tokens, base resets |
| `tailwind.config.mjs` | New | Design system tokens: colors, font family, type scale |
| `astro.config.mjs` | Modified | Verify/add @astrojs/react, @astrojs/tailwind integrations |
| `package.json` | Modified | Add all required third-party library dependencies |
| `src/assets/` | New | Hero photo, about photo, portfolio thumbnails (3 projects) |
| `public/` | New | favicon.ico, favicon.svg, CV PDF, og-image.jpg, robots.txt |
| `src/env.d.ts` | Modified | Add global type references if needed |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| React 19 + react-modal / react-slick / react-tooltip compatibility issues | Medium | Pin library versions known to work with React 18 API surface; test each island in isolation before composing |
| react-scrollspy-nav not maintained for React 19 / ESM | Medium | Evaluate at install time; if broken, implement scrollspy manually with IntersectionObserver in ~30 lines |
| AOS scroll animations conflicting with Astro's SSR hydration (flash of unstyled content) | Low | Initialize AOS only on client via `document.addEventListener("DOMContentLoaded")` inside a `<script>` tag |
| react-animated-cursor causing SSR error in Astro | Low | Use `client:only="react"` and wrap in dynamic import with `ssr: false` equivalent |
| EmailJS service/template IDs missing from environment | Medium | Document required env vars (EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY); provide `.env.example`; form degrades gracefully if vars absent |
| Image assets not available in new repo | Medium | Placeholder images used during build; real assets added before final deploy; astro:assets handles optimization automatically |
| Tailwind v4 breaking changes vs config expectations | Low | Confirm Tailwind version in use; if v4, adapt config to new CSS-first configuration format |

## Rollback Plan

Since the project is a fresh scaffold with only a placeholder `src/pages/index.astro`, rollback is trivial:

1. `git checkout src/pages/index.astro` — restores the blank placeholder page
2. `git clean -fd src/` — removes all new source files added during this change
3. `git checkout package.json package-lock.json` — restores original dependencies
4. `npm install` — reinstalls original dependency set

All changes are isolated to the `src/` directory and `package.json`. No database, no infrastructure, no external state to revert.

## Dependencies

- Node.js ≥ 20 (ESM, already satisfied by project)
- All third-party npm packages listed in the Library Reference table in CLAUDE.md must be installed before implementation begins
- EmailJS account with a configured service, email template, and public key (env vars: `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`)
- Final image assets: hero photo, about photo, 3 portfolio thumbnail images, CV PDF — must be provided before production deploy (placeholders acceptable during development)

## Success Criteria

- [ ] `npm run build` completes with zero errors and zero TypeScript strict-mode violations
- [ ] All 5 sections render correctly in both light and dark themes; theme persists across page reload via `localStorage`
- [ ] Sidebar scrollspy updates the active nav link as the user scrolls through each section
- [ ] Hero typed animation cycles through all 3 role titles with correct speed/delay settings
- [ ] About "See More" modal opens with all 4 sub-sections (Personal Info, Achievements, Experience, Education) populated from content collections
- [ ] All 4 Service cards display parallax tilt on hover and open their respective detail modals
- [ ] Portfolio carousel shows 3 items on desktop and 1 on mobile; each item tooltip and detail modal work correctly
- [ ] Contact form submits via EmailJS and shows success/error toast notification
- [ ] Every page has unique `<title>`, `<meta name="description">`, canonical URL, OG tags, and JSON-LD Person schema
- [ ] Lighthouse mobile score: LCP < 2.5s, CLS < 0.1
- [ ] `npm run lint` passes with zero errors
