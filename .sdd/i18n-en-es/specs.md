# Specs: i18n-en-es

## Overview

This document is the spec manifest for the `i18n-en-es` change. All requirements and BDD/Gherkin scenarios are organized by domain under `specs/{domain}/spec.md`.

## Domains

| Domain | File | Type | Requirements | Scenarios |
|---|---|---|---|---|
| routing | [specs/routing/spec.md](specs/routing/spec.md) | full | 5 | 12 |
| language-toggle | [specs/language-toggle/spec.md](specs/language-toggle/spec.md) | full | 4 | 11 |
| ui-strings | [specs/ui-strings/spec.md](specs/ui-strings/spec.md) | full | 7 | 16 |
| content-collections | [specs/content-collections/spec.md](specs/content-collections/spec.md) | full | 6 | 15 |
| seo | [specs/seo/spec.md](specs/seo/spec.md) | full | 5 | 13 |
| ux-constraints | [specs/ux-constraints/spec.md](specs/ux-constraints/spec.md) | full | 5 | 13 |

**Total: 32 requirements, 80 scenarios**

---

## Coverage Summary

| Area | Happy Paths | Edge Cases | Error States |
|---|---|---|---|
| routing | Yes | Yes | Yes |
| language-toggle | Yes | Yes | Yes |
| ui-strings | Yes | Yes | No (stateless data — no runtime errors) |
| content-collections | Yes | Yes | Yes (schema validation, missing sibling file) |
| seo | Yes | No (declarative output — no branching errors) | No |
| ux-constraints | Yes | Yes | Yes (invalid localStorage value, cleared preference) |

---

## Key Decisions Captured in Specs

1. **Content collection strategy**: locale-prefixed subdirectories (`en/`, `es/`) with a `lang` field in the Zod schema — not duplicate collection definitions.
2. **Sibling JSON files for non-markdown content**: `skills.es.json`, `experience.es.json`, `education.es.json` loaded conditionally. Fallback to English if Spanish sibling is absent.
3. **Flash prevention**: inline synchronous `<script>` in `<head>` reads `localStorage` and calls `window.location.replace()` before body parses — same pattern as existing theme toggle.
4. **Toggle implementation**: lightweight client-side navigation via `window.location.href` — no React router or Redux required.
5. **Default locale**: English (`"en"`). Root `/` always redirects to `/en`.
6. **x-default hreflang**: always points to `/en`.
