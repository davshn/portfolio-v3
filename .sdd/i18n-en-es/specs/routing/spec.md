# Spec: Routing

## Purpose

Define how locale-prefixed URL paths are generated, resolved, and redirected for the bilingual portfolio. Routing determines the URL structure for both the English and Spanish variants of the site and ensures the root path always resolves to the default locale.

---

## Requirements

### Requirement: Explicit Locale Prefix for All Pages

The system MUST serve the portfolio under explicit locale-prefixed paths `/en/` and `/es/`, with no page accessible at an unprefixed path other than the root redirect.

#### Scenario: English page loads at /en

- GIVEN the Astro build has completed successfully
- WHEN a visitor navigates to `/en`
- THEN the server responds with HTTP 200 and renders the English version of the portfolio
- AND the `<html>` element has `lang="en"`

#### Scenario: Spanish page loads at /es

- GIVEN the Astro build has completed successfully
- WHEN a visitor navigates to `/es`
- THEN the server responds with HTTP 200 and renders the Spanish version of the portfolio
- AND the `<html>` element has `lang="es"`

#### Scenario: Non-prefixed portfolio path returns 404

- GIVEN the Astro build has completed successfully
- WHEN a visitor navigates to `/` (other than via redirect)
- THEN the response is either an HTTP 301 redirect or a Vercel redirect rule — never an unlocalized page render

---

### Requirement: Root Path Redirects to Default Locale

The system MUST redirect requests to `/` to `/en` so visitors always land on an explicitly localized URL.

#### Scenario: Root redirect to /en

- GIVEN a visitor arrives at the root path `/`
- WHEN the server processes the request
- THEN the visitor is redirected to `/en`
- AND the redirect is permanent (HTTP 301) or handled by Astro i18n routing config with `redirectToDefaultLocale: true`

#### Scenario: Root redirect preserves no trailing content

- GIVEN a visitor arrives at `/` with no path suffix
- WHEN the redirect fires
- THEN the destination is exactly `/en` with no extraneous path appended

---

### Requirement: Static Path Generation for Both Locales

The system MUST generate static output for both `en` and `es` locales during `astro build`.

#### Scenario: Build produces /en output

- GIVEN `src/pages/[lang]/index.astro` implements `getStaticPaths()` returning `[{ params: { lang: "en" } }, { params: { lang: "es" } }]`
- WHEN `astro build` runs
- THEN the output directory contains an `en/index.html` file

#### Scenario: Build produces /es output

- GIVEN the same `getStaticPaths()` configuration
- WHEN `astro build` runs
- THEN the output directory contains an `es/index.html` file

#### Scenario: Build does not error on unrecognized lang param

- GIVEN `getStaticPaths()` returns only `"en"` and `"es"` params
- WHEN a path with any other `lang` value is requested
- THEN the static build does not include that path and the server returns 404

---

### Requirement: Only English and Spanish Locales Are Valid

The system MUST NOT generate or serve pages for any locale other than `"en"` and `"es"`.

#### Scenario: Invalid locale path returns 404

- GIVEN the Astro build has completed
- WHEN a visitor navigates to `/fr` or `/pt` or any other locale prefix
- THEN the server returns HTTP 404

#### Scenario: Locale type is a union, not a plain string

- GIVEN `src/i18n/utils.ts` defines `type Locale = "en" | "es"`
- WHEN a component receives the `lang` prop
- THEN TypeScript rejects any value other than `"en"` or `"es"` at compile time

---

### Requirement: Lang Prop Flows From Page to All Sections

The system MUST pass the resolved `lang` value as a prop from `[lang]/index.astro` to every section component so no component independently determines its own locale.

#### Scenario: Section components receive lang prop

- GIVEN `[lang]/index.astro` resolves `lang` from `Astro.params`
- WHEN the page renders
- THEN every section component (`Hero`, `About`, `Service`, `Portfolio`, `Contact`) receives `lang` as a prop
- AND no section component reads `lang` from a URL or global store on its own

#### Scenario: React islands receive lang as a prop

- GIVEN a React island (e.g. `ContactForm.tsx`, `ServiceCards.tsx`) is embedded in a section
- WHEN the island is hydrated
- THEN `lang` is passed as a serializable prop from the Astro parent
- AND the island does not call `window.location` to determine the locale
