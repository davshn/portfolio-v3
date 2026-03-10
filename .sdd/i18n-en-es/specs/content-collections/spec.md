# Spec: Content Collection Translation

## Purpose

Define how the Astro content collections for projects, services, skills, experience, and education are structured to support bilingual content, and how components query and render the locale-correct entries.

---

## Requirements

### Requirement: Projects and Services Collections Use Locale-Prefixed Subdirectories

The system MUST restructure the `src/content/projects/` and `src/content/services/` directories into `en/` and `es/` subdirectories, with a `lang` field added to each entry's Zod schema.

#### Scenario: English project entries are in en/ subdirectory

- GIVEN the content collection has been restructured
- WHEN `src/content/projects/` is examined
- THEN all English project entries reside under `src/content/projects/en/`
- AND each entry contains a `lang: "en"` field

#### Scenario: Spanish project entries are in es/ subdirectory

- GIVEN the content collection has been restructured
- WHEN `src/content/projects/` is examined
- THEN all Spanish project entries reside under `src/content/projects/es/`
- AND each entry contains a `lang: "es"` field

#### Scenario: Every English project has a Spanish counterpart

- GIVEN the projects collection contains entries for Mento, Metro Delivery, and Mingga in English
- WHEN the `es/` subdirectory is examined
- THEN each of the three projects has a corresponding Spanish entry with the same slug
- AND none of the English entries are missing a Spanish equivalent

---

### Requirement: Content Collection Schema Validates the lang Field

The system MUST add a `lang` field typed as `z.enum(["en", "es"])` to the Zod schemas for the `projects` and `services` collections in `src/content/config.ts`.

#### Scenario: Valid lang value passes schema validation

- GIVEN a content entry with `lang: "en"` or `lang: "es"`
- WHEN Astro validates the collection at build time
- THEN the entry passes without errors

#### Scenario: Invalid lang value fails schema validation

- GIVEN a content entry with `lang: "fr"` or a missing `lang` field
- WHEN Astro validates the collection at build time
- THEN the build fails with a schema validation error identifying the invalid entry

---

### Requirement: Portfolio Component Queries Only the Active Locale's Projects

The system MUST filter the projects collection by the active `lang` value so only locale-appropriate projects are rendered in the portfolio carousel.

#### Scenario: /en renders English projects

- GIVEN the visitor is on `/en`
- WHEN the Portfolio section renders
- THEN the carousel displays the English descriptions for Mento, Metro Delivery, and Mingga
- AND no Spanish text is visible in the project cards or modals

#### Scenario: /es renders Spanish projects

- GIVEN the visitor is on `/es`
- WHEN the Portfolio section renders
- THEN the carousel displays the Spanish descriptions for all three projects
- AND no English text is visible in the project cards or modals

#### Scenario: Query returns exactly the locale-correct entries

- GIVEN `getCollection("projects")` is filtered by `lang === activeLang`
- WHEN the filter runs for `lang="es"`
- THEN only entries from `src/content/projects/es/` are returned
- AND entries from `src/content/projects/en/` are excluded

---

### Requirement: Service Component Queries Only the Active Locale's Services

The system MUST filter the services collection by the active `lang` so only locale-appropriate service cards are rendered.

#### Scenario: /en renders English service descriptions

- GIVEN the visitor is on `/en`
- WHEN the Service section renders
- THEN all four service card descriptions are in English

#### Scenario: /es renders Spanish service descriptions

- GIVEN the visitor is on `/es`
- WHEN the Service section renders
- THEN all four service card descriptions are in Spanish
- AND no English text appears in service cards or service detail modals

---

### Requirement: Skills, Experience, and Education Use Sibling Locale Files

The system MUST load locale-specific variants of `skills`, `experience`, and `education` data by using sibling JSON files (`skills.es.json`, `experience.es.json`, `education.es.json`) alongside the existing English originals, selected conditionally by `lang`.

#### Scenario: Skills load in Spanish on /es

- GIVEN `src/content/skills.es.json` exists with Spanish skill names
- WHEN the About section renders on `/es`
- THEN skill names are displayed in Spanish
- AND percentage values remain unchanged from the English version

#### Scenario: Skills load in English on /en

- GIVEN the visitor is on `/en`
- WHEN the About section renders
- THEN the English `skills.json` file is used
- AND skill names appear in English

#### Scenario: Experience entries load in Spanish on /es

- GIVEN `src/content/experience.es.json` exists
- WHEN the About modal renders on `/es`
- THEN role titles and company names appear with Spanish translations where applicable

#### Scenario: Fallback to English if Spanish sibling file is absent

- GIVEN a sibling locale file (e.g. `education.es.json`) does not yet exist
- WHEN the About modal renders on `/es`
- THEN the system SHOULD fall back to the English data file rather than throwing an error
- AND the fallback is logged as a warning during build

---

### Requirement: Project and Service Modals Display Locale-Correct Content

The system MUST render the detail modal for each project and service using the entry that matches the active locale.

#### Scenario: Portfolio modal shows Spanish project details on /es

- GIVEN the visitor is on `/es` and clicks a project card
- WHEN the project detail modal opens
- THEN the modal title, description, client, category, and date are in Spanish

#### Scenario: Service modal shows Spanish service details on /es

- GIVEN the visitor is on `/es` and clicks a service card
- WHEN the service detail modal opens
- THEN the modal description text is in Spanish
