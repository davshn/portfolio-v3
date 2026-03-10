# Spec: Language Toggle

## Purpose

Define the behavior of the in-page language switcher that allows visitors to switch between English and Spanish, and specify how the preference is persisted and applied across sessions.

---

## Requirements

### Requirement: Language Toggle Visible in Sidebar

The system MUST render a language toggle control in `Sidebar.astro` that presents two options: `EN` and `ES`.

#### Scenario: Toggle renders in sidebar

- GIVEN the portfolio page is loaded in either `/en` or `/es`
- WHEN the sidebar is visible
- THEN a language toggle showing `EN | ES` is rendered in the sidebar
- AND the currently active locale is visually distinguished from the inactive one (e.g. bold, underline, or accent color)

#### Scenario: Active locale is highlighted

- GIVEN the visitor is on `/en`
- WHEN the sidebar renders
- THEN `EN` appears as the active option
- AND `ES` appears as the inactive option

#### Scenario: Inactive locale is highlighted on /es

- GIVEN the visitor is on `/es`
- WHEN the sidebar renders
- THEN `ES` appears as the active option
- AND `EN` appears as the inactive option

---

### Requirement: Toggle Switches Locale by Navigating to Alternate URL

The system MUST navigate the visitor to the alternate locale path when the inactive language option is clicked, replacing the locale segment in the current URL.

#### Scenario: Clicking ES from English page navigates to /es

- GIVEN the visitor is on `/en`
- WHEN the visitor clicks `ES` in the language toggle
- THEN the browser navigates to `/es`

#### Scenario: Clicking EN from Spanish page navigates to /en

- GIVEN the visitor is on `/es`
- WHEN the visitor clicks `EN` in the language toggle
- THEN the browser navigates to `/en`

#### Scenario: Clicking the active locale does nothing

- GIVEN the visitor is on `/es`
- WHEN the visitor clicks `ES` (already active)
- THEN no navigation occurs

---

### Requirement: Language Preference Persisted in localStorage

The system MUST write the chosen locale to `localStorage` under the key `portfolio-lang` whenever the visitor switches language.

#### Scenario: Switching to ES persists preference

- GIVEN the visitor is on `/en`
- WHEN the visitor clicks `ES`
- THEN `localStorage.getItem("portfolio-lang")` returns `"es"`

#### Scenario: Switching to EN persists preference

- GIVEN the visitor is on `/es`
- WHEN the visitor clicks `EN`
- THEN `localStorage.getItem("portfolio-lang")` returns `"en"`

#### Scenario: Preference key name is exactly portfolio-lang

- GIVEN the language toggle writes to localStorage
- WHEN any locale is selected
- THEN the key used is exactly `"portfolio-lang"` — no other keys are written

---

### Requirement: Stored Preference Applied on Page Load

The system MUST read `localStorage["portfolio-lang"]` on page load and redirect the visitor to the stored locale if it differs from the current URL locale.

#### Scenario: Stored preference redirects on direct URL entry

- GIVEN the visitor previously chose `"es"` and `localStorage["portfolio-lang"]` is `"es"`
- WHEN the visitor navigates directly to `/en` (e.g. via a bookmark)
- THEN the page automatically redirects the visitor to `/es`

#### Scenario: No preference stored — no redirect

- GIVEN `localStorage["portfolio-lang"]` is null or undefined
- WHEN the visitor navigates to `/en`
- THEN no redirect occurs and the `/en` page renders normally

#### Scenario: Invalid stored value is ignored

- GIVEN `localStorage["portfolio-lang"]` contains an unrecognized value (e.g. `"fr"`)
- WHEN the visitor navigates to any locale path
- THEN no redirect occurs and the URL locale is used as-is

---

### Requirement: Toggle Does Not Require Full Page Reload Framework

The system MUST implement the toggle as a lightweight client-side navigation — no React state management or SPA router is required for the locale switch itself.

#### Scenario: Toggle works without JavaScript framework state

- GIVEN the toggle is implemented as a client-side script or minimal island
- WHEN the visitor clicks the alternate locale
- THEN the browser navigates via standard `window.location.href` assignment
- AND no Redux or global state update is needed for the locale change itself
