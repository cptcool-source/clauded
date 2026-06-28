# fixedIT Tech — Marketing Website

**Live site:** https://cptcool-source.github.io/design-site  
**Owner:** Charles Spivey · fixedIT Tech · North Port, FL 34291  
**Contact:** temptestbspivey@gmail.com

---

## Project

A marketing website for fixedIT Tech, a web design business serving small businesses across Southwest Florida. The site's dual purpose: attract local clients through search and demonstrate the level of design quality Charles delivers.

**Services promoted:** Web Design · Web Development · SEO · Google Business Profile · Social Media Setup · Website Maintenance

**Target markets:** Restaurants & Food · Home Services & Trades · Health & Wellness · Real Estate & Professional Services

---

## Tech Stack

Pure HTML / CSS / JS — no framework, no build step. GitHub Pages ready out of the box.

| Layer | Choice |
|---|---|
| Fonts | Cormorant Garamond + DM Sans (Google Fonts) |
| Icons | Phosphor Duotone (CDN) |
| Forms | Formspree (AJAX, no backend required) |
| Hosting | GitHub Pages |
| SEO | Schema.org LocalBusiness JSON-LD + geo meta tags |

---

## Setup Checklist

- [ ] **Formspree** — sign up at formspree.io, create a form, replace `REPLACE_WITH_YOUR_FORM_ID` in `index.html` line ~370
- [ ] **GitHub Pages** — repo Settings → Pages → Source: `main` / `/ (root)` → Save
- [ ] **Custom domain** — Pages → Custom domain → enter `fixedittech.com`, then set DNS A records to GitHub's IPs and add a CNAME for `www`

---

## Design System

**Color tokens** (defined in `:root` in `style.css`):

| Token | Value | Role |
|---|---|---|
| `--bg` | `#09091F` | Page background (dark indigo, not black) |
| `--surface` | `#0F1238` | Card / section backgrounds |
| `--indigo` | `#6366F1` | Primary accent |
| `--indigo-light` | `#818CF8` | Hover states, links |
| `--ember` | `#F59E0B` | Warm accent — hero rule, highlights |
| `--text` | `#E2E0FF` | Body copy |
| `--text-muted` | `#8880C4` | Secondary copy |

**Typography — Direction A (active):**
- Display: Cormorant Garamond 700 / italic — editorial, high-contrast serif
- Body: DM Sans 400/500 — clean, modern contrast to the serif
- Utility: Geist Mono — eyebrows, labels, data

**Key animations:**
- Hero headline: `editorial-reveal` — full-title blur-to-sharp fade (1.3s, eased)
- Amber rule: `rule-extend` — draws left to right across full width after headline settles
- Services cards: gradient border on hover (mask/exclude technique)
- Process section: charging line + staggered step activation via IntersectionObserver
- Orbs: three ambient gradient blobs drifting slowly behind hero

---

## Switchable Design Directions

A theme switcher widget (bottom-right corner, **remove before going live**) lets you compare three type directions by clicking A / B / C. Change `data-theme="a"` on the `<html>` element to make a direction permanent.

| Direction | Display Font | Body Font | Character |
|---|---|---|---|
| **A (active)** | Cormorant Garamond | DM Sans | Editorial luxury serif — cinematic, high contrast |
| B | Clash Display | General Sans | Bold studio grotesque — uppercase, geometric |
| C | Bricolage Grotesque | Inter | Variable weight — tension between ultra-thin and ultra-black |

---

## Design Philosophy

> Dark indigo base (#09091F), not pure black. The depth comes from color, not absence.  
> One serif risk taken big — Cormorant Garamond at enormous scale dominates the viewport like a magazine centerfold.  
> Amber (#F59E0B) is the single warm note in a cold palette — used once in the hero, earned everywhere else.  
> Motion is deliberate: the headline materializes from blur, a rule draws itself across the page, sections reveal on scroll. Nothing animates just to move.  
> Everything around the headline whispers so the type can shout.

### Prompt to recreate this vibe

> Dark indigo marketing site for a web design business. Cormorant Garamond at enormous viewport scale for the hero — editorial, high contrast, luxury serif feel. DM Sans for body. Single amber accent (#F59E0B). Hero headline does a slow blur-to-sharp cinematic reveal, followed by an amber rule that draws across the full width. No decorative clutter — the typography is the visual. Sections reveal on scroll via IntersectionObserver. Cards have gradient border on hover using CSS mask/exclude. Three ambient indigo/ember gradient orbs drift slowly behind the hero. Feels like a premium print studio, not a software product. Tone: confident and restrained.

---

## File Structure

```
design-site/
├── index.html       # Full site — all sections, SEO meta, JSON-LD schema
├── css/
│   └── style.css    # Design tokens, all components, three theme directions
├── js/
│   └── main.js      # Nav scroll, drawer, smooth scroll, reveals, process animation, form, theme switcher
└── README.md
```

---

## Local SEO

- Schema.org `LocalBusiness` JSON-LD in `<head>`
- Geo meta tags: `geo.region`, `geo.placename`, `geo.position`, `ICBM`
- Canonical URL: `https://fixedittech.com`
- Copy targets: North Port · Venice · Englewood · Port Charlotte · Osprey · Southwest Florida
- Zip code 34291 mentioned in copy and meta
