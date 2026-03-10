# Spec: Content Collections

## Purpose

Astro Content Collections provide typed, validated data sources for all structured content in the portfolio: projects, services, skills, experience, and education. All collections are defined with Zod schemas in `src/content/config.ts`. Components MUST consume collection data rather than hardcoding content.

---

## Requirements

### Requirement: Content Collections Config

The system MUST define all content collections in `src/content/config.ts` using Astro's `defineCollection` API with Zod schemas. The following collections MUST be defined: `projects`, `services`, `skills` (or `skills.json`), `experience` (or `experience.json`), `education` (or `education.json`).

#### Scenario: Build succeeds with all collections defined

- GIVEN all collection schema files are present and valid
- WHEN `npm run build` is run
- THEN the build MUST complete with zero content collection validation errors

#### Scenario: Invalid entry fails schema validation at build time

- GIVEN a content entry is missing a required field defined in its Zod schema
- WHEN `npm run build` is run
- THEN the build MUST fail with a descriptive Zod validation error indicating the missing field

---

### Requirement: Projects Collection Schema

The `projects` collection MUST use a Zod schema requiring these fields: `title` (string), `client` (string), `category` (string), `date` (string), `description` (string), `stack` (array of strings), `thumbnail` (image reference via `image()`). Optional fields: `liveUrl` (string URL).

#### Scenario: Projects schema validates correctly formed entry

- GIVEN a project entry with all required fields populated
- WHEN the entry is validated against the Zod schema
- THEN validation MUST pass with no errors

#### Scenario: Projects schema rejects entry missing required field

- GIVEN a project entry with `title` omitted
- WHEN the entry is validated
- THEN Zod MUST throw a validation error identifying `title` as required

#### Scenario: Three project entries are present

- GIVEN the projects content collection is loaded
- WHEN the collection is queried
- THEN exactly three entries MUST be returned: Mento, Metro Delivery, Mingga

---

### Requirement: Services Collection Schema

The `services` collection MUST use a Zod schema requiring: `title` (string), `description` (string), `shortDescription` (string). Optional: `icon` (string).

#### Scenario: Four service entries are present

- GIVEN the services content collection is loaded
- WHEN the collection is queried
- THEN exactly four entries MUST be returned corresponding to the four services in the proposal

#### Scenario: Services schema rejects entry missing description

- GIVEN a service entry with `description` omitted
- WHEN the entry is validated
- THEN Zod MUST throw a validation error identifying `description` as required

---

### Requirement: Skills Data

The skills data source MUST contain exactly six skill entries, each with a `name` (string) and `percentage` (number, 0–100). Values: React.js 95, React Native 90, Express 90, Next.js 90, TypeScript 85, PostgreSQL 80.

#### Scenario: Skills data is loadable and contains six entries

- GIVEN the skills data source is imported
- WHEN the data is accessed
- THEN exactly six skill objects MUST be returned with the correct name and percentage values

#### Scenario: Skills data enforces percentage range at build time

- GIVEN a skill entry has `percentage: 110` (out of range)
- WHEN the entry is validated (via Zod or TypeScript type)
- THEN validation MUST reject the value as out of range (SHOULD be enforced; MAY be a TypeScript type constraint)

---

### Requirement: Experience Data

The experience data source MUST contain exactly five work experience entries, each with: `startYear` (string), `endYear` (string or `"Present"`), `role` (string), `company` (string).

#### Scenario: Experience data contains five entries in correct order

- GIVEN the experience data source is loaded
- WHEN the entries are inspected
- THEN five entries MUST be present: Mento (2023–Present), Logistecsa-Bentex (2022–Present), Orbis Data (2022–2023), Koscrypt (2019–2022), SDIS (2014–2016)

---

### Requirement: Education Data

The education data source MUST contain exactly two education entries, each with: `year` (string), `degree` (string), `institution` (string).

#### Scenario: Education data contains two entries

- GIVEN the education data source is loaded
- WHEN the entries are inspected
- THEN two entries MUST be present: Systems Engineering BSc 2018 (District University of Bogota) and Fullstack Bootcamp 2019 (HENRY)

---

### Requirement: TypeScript Strict Typing for Collections

All collection schemas MUST produce fully typed TypeScript interfaces inferred by Zod. Components that consume collection data MUST import and use the inferred types. No `any` types are permitted in collection consumption code.

#### Scenario: TypeScript strict mode accepts collection usage

- GIVEN a component imports and uses collection data with inferred types
- WHEN `tsc --noEmit` is run with `strict: true`
- THEN zero TypeScript errors related to collection types MUST be reported

#### Scenario: Accessing a non-existent field produces a compile error

- GIVEN a component attempts to access `project.nonExistentField`
- WHEN TypeScript compilation runs
- THEN a type error MUST be reported indicating `nonExistentField` does not exist on the project type
