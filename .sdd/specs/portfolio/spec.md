# Spec: Portfolio

## Purpose

The Portfolio section presents completed project work in a carousel. On desktop, three items are visible simultaneously; on mobile, one item is visible. Each item has a tooltip on the thumbnail image and opens a project detail modal on click. Portfolio data comes from an Astro Content Collection. The carousel and modals are implemented as a React island.

---

## Requirements

### Requirement: Portfolio Section Structure

The system MUST render a Portfolio section with `id="portfolio"` containing a carousel of project cards. All project data MUST come from the projects content collection, not hardcoded template strings.

#### Scenario: Portfolio section is present in the DOM

- GIVEN the page is rendered
- WHEN the DOM is inspected
- THEN an element with `id="portfolio"` MUST be present

#### Scenario: Portfolio cards are generated from content collection

- GIVEN the projects content collection contains three project entries
- WHEN the portfolio section is rendered
- THEN exactly three project cards MUST be present in the carousel

---

### Requirement: Three Portfolio Projects

The projects content collection MUST define exactly three entries:
1. **Mento** — Fintech mobile app (Chile). Stack: React Native, Redux, Redux Saga, React Navigation + Node/Express/PostgreSQL
2. **Metro Delivery** — Logistics mobile app (Logistecsa). Stack: React Native, Redux, Redux Saga, React Navigation
3. **Mingga** — ONG web app. Stack: React + Node/Express/PostgreSQL

Each entry MUST include: title, client, category, date, description, tech stack, thumbnail image reference, and optional live link.

#### Scenario: All three projects are present with required fields

- GIVEN the projects content collection is loaded
- WHEN each entry is validated against the Zod schema
- THEN all three entries MUST pass schema validation with no missing required fields

---

### Requirement: Carousel — Desktop Behavior

The system MUST render the portfolio carousel using `react-slick` with `slidesToShow=3`, `speed=800`, `infinite=true`, `draggable=false` on viewports wider than 575px. Navigation arrows MUST be present on desktop.

#### Scenario: Three slides are visible simultaneously on desktop

- GIVEN a viewport wider than 575px and the carousel is rendered
- WHEN the portfolio section is inspected
- THEN exactly three project cards MUST be simultaneously visible in the carousel

#### Scenario: Carousel is navigable via arrows on desktop

- GIVEN the carousel is rendered on desktop
- WHEN the user clicks the next arrow
- THEN the carousel MUST advance to the next slide set

---

### Requirement: Carousel — Mobile Behavior

The system MUST render the carousel with `slidesToShow=1`, `speed=300`, `draggable=true`, `dots=true`, `arrows=false` on viewports narrower than 575px.

#### Scenario: One slide is visible on mobile

- GIVEN a viewport narrower than 575px
- WHEN the portfolio section is rendered
- THEN only one project card MUST be visible at a time

#### Scenario: Dot indicators are present on mobile

- GIVEN a viewport narrower than 575px
- WHEN the carousel is rendered
- THEN pagination dot indicators MUST be visible below the carousel

#### Scenario: Carousel is swipeable on mobile

- GIVEN the carousel is rendered on mobile
- WHEN the user drags/swipes the carousel
- THEN the carousel MUST advance to the adjacent slide

---

### Requirement: Portfolio Thumbnail Tooltip

Each portfolio project thumbnail MUST show a tooltip on hover using `react-tooltip` with configuration: `place="bottom"`, `type="light"`, `effect="float"`. The tooltip content MUST display the project title.

#### Scenario: Tooltip appears on thumbnail hover

- GIVEN the portfolio carousel is rendered on desktop
- WHEN the user hovers over a project thumbnail
- THEN a light-themed tooltip MUST appear below the image showing the project title

#### Scenario: Tooltip does not render on mobile (pointer device absent)

- GIVEN the carousel is rendered on a touch-only device
- WHEN the user taps a thumbnail
- THEN the tooltip MUST NOT interfere with the tap action (modal should open instead)

---

### Requirement: Portfolio Project Detail Modal

Clicking a project card or thumbnail MUST open a detail modal for that project. The modal MUST use `react-modal` with `className="custom-modal"`, `overlayClassName="custom-overlay"`, `closeTimeoutMS=500`. The modal MUST display: project title, description, client, category, date, tech stack, and a live link (if available).

#### Scenario: Clicking a card opens the correct project modal

- GIVEN the portfolio carousel is rendered
- WHEN the user clicks the "Mento" project card
- THEN a modal MUST open displaying Mento's title, description, client (Chile), category, date, and tech stack

#### Scenario: Live link is present when available

- GIVEN a project entry in the collection has a live link field populated
- WHEN the project detail modal is open
- THEN a clickable live link MUST be rendered in the modal

#### Scenario: Live link is absent when not defined

- GIVEN a project entry has no live link defined
- WHEN the project detail modal is open
- THEN no broken or empty link element MUST be rendered for the live link

---

### Requirement: Portfolio Modal Close Behavior

The portfolio detail modal MUST close when the user clicks the close button (using `/img/svg/cancel.svg`) or clicks the overlay backdrop.

#### Scenario: Close button dismisses the portfolio modal

- GIVEN a portfolio project modal is open
- WHEN the user clicks the close button
- THEN the modal MUST close within 500ms

#### Scenario: Overlay click closes the portfolio modal

- GIVEN a portfolio project modal is open
- WHEN the user clicks the overlay backdrop
- THEN the modal MUST close

---

### Requirement: Portfolio Section AOS Animations

The portfolio section heading and carousel container MUST use AOS attributes (`data-aos="fade-up"`, `data-aos-duration="1200"`) to animate in on scroll.

#### Scenario: AOS attributes are present on portfolio section

- GIVEN the portfolio section is rendered
- WHEN the heading and carousel container are inspected
- THEN they MUST have the correct `data-aos` and `data-aos-duration` attributes
