# Irish Guru Ltd. — Corporate Web Portal Redesign

A premium, agency-quality technological consultancy web portal, custom designed and custom built from scratch to establish executive credibility, showcase outcome-defined engineering results, and capture consulting briefs.

## Technical Architecture

- **Sovereign Static Execution**: Standard static HTML5, pure CSS3, and native ECMAScript. Complies with high-performance edge distribution pipelines (Netlify, Vercel, GitHub Pages) without build-step overhead.
- **Premium Fluid Design System**: Strictly defined CSS variables supporting fluid clamp ramps for typography (`--text-xs` to `--text-6xl`) and padding scales.
- **Bi-Directional Themes**: Dark-mode leaning by default with obsidian surfaces, premium charcoal borders, and celtic bronze accents. Includes a high-end editorial, clinical paper-like Light mode.
- **100% Inline Vector Assets**: Every diagram, icon, and brand mark is coded inline as responsive SVG paths. Ensures zero rendering delay, absolute scalability, and full CSS interactivity.
- **Zero-Dependency Interactivity**: Single, clean vanilla JavaScript file handling scroll reveals, KPI increment counters, accordion drop-downs, and interactive SVG nodes using high-performance APIs (`IntersectionObserver`, `requestAnimationFrame`).

---

## Local Development & Running

To launch and run the project locally on any operating system, run a local development server to avoid CORS constraints on module resources:

```bash
# Python 3
python -m http.server 8000

# Node.js (Static-Server)
npx serve .

# PHP
php -S localhost:8000
```

Once running, navigate to `http://localhost:8000` (or the port specified by your tool) inside any modern web browser.

---

## Modifying the Website

### 1. Editing Brand Logos & Mark Paths
All SVG marks use consistent inline code structures.
- To modify the logo on the homepage or inner pages, search for `<svg class="logo__mark"` in the header/footer regions.
- The path coordinates represent a modern abstract cybernetic celtic block using high-contrast bronze (`var(--color-accent)`) and sage green (`var(--color-sage)`). Adjust the `stroke` or `fill` variables directly.

### 2. Customizing Typography or Color Themes
Global styling, fonts, and theme configurations live in `/css/styles.css`:
- **Obsidian Dark Mode (Default)**: Modify properties inside `:root` selector.
- **Prestige Light Mode**: Modify properties inside the `[data-theme='light']` selector.
- **Bronze Accent Hex**: Adjust `--color-accent` (`#cfa276` dark, `#9b6c3f` light) and `--color-accent-hover`.
- **Primary Typeface**: Update `--font-display` (Cabinet Grotesk) or `--font-body` (Satoshi).

### 3. Adjusting Inline Diagrams
All diagrams are built directly inside the HTML markup for maximum rendering speed and absolute scalability:
- **Transformation Lifecycle (Homepage)**: Coded in `#why` column 1. The interactive nodes feature `data-tip-id` triggers that hook directly to the custom JavaScript interactive tooltip controller.
- **Operational Metrics Plot (Homepage)**: Coded in `#capabilities` with coordinate node paths mapping average performance increases. Update the coordinates inside `<path d="..."` and label variables to align with new statistics.
- **Data Migration Path (Homepage)**: Coded in `#case-study` mapping secure data transfers from a proprietary legacy warehouse to Azure cloud blob stores.

### 4. Updating Content, Team, & Contact Parameters
- **Inner Team Grid**: Head to `/about/index.html` and look for the `#team` ID sector. To add or adjust team details, modify the `<article class="team-card">` components. The card features fully inline SVG avatars matching roles (architect, AI engineer, cloud security).
- **Contact Forms & Capture Actions**: Modify `/contact/index.html` structure. Validation rules and state triggers are handled natively in `/js/main.js` via `initForm()`. To link this form with a backend, replace the default submission listener with your preferred CRM API endpoint (`fetch()` or email relay handler).

---

## Deployment Procedures

The portal is designed for high-end static hosting with edge caching configurations.

### 1. NETLIFY Deployment
Netlify handles the static redirect rules and custom security headers specified in `netlify.toml` automatically:
```bash
# Initialize Netlify CLI
npm install netlify-cli -g

# Deploy from current directory
netlify deploy --prod
```
Alternatively, link your GitHub repository to your Netlify account for automated continuous delivery (CD) on every branch push.

### 2. VERCEL Deployment
Vercel handles URL routing, trailing slashes, and performance caching based on `vercel.json`:
```bash
# Deploy with Vercel CLI
npm install -g vercel
vercel --prod
```

### 3. GITHUB PAGES Deployment
To push directly to your remote repository and let GitHub Pages compile and host your production directory:
```bash
git add .
git commit -m "rebrand: complete web portal redesign and visual overhaul"
git push origin main
```
Configure your GitHub repository settings under **Pages** → Source: **Deploy from branch** → Branch: **main** (Root directory `/`).
