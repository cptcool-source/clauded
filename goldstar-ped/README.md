# Gold Star Pediatrics — Website

Custom-built website for Gold Star Pediatrics, North Port, FL.  
Built by fixedIT Tech · June 2026

---

## File Structure

```
goldstar-ped/
├── index.html              # Homepage
├── about.html
├── services.html
├── new-patients.html
├── meet-the-team.html
├── policies.html
├── patient-resources.html
├── self-pay-options.html
├── blog.html
├── contact.html
├── css/
│   └── styles.css          # Single shared stylesheet
├── js/
│   └── script.js           # Single shared script
├── images/
│   ├── hero-bg.avif
│   ├── hero-photo.jpg
│   ├── quicklinks-bg.avif
│   └── services-bg.avif
└── README.md
```

> **Note:** `style.css` and `main.js` at the project root are legacy files and can be deleted — all pages now reference `css/styles.css` and `js/script.js`.

---

## Deployment

### GitHub Pages
1. Push this folder to a GitHub repository
2. Go to Settings → Pages → Source: Deploy from branch → `main` → `/ (root)`
3. Site will be live at `https://username.github.io/repo-name/`

**Important:** All asset paths are relative (`css/styles.css`, not `/css/styles.css`). This ensures the site works correctly on GitHub Pages project subpaths.

### Netlify
1. Drag and drop the `goldstar-ped/` folder into [netlify.com/drop](https://netlify.com/drop)
2. Or connect to a GitHub repo for continuous deployment

### Any Static Host (cPanel, Cloudflare Pages, etc.)
Upload the contents of `goldstar-ped/` to your `public_html` or equivalent web root. No build step required — the site runs as plain HTML/CSS/JS.

---

## Content Still Needed from Client

Before launch, confirm or supply the following:

- [ ] High-resolution logo (SVG preferred) — currently using inline star icon
- [ ] Practice address (for contact page and Google Business Profile)
- [ ] Office hours (Mon–Fri schedule)
- [ ] Staff headshots — Dr. Patel, Melissa, Laura (for team page photo circles)
- [ ] Technology equipment photos — Panda Warmer, LightScalpel laser, bilirubin meter, spirometer
- [ ] Full self-pay pricing table (additional services beyond the $119 base)
- [ ] Patient intake forms (PDFs) for patient-resources.html
- [ ] Contact form backend — wire `contact.html` form to email service (Formspree, Netlify Forms, etc.)
- [ ] Insurance plans accepted (for new-patients.html)
- [ ] Social media profile links (for footer, if desired)
- [ ] Televisit page (`televisit.html`) — referenced in footer; create or redirect to patient-resources.html

---

## Internal Documents

The following files are **not part of the deployable site** and should not be uploaded to hosting:

- `invoice.html` — Project invoice (fixedIT Tech internal)
- `proposal.html` — Sales proposal document
- `SEO-explain.html` — SEO talking points reference
- `font-test.html` — Font comparison test page

These can be moved to `_internal/` or kept locally — just exclude them when uploading to the host.

---

## Tech Notes

- **No build step** — open any `.html` file in a browser or serve with any static host
- **Fonts** — Google Fonts CDN (DM Serif Display + Plus Jakarta Sans). No self-hosting needed.
- **Images** — AVIF format used for ghost backgrounds (broad browser support). JPG used for photos.
- **JS** — Vanilla JS only. No frameworks, no npm, no bundler.
- **Browser support** — Modern browsers (Chrome, Firefox, Safari, Edge). IE not supported.
- **Accessibility** — Semantic HTML landmarks, ARIA labels, keyboard-navigable mobile menu, `prefers-reduced-motion` respected on all animations.
