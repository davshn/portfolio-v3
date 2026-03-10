# Spec: Service

## Purpose

The Service section presents four service offering cards. Each card has a parallax tilt hover effect and opens a detail modal when clicked. Service data comes from an Astro Content Collection. The interactive behavior (tilt, modals) is implemented as a React island.

---

## Requirements

### Requirement: Service Section Structure

The system MUST render a Service section with `id="service"` containing exactly four service cards laid out in a grid. All service data MUST come from the services content collection, not hardcoded template strings.

#### Scenario: Four service cards are rendered

- GIVEN the services content collection contains four entries
- WHEN the `#service` section is rendered
- THEN exactly four cards MUST be visible

#### Scenario: Service cards are populated from content collection

- GIVEN the services content collection is updated with a different title
- WHEN the service section is rendered
- THEN the updated title MUST appear in the corresponding card

---

### Requirement: Four Service Entries

The services content collection MUST define exactly four entries with these titles and descriptions:
1. "Development as a service" — agile/scrum cycles with client planning sessions
2. "Custom software" — tailored solutions with security-first development
3. "Vulnerability scan" — network/infrastructure security assessment
4. "Mobile App Development" — Android and iOS, native and hybrid

#### Scenario: All four service titles match specification

- GIVEN the service section is rendered
- WHEN the four card titles are read
- THEN they MUST match exactly: "Development as a service", "Custom software", "Vulnerability scan", "Mobile App Development"

---

### Requirement: Parallax Tilt on Service Cards

The system MUST wrap each service card in a `react-parallax-tilt` component (React island, `client:visible`). Default tilt settings MUST be used (no custom tilt configuration overrides).

#### Scenario: Tilt effect is active on desktop hover

- GIVEN the service section is rendered and JavaScript is enabled
- WHEN the user hovers over a service card on a desktop device
- THEN the card MUST exhibit the parallax tilt transform

#### Scenario: Tilt component does not break card rendering without JS

- GIVEN JavaScript is disabled
- WHEN the service section is rendered
- THEN the service cards MUST still be visible (progressive enhancement — tilt is enhancement only)

---

### Requirement: Service Detail Modal

Each service card MUST open a detail modal when clicked. The modal MUST use `react-modal` with `className="custom-modal"`, `overlayClassName="custom-overlay"`, `closeTimeoutMS=500`. The modal MUST display the full service description for the selected card.

#### Scenario: Clicking a card opens the correct service modal

- GIVEN the service section is rendered
- WHEN the user clicks the "Custom software" card
- THEN a modal MUST open displaying the full description for "Custom software"

#### Scenario: Modals for different cards show different content

- GIVEN the service section is rendered
- WHEN the user opens the modal for "Vulnerability scan"
- THEN the modal MUST show the vulnerability scan description, not content from another service

#### Scenario: Only one service modal is open at a time

- GIVEN one service modal is already open
- WHEN (this state should be prevented by UX design — opening another card first requires closing the current modal)
- THEN at most one modal MUST be open at any time

---

### Requirement: Service Modal Close Behavior

The service detail modal MUST close when the user clicks the close button (using `/img/svg/cancel.svg`) or clicks the overlay backdrop. The close animation MUST respect `closeTimeoutMS=500`.

#### Scenario: Close button dismisses the service modal

- GIVEN a service modal is open
- WHEN the user clicks the close button
- THEN the modal MUST close within 500ms of the click

#### Scenario: Overlay click closes the service modal

- GIVEN a service modal is open
- WHEN the user clicks the overlay backdrop
- THEN the modal MUST close

---

### Requirement: Service Section AOS Animations

Service cards MUST use `data-aos="fade-up"` with `data-aos-duration="1200"` and staggered `data-aos-delay` values (100ms increments: 100, 200, 300, 400) for the four cards.

#### Scenario: AOS stagger delay is applied per card

- GIVEN the service section is rendered
- WHEN the four card elements are inspected
- THEN the first card MUST have `data-aos-delay="100"`, second `"200"`, third `"300"`, fourth `"400"`
