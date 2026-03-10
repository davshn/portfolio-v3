# Spec: Layout

## Purpose

BaseLayout provides the global HTML shell shared by every page. It injects SEO metadata, JSON-LD structured data, global styles, the custom cursor island, the toast notification container, and all third-party global initializations (AOS). The single `index.astro` page composes all section components inside BaseLayout.

---

## Requirements

### Requirement: BaseLayout HTML Shell

The system MUST render a valid HTML5 document with `lang="en"`, a `<head>` containing charset, viewport, favicon links, and slots for SEO metadata, and a `<body>` that accepts a default slot for page content.

#### Scenario: Page renders with correct HTML structure

- GIVEN the site is built with `npm run build`
- WHEN a browser requests the root URL
- THEN the response MUST include `<!DOCTYPE html>`, `<html lang="en">`, a populated `<head>`, and a `<body>` containing rendered section content

#### Scenario: Missing SEO props do not crash the layout

- GIVEN BaseLayout is used without passing optional SEO props
- WHEN the page is rendered
- THEN the layout MUST render with sensible default title and description values and MUST NOT throw a build error

---

### Requirement: Global Style Injection

The system MUST import `src/styles/global.css` within BaseLayout so that the Poppins font, CSS custom properties (design tokens), and base resets are applied to every page.

#### Scenario: Poppins font is applied globally

- GIVEN the page is loaded in a browser
- WHEN any text element is inspected
- THEN the computed font-family MUST include `Poppins`

#### Scenario: CSS design tokens are available

- GIVEN the page is loaded
- WHEN a component references a CSS custom property defined in `global.css`
- THEN the custom property MUST resolve to the correct token value for the active theme

---

### Requirement: Theme System — Body Class Management

The system MUST apply either `theme-light` or `theme-dark` as a class on `<body>`. On first load with no stored preference, `theme-light` MUST be the default. The active class MUST be persisted to `localStorage` under the key `theme-color` and restored on every subsequent page load before first paint to prevent flash of wrong theme.

#### Scenario: First visit defaults to light theme

- GIVEN `localStorage` has no `theme-color` entry
- WHEN the page loads
- THEN `<body>` MUST have class `theme-light` and MUST NOT have class `theme-dark`

#### Scenario: Stored dark preference is restored on reload

- GIVEN `localStorage` contains `theme-color = "theme-dark"`
- WHEN the page loads
- THEN `<body>` MUST have class `theme-dark` before any visible content renders (no flash)

#### Scenario: Theme toggle switches body class and persists preference

- GIVEN the page is loaded with `theme-light` active
- WHEN the user activates the theme toggle
- THEN `<body>` MUST switch to `theme-dark`, and `localStorage["theme-color"]` MUST equal `"theme-dark"`

#### Scenario: Theme toggle is reversible

- GIVEN `theme-dark` is active
- WHEN the user activates the theme toggle
- THEN `<body>` MUST switch to `theme-light`, and `localStorage["theme-color"]` MUST equal `"theme-light"`

---

### Requirement: Custom Cursor Island

The system MUST render a custom cursor React island (`client:only="react"`) using `react-animated-cursor` with the specified parameters: `innerSize=8`, `outerSize=44`, `color="153,153,255"`, `outerAlpha=0.3`, `innerScale=0.7`, `outerScale=1.4`. The island MUST be mounted at the layout level so it is present on every page.

#### Scenario: Custom cursor renders on desktop

- GIVEN the page is loaded in a desktop browser with a pointer device
- WHEN the user moves the mouse
- THEN the custom cursor elements MUST be visible and track the pointer

#### Scenario: Custom cursor does not cause SSR error

- GIVEN the site is built with `npm run build`
- WHEN Astro renders BaseLayout server-side
- THEN the build MUST complete with zero errors related to the cursor island

---

### Requirement: Toast Notification Container

The system MUST render `<ToastContainer />` from `react-toastify` at the layout level with the configuration: `position="top-right"`, `autoClose=2000`, `pauseOnHover`, `draggable`, `closeOnClick`. This ensures toast notifications are available on every page without per-section duplication.

#### Scenario: Toast container is present in the DOM

- GIVEN the page is loaded
- WHEN the DOM is inspected
- THEN exactly one `react-toastify` container element MUST be present

---

### Requirement: AOS Scroll Animation Initialization

The system MUST initialize the AOS library client-side with `{ duration: 1200, once: true }` via a `<script>` tag inside BaseLayout. AOS MUST NOT be initialized server-side.

#### Scenario: AOS initializes after DOM is ready

- GIVEN the page is loaded in a browser
- WHEN the DOM content is loaded
- THEN `AOS.init()` MUST have been called with `duration: 1200` and `once: true`

#### Scenario: AOS attributes trigger animations on scroll

- GIVEN an element has `data-aos="fade-up"` attribute
- WHEN the element enters the viewport
- THEN the element MUST play the fade-up animation exactly once

---

### Requirement: Single-Page Layout Composition

The `index.astro` page MUST compose all five section components inside BaseLayout in this exact order: `Hero` → `About` → `Service` → `Portfolio` → `Contact`. Each section MUST be wrapped in a container that uses the section's corresponding anchor `id` (`#home`, `#about`, `#service`, `#portfolio`, `#contact`).

#### Scenario: All sections are present in page output

- GIVEN `npm run build` completes
- WHEN the built `index.html` is parsed
- THEN elements with `id="home"`, `id="about"`, `id="service"`, `id="portfolio"`, and `id="contact"` MUST all be present in DOM order

#### Scenario: Sections appear in correct order

- GIVEN the page is rendered
- WHEN section positions are measured in the document
- THEN `#home` MUST appear before `#about`, `#about` before `#service`, `#service` before `#portfolio`, and `#portfolio` before `#contact`
