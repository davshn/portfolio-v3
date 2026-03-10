# Spec: SEO

## Purpose

The SEO layer ensures every public page has a unique title, meta description, canonical URL, Open Graph tags, and JSON-LD structured data. It is implemented in `src/seo/` and injected globally via BaseLayout.

---

## Requirements

### Requirement: SEO Component — Meta Tags

The system MUST render a `<SEO>` Astro component inside `<head>` that outputs: `<title>`, `<meta name="description">`, `<meta name="robots" content="index, follow">`, and a `<link rel="canonical">` for every public page.

#### Scenario: Title tag is present and non-default

- GIVEN the site is built
- WHEN the built `index.html` is parsed
- THEN the `<title>` tag MUST be present and MUST NOT contain the default Astro placeholder `"Astro"`

#### Scenario: Meta description is present

- GIVEN the site is built
- WHEN `<meta name="description">` is inspected
- THEN it MUST be present with a non-empty `content` attribute

#### Scenario: Canonical URL is present

- GIVEN the site is built
- WHEN `<link rel="canonical">` is inspected
- THEN it MUST be present with the correct absolute URL for the page

#### Scenario: Robots meta tag is present

- GIVEN the site is built
- WHEN `<meta name="robots">` is inspected
- THEN it MUST be present with `content="index, follow"`

---

### Requirement: Open Graph Tags

The system MUST render the following Open Graph meta tags on every public page: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`. The `og:image` MUST reference the OG image file in `public/` (absolute URL).

#### Scenario: All required OG tags are present

- GIVEN the site is built
- WHEN the `<head>` is parsed
- THEN `og:title`, `og:description`, `og:type`, `og:url`, and `og:image` MUST all be present

#### Scenario: og:image is an absolute URL

- GIVEN the site is built
- WHEN `og:image` content is inspected
- THEN it MUST be an absolute URL (beginning with `https://`) referencing a valid image file

---

### Requirement: JSON-LD Person Schema

The system MUST inject a `<script type="application/ld+json">` tag on every page containing a `Person` schema with at minimum: `@type: "Person"`, `name: "Hernán David Figueroa Cárdenas"`, `jobTitle: "Fullstack Developer"`, `url` (site canonical URL), `email: "davshn@gmail.com"`, `address` (Bogota, Colombia), `sameAs` array (social profile URLs).

#### Scenario: JSON-LD script tag is present

- GIVEN the site is built
- WHEN the page `<head>` is parsed
- THEN a `<script type="application/ld+json">` tag MUST be present

#### Scenario: JSON-LD contains valid Person schema

- GIVEN the JSON-LD script content is parsed
- WHEN the resulting object is inspected
- THEN `@context` MUST be `"https://schema.org"`, `@type` MUST be `"Person"`, and the `name` field MUST be `"Hernán David Figueroa Cárdenas"`

#### Scenario: sameAs links are present

- GIVEN the JSON-LD Person schema is parsed
- WHEN the `sameAs` array is inspected
- THEN it MUST contain URLs for at least GitHub and LinkedIn profiles

---

### Requirement: JSON-LD WebSite Schema

The system SHOULD inject a `WebSite` schema alongside the Person schema: `@type: "WebSite"`, `name`, `url`, and `description` fields populated from site config.

#### Scenario: WebSite schema is present

- GIVEN the JSON-LD script is parsed
- WHEN the output contains an array or separate script
- THEN a `WebSite` schema with `@type: "WebSite"` and the site URL SHOULD be present

---

### Requirement: SEO Props API

The `SEO.astro` component MUST accept props for: `title` (string, required), `description` (string, required), `canonicalURL` (string, required), `ogImage` (string, optional — falls back to default OG image). BaseLayout MUST pass these props to the SEO component.

#### Scenario: SEO component renders with all required props

- GIVEN BaseLayout passes title, description, and canonicalURL to SEO
- WHEN the page is rendered
- THEN all corresponding meta tags MUST reflect the passed prop values

#### Scenario: SEO component uses default OG image when none provided

- GIVEN BaseLayout does not pass an `ogImage` prop
- WHEN `og:image` is inspected
- THEN it MUST reference the default OG image path, not an empty or broken URL

---

### Requirement: Performance Targets

The system MUST meet the following Lighthouse mobile performance targets: LCP (Largest Contentful Paint) < 2.5s, CLS (Cumulative Layout Shift) < 0.1.

#### Scenario: LCP is under threshold

- GIVEN the portfolio site is deployed to production
- WHEN a Lighthouse mobile audit is run
- THEN LCP MUST be reported as less than 2.5 seconds

#### Scenario: CLS is under threshold

- GIVEN the portfolio site is deployed to production
- WHEN a Lighthouse mobile audit is run
- THEN CLS MUST be reported as less than 0.1

---

### Requirement: robots.txt

The system MUST provide a `robots.txt` file in `public/` that permits all crawlers to index the site and references the sitemap (if present).

#### Scenario: robots.txt is accessible

- GIVEN the site is deployed
- WHEN a request is made to `/robots.txt`
- THEN the response MUST return a valid `robots.txt` allowing `User-agent: *` with `Disallow: ` empty (allow all)
