# Specs Index: portfolio-replication

## Overview

Full specifications for replicating the Next.js portfolio into Astro 5 + React 19 + Tailwind CSS. All specs are new (no prior spec files exist for this project). Each domain has its own spec file under `specs/{domain}/spec.md`.

## Domain Specs

| Domain | Path | Requirements | Scenarios |
|---|---|---|---|
| Layout | `specs/layout/spec.md` | 6 | 13 |
| Sidebar | `specs/sidebar/spec.md` | 6 | 12 |
| Hero | `specs/hero/spec.md` | 6 | 10 |
| About | `specs/about/spec.md` | 9 | 15 |
| Service | `specs/service/spec.md` | 6 | 10 |
| Portfolio | `specs/portfolio/spec.md` | 8 | 14 |
| Contact | `specs/contact/spec.md` | 7 | 12 |
| SEO | `specs/seo/spec.md` | 7 | 13 |
| Content Collections | `specs/content/spec.md` | 7 | 14 |
| UI Primitives | `specs/ui-primitives/spec.md` | 8 | 18 |

**Total: 70 requirements, 131 scenarios**

## Coverage Summary

All domains have full specs (new, not delta) because this project has no prior spec artifacts.

Every requirement includes at least one happy-path scenario. Edge cases and error states are covered for: theme persistence (Layout), mobile hamburger (Sidebar), typed animation SSR safety (Hero), modal open/close (About, Service, Portfolio), EmailJS failure and env var absence (Contact), OG image fallback and LCP/CLS targets (SEO), Zod schema rejection (Content), prop type errors (UI Primitives).
