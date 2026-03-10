# Manual QA Checklist — portfolio-replication

Run `npm run preview` then open http://localhost:4321 in a browser.

## 14.3 — Animations & Interactions
- [ ] AOS animations trigger on scroll for all sections (Hero, About, Service, Portfolio, Contact)
- [ ] Scroll-to-top button appears after scrolling 500px and clicking scrolls smoothly to top
- [ ] Theme toggle persists between page reloads (check localStorage["theme-color"] in DevTools)
- [ ] Sidebar scrollspy active class updates as sections enter viewport

## 14.4 — Responsive (< 1199px viewport)
- [ ] Sidebar is hidden off-screen
- [ ] Hamburger button is visible and slides sidebar in/out on click
- [ ] Portfolio carousel shows 1 item (not 3)
- [ ] Body font-size is 16px

## 14.5 — SEO (View Source)
- [ ] `<title>David Figueroa | Fullstack Developer</title>` is present
- [ ] `<meta name="description">` is present and non-empty
- [ ] `<link rel="canonical">` is present
- [ ] All 5 OG tags are present (og:title, og:description, og:type, og:url, og:image)
- [ ] `<script type="application/ld+json">` contains Person schema with name "Hernán David Figueroa Cárdenas"

## 14.6 — Modals
- [ ] About "See More" button opens modal with 4 tabs
- [ ] About modal closes via close button and overlay click
- [ ] All 4 Service cards open correct service detail modal
- [ ] All 3 Portfolio items open correct project modal
- [ ] Portfolio project modal shows live link only when liveUrl is defined

## 14.7 — Contact Form
- [ ] Form shows browser validation on empty submit
- [ ] With valid EmailJS env vars in .env, form submits and shows success toast
- [ ] On network error, error toast appears without uncaught JS exception
- [ ] Submit button is disabled when EmailJS env vars are missing (shows env-warning)
