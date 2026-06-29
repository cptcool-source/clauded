# chuck design — Marketing Website

**Live site:** https://cptcool-source.github.io/design-site  
**Owner:** Charles Spivey · chuck design · North Port, FL 34291  
**Contact:** charles@chuckdesign.com

---

## Project

A marketing website for chuck design, a web design business serving small businesses across Southwest Florida. The site's dual purpose: attract local clients through search and demonstrate the level of design quality Charles delivers.

**Services promoted:** Web Design · Web Development · SEO · Google Business Profile · Social Media Setup · Website Maintenance

**Target markets:** Restaurants & Food · Home Services & Trades · Health & Wellness · Real Estate & Professional Services

---

## Tech Stack

Pure HTML / CSS / JS — no framework, no build step. GitHub Pages ready out of the box.

| Layer | Choice |
|---|---|
| Fonts | Outfit (variable weight) + Geist Mono (Google Fonts) |
| Icons | Phosphor Duotone (CDN) |
| Forms | Formspree (AJAX, no backend required) |
| Hosting | GitHub Pages |
| SEO | Schema.org LocalBusiness JSON-LD + geo meta tags |

---

## Setup Checklist

- [ ] **Formspree** — sign up at formspree.io, create a form, replace `REPLACE_WITH_YOUR_FORM_ID` in `index.html` line ~370
- [ ] **GitHub Pages** — repo Settings → Pages → Source: `main` / `/ (root)` → Save
- [ ] **Custom domain** — Pages → Custom domain → enter `chuckdesign.com`, then set DNS A records to GitHub's IPs and add a CNAME for `www`

---

## Design System — Direction C (Active)

**Color tokens** (defined in `:root` in `style.css`):

| Token | Value | Role |
|---|---|---|
| `--bg` | `#FAFAF8` | Page background — warm off-white, not pure white |
| `--surface` | `#F2F0ED` | Card / section backgrounds |
| `--surface-raised` | `#ECEAE6` | Elevated card states |
| `--accent` | `#E05C3A` | Coral — primary accent, logo "Tech", CTAs |
| `--accent-light` | `#F07A5A` | Hover states on coral elements |
| `--accent-dark` | `#B84928` | Active / pressed coral states |
| `--text` | `#111111` | Body copy — near-black |
| `--text-muted` | `#6B6965` | Secondary copy, captions |
| `--text-faint` | `#BBBAB6` | Placeholder, disabled states |
| `--border` | `rgba(0,0,0,0.08)` | Default borders |
| `--border-mid` | `rgba(0,0,0,0.13)` | Stronger dividers, focused inputs |

**Typography — Direction C (active):**
- Display / UI: Outfit 800 — hero headline, section titles, logo wordmark
- Light contrast: Outfit 300 — `"made to"` midline in hero, creates weight tension
- Accent: Outfit 300 italic — `"lead."` in coral, the emotional close
- Utility: Geist Mono — eyebrows, location tags, small labels
- Body: Outfit 400/500 — readable at 16px, inherits from the display family

**Key animations:**
- Hero headline: `fade-up` — slides up 24px with opacity 0→1 (0.9s, ease-out, 0.3s delay)
- Hero sub + CTA: staggered `fade-up` at 0.9s and 1.1s delay
- Scroll reveals: `.reveal-up` via IntersectionObserver — 40px upward drift into opacity
- Film slate ticker: horizontal infinite scroll marquee
- Process rail: `--fill-h` CSS var driven by scroll position, charging left-to-right
- Nav: background + border fade-in on scroll past 60px

---

## Switchable Design Directions

A theme switcher widget (bottom-right corner, **remove before going live**) lets you compare three type directions by clicking A / B / C. Change `data-theme="a"` on the `<html>` element to make a direction permanent.

| Direction | Display Font | Body Font | Character |
|---|---|---|---|
| A | Cormorant Garamond | DM Sans | Editorial luxury serif — cinematic, high contrast |
| B | Clash Display | General Sans | Bold studio grotesque — uppercase, geometric |
| **C (active)** | Outfit (variable weight) | Outfit | Weight tension — 800 vs 300 in the same typeface |

---

## Visual Identity & Layout

### Brand Concept

chuck design is not an agency. It is a skilled local operator who builds things that work. The visual identity reflects that: confidence without posturing, precision without coldness, warmth earned through restraint rather than decoration.

**Core metaphor:** Precision craft meets Gulf Coast light. The weight contrast in the logo — "chuck" at 800, "design" in coral italic 300 — is the whole brand idea in two words: authority, then warmth.

**What the design avoids:** Dark-mode SaaS clichés. Generic beach imagery. Luxury signaling that would alienate a plumber or restaurant owner. Anything that says "startup" instead of "professional."

---

### Color System

Three colors carry the entire site.

**`#FAFAF8` — Warm Off-White (base)**
Not pure white. The warmth comes from a faint yellow-gray undertone that reads as paper or plaster — coastal architecture, not a screen. Used as the page background and hero text color (inverted against dark).

**`#111111` — Near-Black (text)**
Not pure black. Slightly warm, which keeps it readable without the harshness of `#000`. Used for all body copy, headings in light sections, and the dark hero background.

**`#E05C3A` — Coral (accent)**
The single warm note. Appears in: the "Tech" half of the logo, every CTA button, the eyebrow dot, hover states on links and cards, the about section em tags, and footer accents. It is earned — used precisely so it always means *action* or *identity*, never decoration.

**Grain texture** (CSS `body::after`): a subtle SVG fractalNoise overlay at 2.2% opacity. Keeps the off-white from reading as flat digital white. Barely perceptible but removes the sterile quality.

---

### Typography System

Outfit is a variable-weight geometric sans. The identity uses its full weight spectrum — not as a gimmick, but as the primary visual contrast mechanism.

| Role | Weight | Size | Use |
|---|---|---|---|
| Hero primary | 800 | `clamp(56px, 13vw, 192px)` | "Designs" — the dominant word |
| Hero secondary | 300 | same scale, 42% opacity | "made to" — recedes, creates depth |
| Hero accent | 300 italic, coral | same scale | "lead." — emotional close |
| Section titles | 800 | `clamp(28px, 4.5vw, 52px)` | All `h2` headings |
| Card titles | 700 | `clamp(17px, 1.8vw, 20px)` | Service / work card headings |
| Body | 400 | 16px / line-height 1.6 | All prose |
| Eyebrows | Geist Mono 500 | 11–12px, tracked +0.08em | Location tags, section labels |
| Nav | 800 (logo) / 500 (links) | 18px / 15px | Navigation |

**The weight rule:** 800 announces, 300 breathes, 400 delivers. Never use medium (500–700) for display — it sits in no-man's land between functional and expressive.

---

### Layout — Section by Section

#### Navigation (`site-nav`)
Fixed, full-width. Transparent on load; gains `background: rgba(250,250,248,0.9)` + blur + border-bottom when scrolled past 60px. Left: logo lockup. Center: five text links. Right: coral CTA button "Get a free quote." Mobile: hamburger opens a full-height right-side drawer. The nav never competes with the hero — it disappears visually until the user needs it.

#### Hero (`hero`)
The site's only dark section. `#111` background. Full viewport height. Content is vertically centered with slight upward bias.

- **Background:** `.hero-photo` — empty div reserved for a background image (currently none; orbs provide atmosphere). Three `.orb` elements: CSS radial-gradient blobs in coral and muted warm tones that drift slowly via keyframe animation.
- **Eyebrow:** Geist Mono label with a pulsing coral dot. `"Web Design · North Port, FL 34291"` — establishes location immediately.
- **Headline:** Three-line stacked lockup. Weight contrast creates hierarchy without needing size variation:
  - Line 1: "Designs" — Outfit 800, off-white
  - Line 2: "made to" — Outfit 300, 42% opacity
  - Line 3: "lead." — Outfit 300 italic, coral
- **Sub:** One sentence. White, muted. Reveals on delay after headline.
- **CTAs:** Two buttons — primary (coral fill) "Get a free quote", ghost (white border) "See our work".
- **The hero rule** (Direction A only): hidden in Direction C. The weight-contrast headline replaces it.

#### Film Slate (`.film-slate`)
Full-width horizontal ticker immediately below hero. White background, small Geist Mono text. Scrolls continuously left: business name, location, services, target industries. Purely functional — reinforces local SEO signals visually. Breaks the hero-to-services transition without a hard line.

#### Services (`services`)
Light section (`--bg`). Asymmetric grid: one large featured card spanning 2 columns (Web Design), two standard cards in the right column, then three standard cards below. Each card has a Phosphor duotone icon, title, and description. Featured card additionally has a bullet list.

Card behavior: no border at rest. On hover, a coral gradient border appears via CSS `background-clip: padding-box` + `::before` pseudo-element with `mask` — the border gradient only, no fill bleed.

#### Process (`process`)
Light section with a vertical rail running down the left side of the step list. The rail fills from top as the user scrolls — a CSS custom property `--fill-h` is updated via `IntersectionObserver` + `requestAnimationFrame`, driving a coral-filled `::before` pseudo-element. Each step node (circle) activates when its step enters the viewport. Four steps: Consult → Design → Build → Launch.

#### Work / Portfolio (`work`)
Three horizontal work-type cards (Restaurants, Home Services, Health & Professional) each with an icon, eyebrow, headline, description, and "Get a free quote →" link. Below a full-width divider ("Selected work"), a horizontal portfolio rail of project cards: Mamba Tech Solutions, Family Hub, Family Hub Fun Zone. Each portfolio card has a screenshot, tag, title, and description. Clicking opens a lightbox with zoom.

#### About (`about`)
Two-column layout. Left: content — section title, blockquote, two paragraphs, email link. Right: portrait photo of Charles + family, "Serving" label, city pill list, local note. The blockquote (`"Design without strategy is decoration. / Strategy without design is invisible."`) is the brand's philosophical statement — Outfit 500 italic, oversized, borderless.

#### Contact (`contact`)
Dark-accent-free. Clean form on the left (name, email, phone, industry select, message textarea), aside on the right (email, location, response time, promise chip). Form submits to Formspree via AJAX. On success: button text changes, success message appears inline. Coral accent on the submit button and active input borders.

#### Footer (`site-footer`)
Single-line. Logo left, copyright center, email right. No secondary nav, no social links, no padding bloat. The site ends when the content ends.

---

### Animation Language

**Principle:** Motion should feel like the page waking up, not performing for you.

| Animation | Behavior | Duration | Purpose |
|---|---|---|---|
| Hero headline | `fade-up` — 24px rise + opacity | 0.9s ease-out | Page entry — the most important element lands first |
| Hero sub / CTA | Same, staggered +0.6s / +0.8s | 0.9s | Trail the headline, never compete |
| Scroll reveals | `.reveal-up` 40px rise | 0.7s ease-out | Sections breathe in as you scroll — never all at once |
| Process fill | Rail grows with scroll | Continuous | Progress metaphor — the page moves with you |
| Orbs | Slow radial drift (`float-*` keyframes) | 18–22s loop | Ambient warmth, not motion design |
| Film slate | Infinite left scroll | 28s loop | Utility — not decoration |
| Nav appearance | Opacity + blur on scroll | 0.3s | Functional — never distracting |
| Card border | Coral gradient on hover | 0.25s | Subtle confirmation of interactivity |

**What never animates:** Logo. Nav links. Body copy. Paragraph text. Anything inside a card at rest.

---

### Imagery Direction

The site currently uses three types of imagery:

**Portfolio screenshots** (`images/mamba-tech.png`, `images/family-hub-*.png`): Real work. Full-bleed inside portfolio cards. Shown in a lightbox on click. These are the most important images on the site — they prove capability.

**Portrait** (`images/family.png`): Charles and family. Humanizes the business. Placed in the About section alongside the city list. Should feel like a real person, not a headshot.

**Hero background** (`.hero-photo` div, currently empty): Reserved for a future image — ideally a cinematic editorial photograph. Direction below.

#### Imagery Direction for Future Assets

The site's visual language calls for images that feel like **warm precision** — not beach tourism, not generic office stock.

**What to shoot / source:**
- Cinematic afternoon light on clean white architecture (stucco, painted block, clean facades)
- Strong directional shadows — the graphic quality of Southwest Florida noon or golden-hour light
- Close-ups of craft: clean workspace, quality materials, a well-built thing
- Storefronts of the kinds of businesses fixedIT Tech serves — a well-lit restaurant patio, a clean HVAC truck, a medical office entry
- Warm palette: terracotta, sand, coral accent objects, deep shadow
- No people unless they are real (Charles, actual clients)

**What to avoid:**
- Generic beach / palm tree / Gulf scenery
- Laptop-on-a-beach stock clichés
- Smiling-businesspeople stock photos
- Dark moody tech imagery (this is a light-mode site serving local business owners)
- Anything that reads as "startup" or "Silicon Valley"

**Hero image spec:** 1920×1080 minimum. Dark treatment (darken overlay or naturally dark scene) so off-white headline type remains legible. Horizontal composition with visual weight on the right half, leaving left clear for the text stack.

---

### Brand Voice

**In copy:** Direct. Short sentences. No buzzwords. Never "leverage," "synergy," "solutions," "cutting-edge." Speak like a skilled local business owner, not a marketing consultant.

**Sentence rhythm:** Lead with a verb or a specific fact. `"Show up first when customers search."` Not `"We help you achieve greater visibility in local search results."`

**Headlines:** Action or consequence. Not description. `"Sites that fill tables."` Not `"Restaurant web design services."`

**About tone:** First person occasionally but mostly second — speak to the client's outcome, not the business's process. The one exception is the origin story paragraph where "we" is appropriate.

---

### Prompt to Recreate Direction C

> Marketing website for fixedIT Tech, a local web design studio in North Port, FL. Light mode: warm off-white (#FAFAF8) base, near-black (#111) text, coral (#E05C3A) accent. Single dark section: the hero. Outfit variable-weight sans — the headline stacks three lines using weight 800, then 300 at 42% opacity, then 300 italic in coral. The weight contrast is the visual. No decorative elements in the hero — three ambient orbs provide warmth. Sections reveal on scroll via IntersectionObserver. Service cards get a coral gradient border on hover using CSS mask technique. Process section has a rail that fills as you scroll. Film slate ticker below hero. Portfolio cards in a horizontal scroll rail with lightbox. About section with portrait + city pill list. Contact form via Formspree. Footer is one line. Feels like a skilled local tradesperson's portfolio, not an agency deck. Confident, warm, precise.

---

## Logo System

**Logo Direction:** Direction 1 — Weight Contrast Wordmark. "chuck" in Outfit Extra Bold (800), "design" in Outfit Light Italic (300) coral. The weight tension between the two words IS the brand idea — same system as the hero headline. The `cd` monogram (c off-white, d coral) serves as the favicon/icon mark.

**Concept boards:** `brand-concepts.html` (local preview — remove before deploying) shows all three explored directions.

**On-site logo files:**

| File | Use | Background |
|---|---|---|
| `images/favicon.svg` | Browser tab, bookmarks | — (512×512 SVG, cd monogram) |
| `images/logo-dark.svg` | Docs, decks, email signatures | Dark / #111 |
| `images/logo-light.svg` | Docs, decks, print | Light / white |
| `images/og-image.html` | Social preview source (screenshot at 1200×630) | — |

**Nav and footer logo** are CSS text (`chuck<span> design</span>`) rendered live via Outfit variable weight. The `.nav-logo` and `.footer-logo` flex column creates the two-line stacked lockup. The `.logo-accent` class sets the coral italic 300 style on "design".

---

## File Structure

```
design-site/
├── index.html             # Full site — all sections, SEO meta, JSON-LD schema
├── css/
│   └── style.css          # Design tokens, all components, Direction C active
├── js/
│   └── main.js            # Nav scroll, drawer, reveals, process rail, form, lightbox
├── images/
│   ├── favicon.svg        # fT monogram favicon — dark bg, off-white f, coral T
│   ├── logo-dark.svg      # Wordmark for dark backgrounds
│   ├── logo-light.svg     # Wordmark for light/white backgrounds
│   ├── og-image.html      # OG social preview source (screenshot to produce og-image.jpg)
│   ├── og-image.jpg       # Open Graph image (1200×630)
│   ├── family.png         # About section portrait
│   ├── mamba-tech.png     # Portfolio: Mamba Tech Solutions
│   ├── family-hub-home.png    # Portfolio: Family Hub
│   └── family-hub-funzone.png # Portfolio: Family Hub Fun Zone
└── README.md
```

---

## Local SEO

- Schema.org `LocalBusiness` JSON-LD in `<head>`
- Geo meta tags: `geo.region`, `geo.placename`, `geo.position`, `ICBM`
- Canonical URL: `https://chuckdesign.com`
- Copy targets: North Port · Venice · Englewood · Port Charlotte · Osprey · Southwest Florida
- Zip code 34291 mentioned in copy and meta
