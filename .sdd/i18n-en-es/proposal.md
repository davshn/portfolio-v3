# Proposal: Bilingual i18n Support (English / Spanish)

## Intent

The portfolio currently serves all content in English only, limiting reach to Spanish-speaking clients and employers in Colombia and Latin America — the primary target market. This change adds full bilingual support (EN/ES) using Astro's built-in i18n routing so every section, UI string, and content collection is available in both languages, with locale-aware SEO metadata and a persistent language toggle.

## Scope

### In Scope

- Configure Astro built-in i18n with `defaultLocale: "en"`, `locales: ["en", "es"]`, and `routing.prefixDefaultLocale: true` so both `/en` and `/es` are explicit paths
- Redirect `/` → `/en` via a redirect rule in `astro.config.mjs`
- Create `src/i18n/messages/en.json` and `src/i18n/messages/es.json` for all UI strings (nav labels, button text, section headings, form labels, toast messages, modal close labels, theme toggle labels)
- Create `src/i18n/utils.ts` exporting `getLang(url: URL): Locale`, `getTranslation(lang: Locale): Messages`, and the `Locale` type union
- Restructure `src/pages/index.astro` → `src/pages/[lang]/index.astro` with static path generation for `["en", "es"]`
- Extend content collections to support bilingual content:
  - Projects: add parallel markdown files per locale (e.g. `projects/en/mento.md`, `projects/es/mento.md`) or add a `lang` field to the existing schema and duplicate entries — **decision deferred to specs**
  - Services: same strategy as projects
  - `skills.json`, `experience.json`, `education.json`: add translated variants as sibling JSON files (`skills.es.json`, etc.) loaded conditionally by lang
- Pass `lang` prop from `[lang]/index.astro` through all section components and React islands
- Add language toggle (EN | ES) to `Sidebar.astro` — persisted in `localStorage` under key `portfolio-lang`, with client-side redirect on change
- Update `BaseLayout.astro` to set `<html lang={lang}>` dynamically
- Update `SEO.astro` to emit `<link rel="alternate" hreflang="en|es|x-default">` tags
- Update `src/seo/jsonld.ts` to accept `lang` and emit locale-aware `description` and `inLanguage` fields in JSON-LD
- Translate all visible user-facing strings in section `.astro` components and React islands (Hero, About, Service, Portfolio, Contact)

### Out of Scope

- More than two locales (French, Portuguese, etc.) — deferred to a future `i18n-additional-locales` change
- Translation management tooling (i18next, Lingui, Crowdin) — plain JSON files are sufficient at this scale
- Right-to-left (RTL) layout support
- Automated machine translation — all Spanish copy is hand-written per CLAUDE.md domain context
- CMS integration for translations
- URL slug translation (e.g. `/es/portafolio` instead of `/es/portfolio`) — all routes stay in English

## Approach

Use **Astro built-in i18n** (`experimental.i18n` stabilized in Astro 4+, fully available in Astro 5.x):

```js
// astro.config.mjs
i18n: {
  defaultLocale: "en",
  locales: ["en", "es"],
  routing: {
    prefixDefaultLocale: true,   // /en and /es both explicit
    redirectToDefaultLocale: true // / → /en
  }
}
```

Static routes are generated in `src/pages/[lang]/index.astro` via `getStaticPaths()` returning `[{ params: { lang: "en" } }, { params: { lang: "es" } }]`.

UI strings are centralized in `src/i18n/messages/{lang}.json` and accessed via a typed `getTranslation(lang)` helper that returns a strongly-typed `Messages` object — no dynamic key lookups.

Content collections use a **locale-prefixed folder** strategy (e.g. `src/content/projects/en/`, `src/content/projects/es/`) with an added `lang` field in the Zod schema filtered at query time. This avoids duplicating collection definitions.

The language toggle is a lightweight client-side component that reads the current path, replaces the locale segment, and navigates — no full page reload framework needed. Preference is stored in `localStorage` and read on load to auto-redirect if the stored locale differs from the URL locale.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `astro.config.mjs` | Modified | Add `i18n` config block with defaultLocale, locales, routing |
| `src/pages/index.astro` | Removed / Replaced | Becomes `src/pages/[lang]/index.astro` with `getStaticPaths` |
| `src/pages/[lang]/index.astro` | New | Dynamic lang route; passes `lang` prop to all sections |
| `src/i18n/messages/en.json` | New | All English UI strings |
| `src/i18n/messages/es.json` | New | All Spanish UI strings |
| `src/i18n/utils.ts` | New | `getLang()`, `getTranslation()`, `Locale` type, `Messages` type |
| `src/layouts/BaseLayout.astro` | Modified | Accept `lang` prop; set `<html lang={lang}>` |
| `src/seo/SEO.astro` | Modified | Accept `lang` + alternate URLs; emit `hreflang` link tags |
| `src/seo/jsonld.ts` | Modified | Accept `lang`; localize `description` and add `inLanguage` |
| `src/components/layout/Sidebar.astro` | Modified | Add language toggle (EN/ES); pass `lang` from parent |
| `src/components/sections/Hero.astro` | Modified | Accept `lang`; use translated strings for bio, button text |
| `src/components/sections/About.astro` | Modified | Accept `lang`; use translated headings and modal labels |
| `src/components/sections/AboutIsland.tsx` | Modified | Accept `lang` prop; use translated UI strings from messages |
| `src/components/sections/AboutModal.tsx` | Modified | Accept `lang`; translate modal section headers and content |
| `src/components/sections/Service.astro` | Modified | Accept `lang`; load services collection filtered by `lang` |
| `src/components/sections/ServiceCards.tsx` | Modified | Accept `lang` and localized service data |
| `src/components/sections/Portfolio.astro` | Modified | Accept `lang`; load projects collection filtered by `lang` |
| `src/components/sections/PortfolioCarousel.tsx` | Modified | Accept `lang` and localized project data |
| `src/components/sections/Contact.astro` | Modified | Accept `lang`; translate section heading and address labels |
| `src/components/sections/ContactForm.tsx` | Modified | Accept `lang`; translate form labels and toast messages |
| `src/components/sections/TypedHero.tsx` | Modified | Accept `lang`; use locale-appropriate typed strings |
| `src/content/config.ts` | Modified | Add `lang` field to projects and services schemas |
| `src/content/projects/` | Modified | Restructure into `en/` and `es/` subdirectories |
| `src/content/services/` | Modified | Restructure into `en/` and `es/` subdirectories |
| `src/content/skills.es.json` | New | Spanish skill names (percents unchanged) |
| `src/content/experience.es.json` | New | Spanish role/company translations where applicable |
| `src/content/education.es.json` | New | Spanish degree/institution translations |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Content collection restructure (adding `lang` field + subdirectories) breaks existing queries | Medium | Write migration script or rename files in a single PR; keep `en/` as canonical and verify `getCollection` filters work before touching `es/` |
| `getStaticPaths` with `[lang]` segment conflicts with Astro i18n built-in routing middleware | Low | Test build output early (`astro build --dry-run`); Astro 5 supports both patterns — use `getStaticPaths` without middleware if conflict arises |
| Language toggle produces a flash of wrong locale on hydration | Medium | Read `localStorage` before first paint via inline `<script>` in `BaseLayout.astro` (same pattern as existing theme toggle) |
| Spanish copy quality (professional tone) | Low | All strings are handwritten per CLAUDE.md domain context; review list included in tasks |
| `hreflang` tags missing or malformed reduce SEO benefit | Low | Validate with Google Search Console after deploy; add automated check in verify phase |
| TypedHero strings are hardcoded inside the `react-typed` component | Low | Replace with a `strings` prop; locale-specific arrays defined in `en.json` / `es.json` |

## Rollback Plan

1. Revert `astro.config.mjs` — remove the `i18n` block entirely.
2. Restore `src/pages/index.astro` from git (`git checkout HEAD -- src/pages/index.astro`).
3. Delete `src/pages/[lang]/` directory.
4. Delete `src/i18n/` directory.
5. Revert `src/layouts/BaseLayout.astro` and `src/seo/SEO.astro` to remove `lang` prop usage.
6. Revert `src/content/config.ts` — remove `lang` field from schemas.
7. Move content files back from `en/`/`es/` subdirectories to their original flat structure.
8. All changes are isolated to new files and additive schema fields — no database migrations, no external service changes.

## Dependencies

- Astro 5.x built-in i18n (no additional npm packages required)
- Spanish translations for all UI strings and content (provided by domain owner / handwritten)
- `@emailjs/browser` contact form: no change needed — EmailJS template is locale-agnostic; `lang` context passed as a hidden form field for logging only

## Success Criteria

- [ ] `astro build` completes without errors and generates `/en/` and `/es/` output paths
- [ ] All user-visible text on `/en` matches current English content exactly (no regression)
- [ ] All user-visible text on `/es` is translated into Spanish with no English fallback strings visible
- [ ] `<html lang="en">` on `/en` and `<html lang="es">` on `/es`
- [ ] `<link rel="alternate" hreflang="en">` and `<link rel="alternate" hreflang="es">` present on both pages
- [ ] Language toggle in sidebar switches locale and persists selection across page reloads
- [ ] Navigating directly to `/` redirects to `/en`
- [ ] LCP < 2.5s and CLS < 0.1 maintained on both locales (no layout shift from language toggle)
- [ ] Portfolio carousel and service cards load locale-correct content on both routes
- [ ] Contact form toast messages appear in the correct language
