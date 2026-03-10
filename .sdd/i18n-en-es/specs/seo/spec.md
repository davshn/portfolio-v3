# Spec: SEO and Locale Metadata

## Purpose

Define the SEO metadata requirements for bilingual pages, including the `lang` attribute on the HTML element, `hreflang` alternate link tags, locale-specific `<title>` and `<meta name="description">` tags, and JSON-LD structured data with locale-aware fields.

---

## Requirements

### Requirement: HTML lang Attribute Reflects Active Locale

The system MUST set the `lang` attribute of the `<html>` element to the active locale's ISO 639-1 code on every rendered page.

#### Scenario: /en sets lang="en" on html element

- GIVEN the visitor navigates to `/en`
- WHEN the page HTML is inspected
- THEN the `<html>` element has `lang="en"`

#### Scenario: /es sets lang="es" on html element

- GIVEN the visitor navigates to `/es`
- WHEN the page HTML is inspected
- THEN the `<html>` element has `lang="es"`

#### Scenario: html lang is set by BaseLayout, not individual components

- GIVEN `BaseLayout.astro` accepts a `lang` prop
- WHEN any page uses `BaseLayout`
- THEN the `lang` prop is the sole source for the `<html lang>` attribute value
- AND no component sets `lang` on the `<html>` element independently

---

### Requirement: hreflang Alternate Link Tags on Every Page

The system MUST emit three `<link rel="alternate">` tags in the `<head>` of every page: one for `hreflang="en"`, one for `hreflang="es"`, and one for `hreflang="x-default"` pointing to the English version.

#### Scenario: /en page emits all three hreflang tags

- GIVEN the visitor navigates to `/en`
- WHEN the `<head>` is inspected
- THEN a `<link rel="alternate" hreflang="en" href="https://example.com/en">` tag is present
- AND a `<link rel="alternate" hreflang="es" href="https://example.com/es">` tag is present
- AND a `<link rel="alternate" hreflang="x-default" href="https://example.com/en">` tag is present

#### Scenario: /es page emits all three hreflang tags

- GIVEN the visitor navigates to `/es`
- WHEN the `<head>` is inspected
- THEN the same three `<link rel="alternate">` tags are present with the same href values

#### Scenario: hreflang hrefs use absolute URLs

- GIVEN the site has a canonical base URL configured
- WHEN hreflang tags are emitted
- THEN each `href` value is an absolute URL (starts with `https://`)
- AND no relative paths are used

#### Scenario: x-default points to the English version

- GIVEN any page is rendered
- WHEN the `hreflang="x-default"` tag is inspected
- THEN its `href` points to `/en`

---

### Requirement: Locale-Specific Title and Meta Description

The system MUST render a distinct `<title>` and `<meta name="description">` for each locale so search engines index locale-appropriate metadata.

#### Scenario: /en page has English title and description

- GIVEN the visitor navigates to `/en`
- WHEN the `<head>` is inspected
- THEN `<title>` contains English text
- AND `<meta name="description">` contains an English description of the portfolio

#### Scenario: /es page has Spanish title and description

- GIVEN the visitor navigates to `/es`
- WHEN the `<head>` is inspected
- THEN `<title>` contains Spanish text
- AND `<meta name="description">` contains a Spanish description of the portfolio
- AND the Spanish title and description are different from the English equivalents

#### Scenario: Title and description are sourced from locale message files

- GIVEN SEO metadata is configured
- WHEN `getTranslation(lang).seo.title` and `getTranslation(lang).seo.description` are used
- THEN the SEO component renders the locale-correct strings without hardcoding

---

### Requirement: Canonical URL Per Locale

The system MUST emit a `<link rel="canonical">` tag on each page pointing to that page's own locale URL.

#### Scenario: /en canonical points to /en

- GIVEN the visitor navigates to `/en`
- WHEN the `<head>` is inspected
- THEN `<link rel="canonical" href="https://example.com/en">` is present

#### Scenario: /es canonical points to /es

- GIVEN the visitor navigates to `/es`
- WHEN the `<head>` is inspected
- THEN `<link rel="canonical" href="https://example.com/es">` is present

---

### Requirement: JSON-LD Structured Data Is Locale-Aware

The system MUST include locale-aware fields in the JSON-LD structured data emitted by `src/seo/jsonld.ts`, specifically `inLanguage` and a locale-appropriate `description`.

#### Scenario: /en JSON-LD has inLanguage "en"

- GIVEN the visitor navigates to `/en`
- WHEN the JSON-LD `<script type="application/ld+json">` in `<head>` is parsed
- THEN the structured data object contains `"inLanguage": "en"`
- AND the `description` field contains the English portfolio description

#### Scenario: /es JSON-LD has inLanguage "es"

- GIVEN the visitor navigates to `/es`
- WHEN the JSON-LD structured data is parsed
- THEN the structured data object contains `"inLanguage": "es"`
- AND the `description` field contains the Spanish portfolio description

#### Scenario: jsonld.ts accepts lang as a parameter

- GIVEN `src/seo/jsonld.ts` is implemented
- WHEN the function generating the structured data is called with `lang="es"`
- THEN it returns a JSON-LD object with Spanish `description` and `inLanguage: "es"`
- AND no hardcoded language values appear in the function body

---

### Requirement: Open Graph Tags Include Locale Information

The system SHOULD emit `og:locale` and `og:locale:alternate` Open Graph meta tags matching the active locale and its alternate.

#### Scenario: /en emits og:locale for English

- GIVEN the visitor navigates to `/en`
- WHEN the `<head>` Open Graph tags are inspected
- THEN `<meta property="og:locale" content="en_US">` is present
- AND `<meta property="og:locale:alternate" content="es_ES">` is present

#### Scenario: /es emits og:locale for Spanish

- GIVEN the visitor navigates to `/es`
- WHEN the `<head>` Open Graph tags are inspected
- THEN `<meta property="og:locale" content="es_ES">` is present
- AND `<meta property="og:locale:alternate" content="en_US">` is present
