# Spec: UI Primitives

## Purpose

The `src/components/ui/` directory contains reusable, framework-agnostic primitive components: Button, Badge, Icon, Modal, ProgressBar, ThemeToggle, and ScrollToTop. These primitives encapsulate design system tokens and shared interaction patterns, and are consumed by section and layout components.

---

## Requirements

### Requirement: Button Primitive

The system MUST provide a `Button` component (`.astro` or `.tsx`) that accepts `label` (string), `href` (optional string for link variant), `variant` (optional: `"primary"` | `"outline"`, default `"outline"`), and `download` (optional boolean). The button MUST apply border `2px solid #7e7e7e`, `border-radius: 6px` in light theme. On hover, background MUST change to `#1a1a1a` and text to `#fff`.

#### Scenario: Button renders as an anchor when href is provided

- GIVEN a `Button` is rendered with an `href` prop
- WHEN the DOM is inspected
- THEN the button MUST render as an `<a>` element with the correct `href`

#### Scenario: Button renders as a button element when no href

- GIVEN a `Button` is rendered without an `href` prop
- WHEN the DOM is inspected
- THEN it MUST render as a `<button>` element

#### Scenario: Button has download attribute when specified

- GIVEN a `Button` is rendered with `download={true}` and an `href`
- WHEN the DOM is inspected
- THEN the anchor element MUST have the `download` attribute present

#### Scenario: Button hover state changes background in light theme

- GIVEN `theme-light` is active and the Button is rendered
- WHEN the user hovers over the button
- THEN the background MUST transition to `#1a1a1a` and text color to `#fff`

---

### Requirement: Badge Primitive

The system MUST provide a `Badge` component that accepts a `text` string prop and renders it with appropriate badge styling (pill or rectangular, consistent with design tokens). The "6+ Years of Experience" badge in the About section MUST use this component.

#### Scenario: Badge renders with provided text

- GIVEN a `Badge` is rendered with `text="6+ Years of Experience"`
- WHEN the DOM is inspected
- THEN the badge element MUST contain the exact text `"6+ Years of Experience"`

---

### Requirement: Icon Primitive

The system MUST provide an `Icon` component that accepts a `name` string and renders the corresponding `react-icons` icon. It MUST support both the `fi` (Feather) and `fa` (Font Awesome) icon sets. The icon MUST accept an optional `size` prop (number, default 20) and `className` prop.

#### Scenario: Icon renders the correct Feather icon

- GIVEN an `Icon` is rendered with `name="FiGithub"`
- WHEN the DOM is inspected
- THEN an SVG element corresponding to the GitHub Feather icon MUST be present

#### Scenario: Icon renders the correct Font Awesome icon

- GIVEN an `Icon` is rendered with `name="FaMoon"`
- WHEN the DOM is inspected
- THEN an SVG element corresponding to the moon Font Awesome icon MUST be present

---

### Requirement: Modal Primitive

The system MUST provide a `Modal` component (`.tsx`, React island) that wraps `react-modal` and accepts: `isOpen` (boolean), `onClose` (function), `className` (optional string, appended to `custom-modal`), `children` (ReactNode). It MUST apply `overlayClassName="custom-overlay"` and `closeTimeoutMS=500` by default.

#### Scenario: Modal renders children when open

- GIVEN `Modal` is rendered with `isOpen={true}` and child content
- WHEN the DOM is inspected
- THEN the child content MUST be visible inside the modal

#### Scenario: Modal is not in DOM when closed

- GIVEN `Modal` is rendered with `isOpen={false}`
- WHEN the DOM is inspected
- THEN the modal content MUST NOT be present in the DOM (or MUST be hidden per react-modal behavior)

#### Scenario: onClose is called when overlay is clicked

- GIVEN `Modal` is open and `onClose` is a mock function
- WHEN the overlay backdrop is clicked
- THEN `onClose` MUST be called exactly once

---

### Requirement: ProgressBar Primitive

The system MUST provide a `ProgressBar` component that accepts `label` (string), `percentage` (number, 0–100), and renders a labeled progress bar with the fill width equal to `{percentage}%`. The bar MUST have an accessible `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"` on the progress element.

#### Scenario: ProgressBar renders with correct width

- GIVEN a `ProgressBar` with `percentage={85}`
- WHEN the fill element's style is inspected
- THEN its width MUST be `85%`

#### Scenario: ProgressBar has accessibility attributes

- GIVEN a `ProgressBar` is rendered
- WHEN the progress element is inspected
- THEN `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` MUST all be present with correct values

---

### Requirement: ThemeToggle Primitive

The system MUST provide a `ThemeToggle` component (`.tsx`, React island, `client:load`) that reads the current theme from `localStorage["theme-color"]`, toggles between `theme-light` and `theme-dark` on the `<body>` element, and persists the new value to `localStorage`. It MUST render the `FaMoon` icon when light theme is active and `FaSun` when dark is active.

#### Scenario: ThemeToggle reads initial state from localStorage

- GIVEN `localStorage["theme-color"]` is `"theme-dark"` before the page loads
- WHEN the ThemeToggle renders
- THEN it MUST show the sun icon (`FaSun`) indicating dark mode is active

#### Scenario: ThemeToggle click updates body class and localStorage

- GIVEN `theme-light` is active
- WHEN the ThemeToggle is clicked
- THEN `document.body` MUST have class `theme-dark` removed of `theme-light`, and `localStorage["theme-color"]` MUST equal `"theme-dark"`

---

### Requirement: ScrollToTop Primitive

The system MUST provide a `ScrollToTop` component (`.tsx`, React island, `client:load`) that listens to `window.scroll` events and becomes visible when `window.scrollY > 500`. When clicked, it calls `window.scrollTo({ top: 0, behavior: "smooth" })`.

#### Scenario: ScrollToTop is hidden below 500px scroll threshold

- GIVEN the component is mounted and `window.scrollY` is 200
- WHEN the component renders
- THEN the button MUST NOT be visible (hidden via CSS or conditional render)

#### Scenario: ScrollToTop becomes visible above 500px threshold

- GIVEN the user scrolls to `window.scrollY = 600`
- WHEN the scroll event fires
- THEN the button MUST become visible

#### Scenario: Clicking ScrollToTop scrolls to top

- GIVEN the button is visible
- WHEN the user clicks it
- THEN `window.scrollTo` MUST be called with `{ top: 0, behavior: "smooth" }`

---

### Requirement: TypeScript Strict Typing for UI Primitives

All UI primitive components MUST define their props using TypeScript interfaces or type aliases. No `any` or implicit `any` types are permitted in primitive component files. React island primitives MUST define `FC<Props>` or equivalent explicit return type.

#### Scenario: TypeScript strict mode accepts primitive usage

- GIVEN all UI primitives are used in section components with typed props
- WHEN `tsc --noEmit` is run
- THEN zero type errors related to UI primitive prop types MUST be reported

#### Scenario: Passing an incorrect prop type produces a compile error

- GIVEN a `ProgressBar` is rendered with `percentage="ninety"` (string instead of number)
- WHEN TypeScript compilation runs
- THEN a type error MUST be reported indicating `percentage` expects a number
