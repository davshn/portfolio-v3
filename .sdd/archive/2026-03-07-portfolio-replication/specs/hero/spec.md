# Spec: Hero

## Purpose

The Hero section is the first visible section of the portfolio, identified by `id="home"`. It presents the owner's photo, a typed animation cycling through role titles, a short bio, social icon links, and a Download CV button.

---

## Requirements

### Requirement: Hero Section Structure

The system MUST render a Hero section with `id="home"` containing: a profile photo, the owner's name (`David Figueroa`), a typed role title animation, a short bio paragraph, a row of social icon links, and a Download CV button.

#### Scenario: All required hero elements are present

- GIVEN the page is loaded
- WHEN the `#home` section is inspected
- THEN a profile photo, name heading, typed animation element, bio text, social icons, and Download CV button MUST all be present

---

### Requirement: Typed Role Title Animation

The system MUST render a React island using `react-typed` that cycles through `["Fullstack Developer", "Web Developer", "Mobile Developer"]` with `typeSpeed=150`, `backSpeed=60`, `backDelay=1`, `loop=true`, `showCursor=true`, `cursorChar="|"`. This island MUST use `client:load` because it is above the fold.

#### Scenario: Typed animation starts on page load

- GIVEN the page is fully loaded in a browser with JavaScript enabled
- WHEN the hero section is visible
- THEN the typed animation MUST begin typing the first string `"Fullstack Developer"` with the cursor `|` visible

#### Scenario: Typed animation loops through all three strings

- GIVEN the typed animation is running
- WHEN the animation completes the first full cycle
- THEN all three strings — "Fullstack Developer", "Web Developer", "Mobile Developer" — MUST have been typed and deleted in sequence

#### Scenario: Typed animation does not render on SSR

- GIVEN the site is built with `npm run build`
- WHEN Astro renders the hero server-side
- THEN the typed island MUST NOT cause a hydration mismatch or SSR error

---

### Requirement: Hero Profile Photo

The system MUST render the owner's profile photo using `astro:assets` image processing. The image MUST have a meaningful `alt` attribute and MUST NOT cause layout shift (explicit width and height or aspect ratio MUST be set).

#### Scenario: Profile photo renders with correct alt text

- GIVEN the hero section is rendered
- WHEN the profile photo element is inspected
- THEN it MUST have a non-empty `alt` attribute describing the owner

#### Scenario: Profile photo does not cause CLS

- GIVEN the page loads
- WHEN the profile photo loads
- THEN the CLS contribution from the photo MUST be 0 (dimensions are reserved in advance)

---

### Requirement: Hero Bio Text

The system MUST display the bio text: `"Fullstack Developer based In Colombia, over 6 years of professional experience."` This text MUST come from a content source (content collection or props) and MUST NOT be hardcoded inline in the component template.

#### Scenario: Bio text matches specification

- GIVEN the hero section is rendered
- WHEN the bio paragraph is read
- THEN it MUST contain the exact text: `"Fullstack Developer based In Colombia, over 6 years of professional experience."`

---

### Requirement: Hero Social Links

The hero section MUST display the same social icon links as the sidebar (Facebook, Twitter, Instagram, GitHub, LinkedIn) using Feather Icons, each linking to the correct profile URL with `target="_blank"` and `rel="noopener noreferrer"`.

#### Scenario: Social links are present and accessible

- GIVEN the hero section is rendered
- WHEN the social icon links are inspected
- THEN all five icons MUST be present with correct `href` values and secure external link attributes

---

### Requirement: Download CV Button

The hero section MUST contain a button/link labeled "Download CV" that links to the CV PDF file in `public/`. The link MUST use the `download` attribute to trigger a file download. The button MUST follow the Button primitive styling: `border: 2px solid #7e7e7e`, `border-radius: 6px`, hover state changes background to `#1a1a1a` and text to `#fff` in light theme.

#### Scenario: Download CV link triggers file download

- GIVEN the hero section is rendered
- WHEN the user clicks "Download CV"
- THEN the browser MUST initiate a download of the CV PDF file

#### Scenario: Download CV button is styled correctly in light theme

- GIVEN `theme-light` is active
- WHEN the Download CV button is rendered
- THEN it MUST have a visible border and the correct border-radius per the design spec

---

### Requirement: Hero AOS Animations

The hero section elements MUST use AOS scroll animation attributes as follows: `data-aos="fade-right"` on the photo/left column, `data-aos="fade-left"` on the text/right column. Each animated element MUST include `data-aos-duration="1200"`.

#### Scenario: AOS attributes are present on hero elements

- GIVEN the hero section is rendered
- WHEN animated elements are inspected
- THEN each MUST have the correct `data-aos` and `data-aos-duration` attributes
