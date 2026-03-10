# Spec: UI String Translation

## Purpose

Define requirements for externalizing all hardcoded user-facing strings from Astro components and React islands into locale message files, and ensuring every visible string is translated into both English and Spanish with no fallback to the other language.

---

## Requirements

### Requirement: All UI Strings Centralized in Locale Message Files

The system MUST store all user-visible UI strings in `src/i18n/messages/en.json` and `src/i18n/messages/es.json`. No hardcoded English or Spanish strings SHALL remain in any `.astro` component or `.tsx` island after this change.

#### Scenario: English strings file contains all keys

- GIVEN `src/i18n/messages/en.json` exists
- WHEN its contents are examined
- THEN it contains keys for: nav labels, section headings, hero bio text, hero button text, about section headings, skill labels, modal section headers (Personal Info, Achievements, Experience, Education), service section heading, portfolio section heading, contact section heading, address labels, form field labels (name, email, message), form submit button label, toast success message, toast error message, modal close label, theme toggle labels (dark/light), and typed role strings

#### Scenario: Spanish strings file contains all keys

- GIVEN `src/i18n/messages/es.json` exists
- WHEN its contents are examined
- THEN it contains the exact same set of keys as `en.json` with no keys missing
- AND all values are in Spanish — no English strings appear as values

#### Scenario: No hardcoded strings remain in components

- GIVEN the translated components are implemented
- WHEN any `.astro` or `.tsx` file in `src/components/sections/` is examined
- THEN no user-visible string is hardcoded inline
- AND all strings are accessed via the typed `getTranslation(lang)` helper

---

### Requirement: Typed Translation Helper Enforces Key Existence

The system MUST export a `getTranslation(lang: Locale): Messages` function from `src/i18n/utils.ts` that returns a strongly-typed `Messages` object, so TypeScript catches missing keys at compile time.

#### Scenario: Accessing a valid key returns the correct string

- GIVEN `getTranslation("en")` is called
- WHEN the returned object's `hero.bioText` key is accessed
- THEN it returns the English bio string
- AND TypeScript provides type inference for the key

#### Scenario: Accessing an unknown key causes a compile error

- GIVEN the `Messages` type is derived from the shape of the JSON files
- WHEN a component attempts to access a key that does not exist in the type
- THEN the TypeScript compiler reports an error at build time

#### Scenario: Switching lang returns alternate strings

- GIVEN `getTranslation("es")` is called
- WHEN the returned object's `hero.bioText` key is accessed
- THEN it returns the Spanish bio string, different from the English one

---

### Requirement: Hero Section Strings Translated

The system MUST render all visible Hero section text using the locale-appropriate message keys.

#### Scenario: English hero renders English bio

- GIVEN the visitor is on `/en`
- WHEN the Hero section renders
- THEN the bio text reads `"Fullstack Developer based In Colombia, over 6 years of professional experience."` (English)
- AND the CV download button label is in English

#### Scenario: Spanish hero renders Spanish bio

- GIVEN the visitor is on `/es`
- WHEN the Hero section renders
- THEN the bio text is in Spanish
- AND the CV download button label is in Spanish
- AND no English text is visible in the Hero section

#### Scenario: TypedHero role strings are locale-specific

- GIVEN `TypedHero.tsx` accepts a `strings` prop
- WHEN `lang="en"` is passed
- THEN the typed animation cycles through English role titles
- WHEN `lang="es"` is passed
- THEN the typed animation cycles through Spanish role titles

---

### Requirement: About Section and Modal Strings Translated

The system MUST render all About section headings, tab labels, and modal content strings using locale message keys.

#### Scenario: About modal tab labels are translated

- GIVEN the visitor is on `/es` and opens the About modal
- WHEN the modal renders
- THEN the four tab labels (Personal Info, Achievements, Experience, Education) appear in Spanish

#### Scenario: Skill names in About section are translated

- GIVEN the visitor is on `/es`
- WHEN the About section renders the skill bars
- THEN all skill names are displayed in Spanish

---

### Requirement: Service Section Strings Translated

The system MUST render the Service section heading and all card labels using locale message keys.

#### Scenario: Service section heading is translated

- GIVEN the visitor is on `/es`
- WHEN the Service section renders
- THEN the section heading is in Spanish

---

### Requirement: Contact Form Strings Translated

The system MUST render all Contact section and form labels, placeholders, button text, and toast notification messages using locale message keys.

#### Scenario: Contact form labels are translated on /es

- GIVEN the visitor is on `/es`
- WHEN the Contact section renders
- THEN the form field labels (name, email, message) and submit button text are in Spanish

#### Scenario: Toast success message is locale-aware

- GIVEN the visitor is on `/es` and submits the contact form successfully
- WHEN EmailJS returns success
- THEN the toast displays the Spanish success message
- AND the English message `"Message Sent Successfully!"` does NOT appear

#### Scenario: Toast error message is locale-aware

- GIVEN the visitor is on `/es` and the contact form submission fails
- WHEN EmailJS returns an error
- THEN the toast displays the Spanish error message

---

### Requirement: Theme Toggle Labels Translated

The system MUST render theme toggle option labels (dark/light labels) in the active locale's language.

#### Scenario: Theme toggle labels appear in Spanish on /es

- GIVEN the visitor is on `/es`
- WHEN the theme toggle renders in the sidebar
- THEN the dark and light mode labels are in Spanish
