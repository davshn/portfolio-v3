# Project Configuration

# Read by sdd-apply and sdd-verify sub-agents during implementation.

# Does not modify orchestrator behavior — adds project context and skill selection.

---

## Domain Context

Personal developer portfolio for **David Figueroa** (Hernán David Figueroa Cárdenas) — Fullstack Developer based in Bogota, Colombia. 6+ years of experience. Available for freelance. Target audience: potential clients and employers.

### Owner info (used across sections)

- **Name**: David Figueroa · **Full name**: Hernán David Figueroa Cárdenas
- **Role titles** (typed animation in hero): Fullstack Developer · Web Developer · Mobile Developer
- **Location**: Galan, Bogota, Colombia · **Phone**: +57 3106961637 · **Email**: davshn@gmail.com
- **Languages**: Spanish, English · **Discord**: Davshn#3361 · **Freelance**: Available
- **Social links**: Facebook `/david.figueroa.184` · Twitter `@davshmr` · Instagram `@davidfigueroa9055` · GitHub `davshn` · LinkedIn `davshn`
- **Stats**: 6+ years experience

### Page structure

Single-page app. Fixed left sidebar with scrollspy nav. Sections in order: `#home` → `#about` → `#service` → `#portfolio` → `#contact`. Dark/light theme toggle (persisted in localStorage as `theme-color`).

### Section content

**Hero** — Photo, typed role titles, short bio (`"Fullstack Developer based In Colombia, over 6 years of professional experience."`), social icons, Download CV button linking to the PDF.

**About** — Left: bio text + skill bars (progress bars, % based). Right: about photo with "6+ Years of Experience" badge. "See More" button opens a modal with 4 sub-sections: Personal Info · Achievements · Experience · Education.

- Skills (name → %): React.js 95 · React Native 90 · Express 90 · Next.js 90 · TypeScript 85 · PostgreSQL 80
- Achievements: 06 years experience · 37 completed projects · 21 happy customers
- Experience: 2023–Present Mobile Dev @ Mento · 2022–Present Lead Dev @ Logistecsa-Bentex · 2022–2023 Mobile Dev @ Orbis Data · 2019–2022 Fullstack Dev @ Koscrypt · 2014–2016 Junior Dev @ SDIS
- Education: 2018 Systems Engineering BSc @ District University of Bogota · 2019 Fullstack Bootcamp @ HENRY

**Service** — 4 cards with tilt hover effect, each opens a detail modal:

1. Development as a service — agile/scrum cycles with client planning sessions
2. Custom software — tailored solutions with security-first development
3. Vulnerability scan — network/infrastructure security assessment
4. Mobile App Development — Android & iOS, native and hybrid

**Portfolio** — Carousel (3 visible desktop / 1 mobile), each item opens a detail modal with project description, client, category, date, and live link:

1. **Mento** — Fintech mobile app (Chile). Stack: React Native, Redux, Redux Saga, React Navigation + Node/Express/PostgreSQL
2. **Metro Delivery** — Logistics mobile app (Logistecsa). Stack: React Native, Redux, Redux Saga, React Navigation
3. **Mingga** — ONG web app. Stack: React + Node/Express/PostgreSQL

**Contact** — Address cards (phone, email, location) + contact form (name, email, message) + embedded map. Form sends via EmailJS.

### Visual design & interactions

**Typography**

- Font: `Poppins` (Google Fonts, weights 300–900) — applied globally
- Base body: 18px / #7e7e7e · Mobile: 16px
- Headings: #1a1a1a · Scale: h1=45px, h2=36px, h3=30px, h4=24px, h5=20px, h6=16px

**Color palette**

- Light — bg: #fff · text: #7e7e7e · headings: #1a1a1a · brand/accent: #34495e · section alt bg: #f5f5f5 / #f5f8fc
- Dark — bg: #111319 · hero bg: #191c26 · sidebar/header: #34495e · text: #a9afc3 · headings: #fff
- Buttons (light): border 2px solid #7e7e7e · radius 6px · hover: bg #1a1a1a, color #fff

**Sidebar**

- Fixed left, 320px wide (288px at 1200–1500px viewport)
- Mobile (<1199px): hidden off-screen via `translateX(-100%)`, slides in when `.menu-open` toggled by hamburger button
- `transition: all 0.5s ease` on slide-in/out

**Scroll animations (AOS)**

- Initialized globally: `{ duration: 1200, once: true }`
- Usage pattern: `data-aos="fade-right|fade-up|fade-left"` + `data-aos-duration="1200"` + `data-aos-delay` in 100ms steps (100, 200, 300, 400, 500)

**Custom cursor (react-animated-cursor)**

- `innerSize=8` · `outerSize=44` · `color="153,153,255"` (soft purple-blue) · `outerAlpha=0.3` · `innerScale=0.7` · `outerScale=1.4`
- Loaded dynamically with `ssr: false`

**Typed text (react-typed / hero)**

- `typeSpeed=150` · `backSpeed=60` · `backDelay=1` · `loop` · `showCursor` with `cursorChar="|"`
- Strings: `["Fullstack Developer", "Web Developer", "Mobile Developer"]`

**Parallax tilt (react-parallax-tilt)**

- Applied to service cards only — default settings (no custom tilt config)

**Carousel (react-slick — portfolio)**

- `slidesToShow=3` desktop · `1` mobile (<575px) · `speed=800` · `infinite` · no autoplay
- Desktop: `draggable=false` · Mobile: `draggable=true`, `dots=true`, `arrow=false`, `speed=300`

**Modals (react-modal)**

- `className="custom-modal"` · `overlayClassName="custom-overlay"` · `closeTimeoutMS=500`
- About modal adds `about-popup-wrapper` to className. Close button uses `/img/svg/cancel.svg`

**Tooltips (react-tooltip)**

- On portfolio thumbnail images: `place="bottom"` · `type="light"` · `effect="float"`

**Scroll to top**

- Button appears after 500px scroll · `window.scrollTo({ top: 0, behavior: "smooth" })`

**Google Maps embed**

- Coordinates: Bogota, Colombia — `4.6482975, -74.107807`

**Scrollspy (react-scrollspy-nav — sidebar)**

- Tracks scroll position and adds `active` class to the matching nav link automatically
- `scrollTargetIds`: `["home","about","service","portfolio","contact"]` · `activeNavClass="active"` · `offset=0` · `scrollDuration="100"`

**Toast notifications (react-toastify — contact form)**

- Success: `"Message Sent Successfully!"` · Error: `"Ops Message Not Sent!"`
- Config: `position="top-right"` · `autoClose=2000` · `pauseOnHover` · `draggable` · `closeOnClick`
- `<ToastContainer />` mounted globally in `_app.js`

**Icons (react-icons)**

- Social links use `fi` set (Feather Icons): `FiFacebook` · `FiTwitter` · `FiInstagram` · `FiGithub` · `FiLinkedin`
- Theme toggle uses `fa` set (Font Awesome): `FaMoon` (dark mode label) · `FaSun` (light mode label)

### Library reference (for re-implementation)

| Effect / Feature    | Library                          | Notes                           |
| ------------------- | -------------------------------- | ------------------------------- |
| Custom cursor       | `react-animated-cursor`          | ssr: false                      |
| Typed text          | `react-typed`                    | loop, cursor `\|`               |
| Parallax tilt       | `react-parallax-tilt`            | service cards                   |
| Scroll animations   | `aos`                            | duration 1200, once             |
| Carousel            | `react-slick` + `slick-carousel` | portfolio                       |
| Modals              | `react-modal`                    | services, portfolio, about      |
| Tooltips            | `react-tooltip`                  | portfolio thumbnails            |
| Scrollspy nav       | `react-scrollspy-nav`            | sidebar active state            |
| Toast notifications | `react-toastify`                 | contact form feedback           |
| Icons               | `react-icons`                    | fi (social) + fa (theme toggle) |
| Contact email       | `@emailjs/browser`               | no backend needed               |

### Business rules

- Theme toggle modifies `<body>` classnames (`theme-light` / `theme-dark`) and persists to `localStorage` under key `theme-color`
- Every public page needs unique `<title>`, `<meta name="description">`, and canonical URL
- Performance targets: LCP < 2.5s, CLS < 0.1

---

## Architecture Rules

### Structure

- Flat structure by concern: `pages/` · `layouts/` · `components/` · `content/` · `assets/` · `styles/` · `seo/` · `utils/`
- No `app/`, no `modules/`, no `shared/` — everything is already global at this scale
- `src/env.d.ts` is the only global types file — component and util types live alongside their source file

### Pages and layouts

- `src/pages/` is file-based routing — Astro controls it, never restructure it
- `src/layouts/` holds BaseLayout and any variant layouts — always at `src/` level, never inside `pages/`
- Every page must use a layout that injects SEO, structured data (JSON-LD), and canonical URL

### Components

- Three folders only — no deeper nesting:
  - `components/ui/` — reusable primitives (Button, Badge, Icon) — framework-agnostic when possible
  - `components/sections/` — landing-specific blocks (Hero, Pricing, FAQ) — `.astro` by default
  - `components/layout/` — Header, Footer, Shell
- Default to `.astro` — use React islands only when interactivity is strictly required
- React islands use `client:visible` by default — `client:load` only when above the fold

### Content

- `src/content/` is reserved for Astro Content Collections — always define a Zod schema in `config.ts`
- Copy, CTAs, and structured page data belong in a collection — not hardcoded in components

### Assets and styles

- `src/assets/` — images processed via `astro:assets` (automatic optimization)
- `public/` — unprocessed static files (favicons, robots.txt, og images) — outside `src/`, Astro controls it
- `src/styles/` — global CSS and design tokens only — no component styles here
- All Tailwind customization through design system tokens — no arbitrary values

### State

- Redux Toolkit only for interactive React islands that share cross-component state
- Prefer local `useState` for island-scoped interactions — RTK is the exception, not the default

### SEO

- `src/seo/` holds the SEO component, JSON-LD helpers, and OG tag utilities
- All structured data must be present on every public page via the base layout
- `seo-geo` skill is always active — not optional for any public-facing task

---

## Active Skills

**MANDATORY FOR ORCHESTRATOR AND SUB-AGENTS**: Before writing any code for this project, invoke the skills listed below for the task type using the Skill tool. Do NOT delegate to a sub-agent without first loading the relevant skills and including their output in the sub-agent prompt. Skipping skills is not allowed — it produces non-compliant output (e.g. inline styles instead of Tailwind tokens, missing SEO metadata, weak TypeScript types).

### Available skills

| Skill                         | Path                                            | When to load                          |
| ----------------------------- | ----------------------------------------------- | ------------------------------------- |
| `typescript-advanced-types`   | `~/.claude/skills/typescript-advanced-types/`   | Always                                |
| `security-best-practices`     | `~/.claude/skills/security-best-practices/`     | Always                                |
| `javascript-testing-patterns` | `~/.claude/skills/javascript-testing-patterns/` | Testing phases                        |
| `frontend-design`             | `~/.claude/skills/frontend-design/`             | Any page, section, or UI component    |
| `tailwind-design-system`      | `~/.claude/skills/tailwind-design-system/`      | Any component using Tailwind          |
| `seo-geo`                     | `~/.claude/skills/seo-geo/`                     | Every public page — always            |
| `vercel-react-best-practices` | `~/.claude/skills/vercel-react-best-practices/` | React island components               |
| `redux-toolkit`               | `~/.claude/skills/redux-toolkit/`               | Interactive islands with shared state |

### Load combinations by task type

**Astro page or layout:**
frontend-design, tailwind-design-system, seo-geo, typescript-advanced-types

**Section component (.astro):**
frontend-design, tailwind-design-system, typescript-advanced-types

**React island (interactive section):**
frontend-design, tailwind-design-system, vercel-react-best-practices, typescript-advanced-types

**React island with shared state:**
frontend-design, tailwind-design-system, vercel-react-best-practices, redux-toolkit, typescript-advanced-types

**Content collection (schema + data):**
typescript-advanced-types

**SEO or metadata task:**
seo-geo, typescript-advanced-types

**Testing phase:**
javascript-testing-patterns, typescript-advanced-types

### Explicitly excluded

| Skill                         | Reason                               |
| ----------------------------- | ------------------------------------ |
| `next-best-practices`         | This project uses Astro, not Next.js |
| `react-native-best-practices` | Web only                             |
| `building-native-ui`          | Web only                             |
| `expo-tailwind-setup`         | Web only                             |
