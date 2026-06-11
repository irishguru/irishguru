# Irish Guru — Static Website

Production-ready marketing site for **[irishguru.com](https://irishguru.com)** — a Dublin-based technology consultancy serving Irish and UK organisations.

Built with **plain HTML, CSS, and JavaScript**. No build step, no backend, no framework. Deploy anywhere static files are hosted.

---

## Project overview

| Item | Detail |
|------|--------|
| **Pages** | Home, About, Services, Industries, Case Studies, Contact |
| **Stack** | HTML5 · CSS custom properties · ~250 lines vanilla JS |
| **Features** | Light/dark theme, sticky header, mobile nav, FAQ accordion, contact form UI |
| **Fonts** | Cabinet Grotesk & Satoshi (Fontshare), Source Serif 4 (Google Fonts) |
| **Primary CTA** | “Schedule a Call” → `contact.html` |

### File structure

```
irishguru/
├── index.html              # Home
├── about.html
├── services.html           # Anchors: #ai #cloud #devops #platform #data #strategy #automation
├── industries.html         # Anchors: #financial-services #public-sector #healthcare #telecom #enterprise
├── case-studies.html
├── contact.html
├── 404.html                # GitHub Pages / host 404 page
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── .nojekyll               # Disables Jekyll on GitHub Pages
├── .gitignore
├── netlify.toml            # Netlify headers & publish dir
├── vercel.json             # Vercel headers
└── README.md
```

---

## Local preview

**Requirements:** Python 3 (recommended) or any static file server.

```bash
cd irishguru
python -m http.server 8080
```

Open **http://localhost:8080**

Alternatives:

```bash
npx serve .
# or
npx http-server -p 8080
```

> Do not rely on `file://` — use a local server so paths resolve correctly.

### Quick QA locally

1. Click every nav link and footer link
2. Test service/industry anchor links (e.g. `services.html#devops`)
3. Toggle light/dark mode — refresh to confirm persistence
4. Open mobile nav (resize below 960px) — Escape to close
5. Submit contact form empty (validation) and filled (success state)
6. Resize at 375px, 768px, 1024px, 1440px

---

## Push to GitHub

Replace `YOUR_USERNAME` with your GitHub username.

```bash
cd irishguru
git init
git add .
git commit -m "Initial Irish Guru website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/irishguru.git
git push -u origin main
```

---

## Deploy to GitHub Pages

### Option A — User/organisation site (`username.github.io`)

1. Push repo named **`username.github.io`** (must match your GitHub username).
2. **Settings → Pages → Source:** Deploy from branch **`main`**, folder **`/ (root)`**.
3. Site live at `https://YOUR_USERNAME.github.io`.

### Option B — Project site (`username.github.io/irishguru`)

1. Push repo named **`irishguru`** (or any name).
2. **Settings → Pages → Source:** branch **`main`**, folder **`/ (root)`**.
3. Site live at `https://YOUR_USERNAME.github.io/irishguru/`.

All internal links are **relative** (`about.html`, `css/styles.css`) — they work for both root and project sites.

### Custom domain (irishguru.com)

1. Create **`CNAME`** in repo root containing:
   ```
   irishguru.com
   ```
2. **Settings → Pages → Custom domain:** enter `irishguru.com`.
3. At your registrar, add DNS:
   - **A records** → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **OR CNAME** `www` → `YOUR_USERNAME.github.io`
4. Enable **Enforce HTTPS** in GitHub Pages settings.

`.nojekyll` is included so GitHub Pages serves files as-is (no Jekyll processing).

---

## Deploy to Netlify

### Git-connected (recommended)

1. Push repo to GitHub.
2. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
3. Connect GitHub repo.
4. Build settings (auto-detected from `netlify.toml`):
   - **Build command:** *(empty)*
   - **Publish directory:** `.`
5. **Deploy site**.
6. **Domain management → Add custom domain** → `irishguru.com`.

### Enable contact form on Netlify

In `contact.html`, add the `netlify` attribute:

```html
<form class="form contact-form" netlify name="contact" novalidate aria-label="Contact form">
```

Submissions appear under **Forms** in the Netlify dashboard.

### Drag-and-drop

Zip the project **contents** (not the parent folder) and drop at [app.netlify.com/drop](https://app.netlify.com/drop).

---

## Deploy to Vercel

1. Push repo to GitHub.
2. [vercel.com](https://vercel.com) → **Add New Project** → import repo.
3. Framework preset: **Other**.
4. Build command: *(empty)* · Output directory: `.`
5. **Deploy**.
6. **Settings → Domains** → add `irishguru.com`.

`vercel.json` sets cache headers for CSS/JS and basic security headers.

---

## Where to edit content

| What to change | File(s) |
|----------------|---------|
| **Company name, email, phone, address** | `contact.html`, footer on all `.html` files, JSON-LD in each page `<head>` |
| **Social links** (LinkedIn, X) | Footer on all `.html` files |
| **Brand colours & dark mode** | `css/styles.css` — `:root` and `[data-theme='dark']` tokens |
| **Logo** | Inline SVG with class `logo__mark` in header/footer of each page |
| **Homepage copy & stats** | `index.html` |
| **About / mission / methodology** | `about.html` |
| **Service descriptions** | `services.html` + service index on `index.html` |
| **Industry copy** | `industries.html` + industry rows on `index.html` |
| **Case studies** | `case-studies.html`, featured block on `index.html` |
| **FAQ** | `index.html` |
| **Page titles & meta descriptions** | `<title>` and `<meta name="description">` in each `.html` file |
| **Open Graph / Twitter cards** | `og:*` and `twitter:*` tags in each page `<head>` |
| **Canonical URLs & sitemap** | `<link rel="canonical">` per page, all `<loc>` in `sitemap.xml`, `robots.txt` |
| **JSON-LD Organization** | `<script type="application/ld+json">` in each page `<head>` |
| **Favicon** | Replace `favicon.svg`; update `og:image` when you add a PNG social image |
| **Contact form backend** | `contact.html` — Formspree, Netlify Forms, Web3Forms, etc. |
| **404 page** | `404.html` |

---

## Technical notes

- **Theme:** Toggle stores preference in `localStorage` key `irishguru-theme`. Inline script in `<head>` prevents flash of wrong theme.
- **Form:** Client-side validation only by default — connect a form service before launch.
- **Images:** Site uses inline SVG and `favicon.svg` only — no raster images to lazy-load.
- **Fonts:** Loaded from Fontshare and Google Fonts CDN; `preconnect` hints are in each page `<head>`.
- **SEO image:** `og:image` currently points to `favicon.svg`. Replace with a 1200×630 PNG for better social previews.

---

## Browser support

Chrome, Firefox, Safari, Edge (current versions). Uses `color-mix()` for header transparency.

---

© 2026 Irish Guru Ltd. All rights reserved.
