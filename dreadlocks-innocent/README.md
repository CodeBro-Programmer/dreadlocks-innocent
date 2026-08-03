# Dreadlocks Innocent — Website

A premium, animated, fully responsive booking website for **Dreadlocks
Innocent**, a loc studio at 7 Shell Location Road, Off NTA Road, Mgbuoba,
Port Harcourt, Nigeria.

Built as static HTML, CSS, and vanilla JavaScript (ES modules) — no build
step, no framework, no backend required to preview it.

---

## Quick start

This is a static site, so it just needs a local web server (ES module
imports don't work from `file://` in most browsers).

```bash
# From the project folder, pick one:
python3 -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080` in your browser.

---

## Project structure

```
project/
│
├── index.html          Home
├── about.html           About / our story / meet the loctician
├── services.html        Services & pricing, "how booking works"
├── gallery.html          Masonry gallery, filters, lightbox
├── booking.html          Appointment booking form (demo mode)
├── contact.html          Address, map, hours, socials, FAQ
│
├── css/
│   ├── global.css        Design tokens (color/type/spacing), reset, base type
│   ├── components.css     Reusable UI: nav, buttons, cards, forms, footer…
│   ├── pages.css          Page-specific layout (hero, booking layout, etc.)
│   ├── animations.css     Keyframes and reveal-state CSS hooks for GSAP
│   └── responsive.css     Tablet/mobile breakpoints
│
├── js/
│   ├── main.js            Entry point — wires up every module per page
│   ├── navigation.js       Sticky header, mobile drawer, active link
│   ├── booking.js          Form validation + demo submission + summary
│   ├── gallery.js          Category filters + accessible lightbox
│   ├── animations.js       GSAP: preloader, scroll reveals, counters,
│   │                         testimonial slider, FAQ accordion
│   └── utils.js            Shared helpers (qs/qsa, debounce, focus trap…)
│
├── assets/
│   ├── images/            Generated OG share-image placeholder
│   ├── icons/              favicon.svg (brand rope mark)
│   └── fonts/              (empty — fonts are loaded from Google Fonts CDN)
│
└── README.md
```

Every page shares the same header, footer, and floating action buttons
(WhatsApp + call + back-to-top), so navigation, contact details, and hours
only need to be updated in one place per file — see below.

---

## Content that still needs the real thing

The build uses real, publicly available business details (address, phone
numbers, hours, social handle) wherever they were available. A few things
are placeholders and should be swapped before launch:

1. **Photography.** Every image slot is an elegant SVG placeholder card
   with a caption like *"Add photo: retwist finish"*. Search
   `placeholder-art` in the HTML files to find every slot — each one
   accepts a normal `<img>` in place of the inline SVG once you have
   approved studio photos.
2. **`assets/images/og-cover.svg`.** A generated share-image used for
   social previews (Open Graph / Twitter cards). Replace with a real
   photo-based cover (1200×630) once available, and update the
   `og:image` tags across all six HTML files if you rename the file.
3. **Pricing.** Prices on `services.html` are marked "From ₦—" and should
   be confirmed against current studio pricing.
4. **Stats on `about.html`** (years in business, clients served, etc.)
   are illustrative — replace `data-counter` values with real numbers.
5. **Testimonials** on `index.html` are illustrative and should be
   replaced with real client quotes (with permission).
6. **Footer credit** ("Designed & Developed by CodeBro Digital") links to
   `#` — point it at the agency's real site if this ships.

---

## Booking form

`booking.html` runs in **demo mode**: submissions are validated exactly as
they would be in production, then a success panel shows a summary of what
was entered — no data leaves the browser. To connect it to a real backend,
open `js/booking.js` and replace the `submitBookingDemo()` function with a
`fetch()` call to your booking API or a service like Formspree/Getform.

---

## Editing colors, type, and spacing

Every design token lives in `css/global.css` as CSS custom properties
(`--color-gold`, `--font-display`, `--space-lg`, etc.). Changing a value
there updates it everywhere it's used — no need to hunt through component
files.

Dark/light theme is handled by toggling a `theme-light` class on `<html>`
(see the sun/moon button in the header); `global.css` defines the
light-mode variable overrides.

---

## Performance & accessibility notes

- Fonts are loaded via `@import` in `global.css` from Google Fonts, with
  `preconnect` hints in every `<head>`.
- GSAP and ScrollTrigger are loaded from a CDN and are the only external
  scripts; everything else is native JS.
- All animation respects `prefers-reduced-motion`; motion-sensitive
  visitors get a fully legible, static layout instead.
- Keyboard focus is always visible, the mobile nav drawer and lightbox
  trap focus while open, and interactive icon-only buttons have
  `aria-label`s.
- `HairSalon` structured data (Schema.org) is included on `index.html`
  for local SEO.

---

## Credits

Designed & developed by **CodeBro Digital** for Dreadlocks Innocent.
