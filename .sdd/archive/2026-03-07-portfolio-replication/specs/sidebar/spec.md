# Spec: Sidebar

## Purpose

The Sidebar is a fixed left navigation panel containing the site logo/name, primary nav links, a dark/light theme toggle, and a mobile hamburger button. It uses scrollspy to highlight the active section link as the user scrolls. On mobile viewports it is hidden off-screen and slides in when toggled.

---

## Requirements

### Requirement: Fixed Left Sidebar Layout

The system MUST render a sidebar that is fixed to the left edge of the viewport, 320px wide on viewports wider than 1500px, 288px wide between 1200px and 1500px, and hidden off-screen (translated left via `translateX(-100%)`) on viewports narrower than 1199px. The sidebar MUST have `transition: all 0.5s ease` applied so it animates in and out smoothly.

#### Scenario: Sidebar is fixed on desktop

- GIVEN a viewport wider than 1199px
- WHEN the user scrolls the page
- THEN the sidebar MUST remain fixed in position and MUST NOT scroll with the page content

#### Scenario: Sidebar is hidden on mobile by default

- GIVEN a viewport narrower than 1199px
- WHEN the page first loads
- THEN the sidebar MUST be translated off-screen to the left and MUST NOT be visible

---

### Requirement: Navigation Links

The sidebar MUST contain navigation links for all five sections in this order: Home, About, Service, Portfolio, Contact. Each link MUST scroll the page to its corresponding section anchor (`#home`, `#about`, `#service`, `#portfolio`, `#contact`) when clicked.

#### Scenario: Nav link scrolls to correct section

- GIVEN the page is loaded
- WHEN the user clicks the "About" nav link
- THEN the viewport MUST scroll to position the `#about` section at or near the top

#### Scenario: All five nav links are present

- GIVEN the page is rendered
- WHEN the sidebar is inspected
- THEN links to `#home`, `#about`, `#service`, `#portfolio`, and `#contact` MUST all be present

---

### Requirement: Scrollspy Active State

The system MUST use `react-scrollspy-nav` to automatically apply the `active` CSS class to the sidebar nav link corresponding to the section currently in view. Configuration MUST be: `scrollTargetIds=["home","about","service","portfolio","contact"]`, `activeNavClass="active"`, `offset=0`, `scrollDuration="100"`.

#### Scenario: Active class updates on scroll

- GIVEN the page is loaded and the user is at the top
- WHEN the user scrolls until the `#about` section is in view
- THEN the "About" nav link MUST have the `active` class, and no other nav link MUST have it

#### Scenario: Active class reflects current section at page load

- GIVEN the page loads with the viewport at the top
- WHEN the DOM is ready
- THEN the "Home" nav link MUST have the `active` class

---

### Requirement: Mobile Hamburger Toggle

The system MUST render a hamburger button visible only on viewports narrower than 1199px. When the hamburger is clicked, the class `menu-open` MUST be toggled on the sidebar element, causing it to slide into view. Clicking the hamburger again MUST remove `menu-open`, hiding the sidebar.

#### Scenario: Hamburger button is only visible on mobile

- GIVEN a viewport wider than 1199px
- WHEN the page is inspected
- THEN the hamburger button MUST NOT be visible

- GIVEN a viewport narrower than 1199px
- WHEN the page is inspected
- THEN the hamburger button MUST be visible

#### Scenario: Hamburger opens sidebar on mobile

- GIVEN a viewport narrower than 1199px and the sidebar is off-screen
- WHEN the user clicks the hamburger button
- THEN the sidebar MUST slide into view (the `menu-open` class is present on the sidebar element)

#### Scenario: Hamburger closes sidebar on second click

- GIVEN the sidebar has `menu-open` and is visible on mobile
- WHEN the user clicks the hamburger button again
- THEN `menu-open` MUST be removed and the sidebar MUST animate off-screen

---

### Requirement: Theme Toggle in Sidebar

The sidebar MUST contain the theme toggle control. The toggle MUST display the moon icon (`FaMoon`) when light theme is active and the sun icon (`FaSun`) when dark theme is active (or alongside a label). Activating the toggle MUST switch the theme as defined in the Layout spec.

#### Scenario: Toggle shows correct icon for active theme

- GIVEN the active theme is `theme-light`
- WHEN the sidebar is rendered
- THEN the moon icon MUST be visible in the toggle

- GIVEN the active theme is `theme-dark`
- WHEN the sidebar is rendered
- THEN the sun icon MUST be visible in the toggle

#### Scenario: Toggle click delegates to theme system

- GIVEN the sidebar is rendered with `theme-light` active
- WHEN the user clicks the theme toggle
- THEN the body class MUST change to `theme-dark` as specified in the Layout spec

---

### Requirement: Sidebar Social Links

The sidebar SHOULD display social profile icon links using Feather Icons (`react-icons/fi`): Facebook (`FiFacebook`), Twitter (`FiTwitter`), Instagram (`FiInstagram`), GitHub (`FiGithub`), LinkedIn (`FiLinkedin`). Each icon MUST link to the correct profile URL defined in CLAUDE.md owner info.

#### Scenario: All social links are present and correct

- GIVEN the sidebar is rendered
- WHEN each social icon link is inspected
- THEN Facebook, Twitter, Instagram, GitHub, and LinkedIn icons MUST each link to the correct profile URL
- AND each link MUST open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`)

---

### Requirement: Scroll-to-Top Button

The system MUST display a scroll-to-top button that becomes visible only after the user has scrolled more than 500px from the top. Clicking the button MUST call `window.scrollTo({ top: 0, behavior: "smooth" })`.

#### Scenario: Button is hidden at top of page

- GIVEN the user is at the top of the page (scrollY <= 500)
- WHEN the page is inspected
- THEN the scroll-to-top button MUST NOT be visible

#### Scenario: Button appears after scrolling

- GIVEN the user scrolls more than 500px down the page
- WHEN the scroll position crosses the 500px threshold
- THEN the scroll-to-top button MUST become visible

#### Scenario: Clicking button scrolls to top smoothly

- GIVEN the scroll-to-top button is visible
- WHEN the user clicks it
- THEN the page MUST smoothly scroll back to the top (scrollY = 0)
