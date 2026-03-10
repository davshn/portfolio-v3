# Spec: UX Constraints — No Flash of Wrong Language & Preference Persistence

## Purpose

Define the runtime behavior requirements that prevent visitors from seeing a flash of wrong-language content on page load and ensure that language preference persists seamlessly across page reloads and direct URL navigation.

---

## Requirements

### Requirement: No Flash of Wrong Language on Page Load

The system MUST resolve the visitor's locale preference and apply it before the first paint, so the visitor never sees content rendered in the wrong language before a redirect or re-render occurs.

#### Scenario: Stored preference is applied before first paint

- GIVEN `localStorage["portfolio-lang"]` is `"es"`
- WHEN the visitor navigates directly to `/en`
- THEN the redirect to `/es` occurs before any `/en` content is painted
- AND the visitor does not see English text flash before the Spanish page appears

#### Scenario: Inline script reads localStorage before page renders

- GIVEN `BaseLayout.astro` includes an inline `<script>` tag in `<head>`
- WHEN the browser parses the `<head>`
- THEN the script reads `localStorage["portfolio-lang"]`
- AND if the stored locale differs from the current URL locale, `window.location.replace()` is called immediately
- AND the script executes synchronously before the `<body>` is parsed

#### Scenario: No localStorage value — no redirect, no flash

- GIVEN `localStorage["portfolio-lang"]` is null
- WHEN the visitor navigates to `/en`
- THEN no redirect is triggered
- AND the English page renders without any content jump or re-render

#### Scenario: Flash prevention does not block valid locale pages

- GIVEN `localStorage["portfolio-lang"]` is `"es"` and the visitor is already on `/es`
- WHEN the inline script runs
- THEN no redirect occurs because the URL locale already matches the stored preference
- AND the page renders normally without a redirect loop

---

### Requirement: Language Preference Persists Across Page Reloads

The system MUST retain the visitor's language preference in `localStorage` so that reloading the page in the same browser session and across different sessions results in the same locale being served.

#### Scenario: Reload preserves active locale

- GIVEN the visitor is on `/es` with `localStorage["portfolio-lang"]` set to `"es"`
- WHEN the visitor reloads the page
- THEN the page remains on `/es`
- AND no redirect to `/en` occurs

#### Scenario: Preference survives browser session close and reopen

- GIVEN the visitor chose `"es"` and `localStorage["portfolio-lang"]` is `"es"`
- WHEN the visitor closes the browser, reopens it, and navigates to the portfolio root `/`
- THEN the root redirect first sends to `/en`
- AND the inline script in `<head>` then redirects to `/es` based on the stored preference
- AND the visitor lands on `/es`

#### Scenario: Clearing localStorage resets to URL locale

- GIVEN `localStorage["portfolio-lang"]` has been cleared (e.g. via DevTools)
- WHEN the visitor navigates to `/en`
- THEN no redirect occurs and the English page renders
- AND `localStorage["portfolio-lang"]` is not written unless the visitor explicitly uses the toggle

---

### Requirement: Language Preference Persists Across In-Page Navigation

The system MUST maintain the active locale throughout any in-page navigation (e.g. scrollspy, anchor links) without resetting the language to a default.

#### Scenario: Scrollspy navigation does not change locale

- GIVEN the visitor is on `/es`
- WHEN the visitor clicks a sidebar nav link (e.g. #about, #contact)
- THEN the page scrolls to the target section
- AND the URL remains `/es#about` (or `/es` with smooth scroll)
- AND the language does not reset to English

#### Scenario: Back/forward browser navigation preserves locale

- GIVEN the visitor navigated from `/en` to `/es` using the toggle
- WHEN the visitor clicks the browser back button
- THEN the browser returns to `/en`
- AND the inline script does not immediately redirect back to `/es` (browser history takes precedence over the stored preference on explicit back navigation)

---

### Requirement: Performance Targets Are Maintained Across Both Locales

The system MUST NOT introduce layout shifts or loading regressions due to the locale resolution mechanism.

#### Scenario: CLS remains below 0.1 on both locales

- GIVEN the visitor loads `/en` or `/es`
- WHEN Core Web Vitals are measured
- THEN Cumulative Layout Shift (CLS) is less than 0.1

#### Scenario: LCP remains below 2.5s on both locales

- GIVEN the visitor loads `/en` or `/es`
- WHEN Core Web Vitals are measured
- THEN Largest Contentful Paint (LCP) is less than 2.5 seconds

#### Scenario: Locale redirect does not cause observable layout shift

- GIVEN the inline script redirects the visitor from `/en` to `/es`
- WHEN the redirect occurs before first paint
- THEN the browser does not render `/en` content at all
- AND CLS is not impacted by the redirect

---

### Requirement: Default Locale Is English

The system MUST treat English as the default locale in all fallback scenarios.

#### Scenario: No stored preference defaults to English

- GIVEN a first-time visitor with no `localStorage` data
- WHEN the visitor arrives at the root `/`
- THEN they are redirected to `/en`

#### Scenario: Astro i18n defaultLocale is set to "en"

- GIVEN `astro.config.mjs` is configured
- WHEN the `i18n` block is inspected
- THEN `defaultLocale` is set to `"en"`
- AND `locales` is `["en", "es"]`

#### Scenario: x-default hreflang points to English

- GIVEN any page is rendered
- WHEN `<link rel="alternate" hreflang="x-default">` is inspected
- THEN its `href` points to the `/en` URL — not `/es` or `/`
