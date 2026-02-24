# Hindsole Pharma / AyurVita – Deep Audit Report

**Date:** Feb 24, 2026  
**Scope:** deploy.zip creation, build pipeline, project health, deployment readiness

---

## Executive Summary

| Area | Status | Notes |
|------|--------|-------|
| Build & deploy:zip | OK | `npm run deploy:zip` runs successfully (~26 MB) |
| Source index.html | OK | Valid HTML, correct og:image |
| deploy/ folder | WARNING | Old build output committed; redundant with dist/ |
| Missing asset | BUG | `gasovitapowder_poster.jpg` referenced but not in public/ |
| Brand consistency | INFO | index.html uses AyurVita; deploy/ had Hindsole Pharma (old) |
| Firebase env | WARNING | Must set VITE_* before build for production |

---

## 1. deploy.zip Pipeline

### Flow
```
npm run deploy:zip
  → vite build (creates dist/)
  → copy deploy/.htaccess → dist/
  → zip dist/ → deploy.zip
```

### Status: OK
- Build completes in ~3s
- deploy.zip ~26 MB (26560 KB)
- Contains: index.html, assets/, blogs/, products/, doctors/, hero-slides/, logo.svg, og-image.png, .htaccess

### deploy/ Folder Confusion
- `deploy/` contains old build output (index.html, assets/, etc.) **and** `.htaccess`
- `create-deploy-zip.js` uses **only** `deploy/.htaccess`; zip is built from `dist/`
- `deploy/` assets are **not** used for deploy.zip
- **Recommendation:** Move `.htaccess` to project root or `scripts/`, add `deploy/` to `.gitignore` to avoid confusion

---

## 2. Missing Asset (BUG)

**File:** `public/products/gasovitapowder_poster.jpg`  
**Referenced in:** `src/data/products.ts` line 96 (Gasovita Powder poster)

```
poster: "/products/gasovitapowder_poster.jpg"
```

**Current state:** File does not exist in `public/products/`. Only `gasovitapowder.jpg` exists.

**Impact:** 404 on product detail page for Gasovita Powder poster image.

**Fix options:**
1. Add `gasovitapowder_poster.jpg` to `public/products/`, or
2. Change poster to `"/products/gasovitapowder.jpg"` or `"/products/gasovita_powder_catalog.jpg"`

---

## 3. Source vs Build HTML

| Item | index.html (source) | dist/index.html (build) |
|------|---------------------|--------------------------|
| Title | AyurVita | AyurVita |
| og:image | https://ayurvita.in/og-image.png | Same |
| Structure | Valid `<head>` | Valid |

**Note:** Old `deploy/index.html` had "Hindsole Pharma" and invalid HTML (missing `<head>`). Fresh build from source is correct.

---

## 4. Environment Variables

**Required before `npm run deploy:zip`** (from `.env.example`):

```
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_WHATSAPP_NUMBER=919119890537
VITE_SITE_URL=https://ayurvita.in
VITE_ADMIN_EMAILS=...
VITE_COMPANY_PHONE=...
VITE_COMPANY_EMAIL=...
VITE_COMPANY_GST=...
VITE_COMPANY_ADDRESS=...
```

**Risk:** Build without `.env` will have empty Firebase config → auth/Firestore will fail in production.

---

## 5. Routing & SPA

- `.htaccess` correctly routes all non-file requests to `index.html`
- React Router handles: `/`, `/shop`, `/product/:slug`, `/:slug` (blogs), etc.
- BlogPost redirects unknown slugs to `/404`

---

## 6. Hero Carousel

- Uses slides 2–5; slide 1 is not in the array
- `slide1-desktop.jpg` and `slide1-mobile.jpg` exist in `public/` but are unused
- **Optional:** Add slide 1 to `heroSlides` if intended

---

## 7. Recommendations

| Priority | Action |
|----------|--------|
| High | Fix `gasovitapowder_poster.jpg` – add file or update poster path in products.ts |
| Medium | Ensure `.env` is set before production build |
| Low | Move `.htaccess` out of `deploy/`, add `deploy/` to `.gitignore` |
| Low | Add slide 1 to HeroCarousel if desired |

---

## 8. Deploy Checklist

1. [ ] Copy `.env.example` to `.env` and fill Firebase + company values
2. [ ] Run `npm run deploy:zip`
3. [ ] Upload `deploy.zip` to cPanel → public_html → Extract
4. [ ] Verify `mod_rewrite` is enabled
5. [ ] Test: HTTPS, SPA routes, product images, blog pages

---

## 9. Images Audit: Duplicates, Banners, Dummy

| Category | Count | Priority |
|----------|-------|----------|
| Dummy/External images | 8 locations | High – replace with own assets |
| Duplicate poster usage | 6 images shared across 15 products | Medium – consider product-specific posters |
| Unused assets in public/ | 4 files | Low – remove or wire up |

### 9.1 Dummy / External Images (Replace with Own Assets)

| Location | URL | Purpose | Action |
|----------|-----|---------|--------|
| `Home.tsx:740` | `unsplash.com/photo-1612349317150...` | Consult banner doctor image | Replace with `/doctors/doc-1.jpg` or add dedicated banner image |
| `Story.tsx:13` | `unsplash.com/photo-1540555700478...` | Hero background (Himalayas) | Add to `public/` or use product image |
| `Story.tsx:109` | `unsplash.com/photo-1622253692010...` | Founder "Sumit Pal" photo | Add real founder photo to `public/` |
| `Blogs.tsx:68` | `unsplash.com/photo-1540420773420...` | Fallback when `blog.image` missing | All blogs have images; remove fallback or use `/og-image.png` |
| `BlogPost.tsx:17` | Same unsplash fallback | Blog post hero fallback | Same as above |
| `Home.tsx:112,122,132` | `ui-avatars.com/api/?name=...` | Patient story avatars | Optional: use real photos or keep (lightweight) |
| `Home.tsx:247,499,567` | `ui-avatars.com` | onError fallback for broken images | Keep as fallback |
| `Checkout.tsx:256` | `cdn-icons-png.flaticon.com/512/2704/2704332.png` | UPI payment icon | Add to `public/` or use Lucide icon |

### 9.2 Duplicate Poster Usage (Same Image, Different Products)

| Image | Used By | Issue |
|-------|---------|-------|
| `arthovita_poster.jpg` | Arthovita Oil, Arthovita Tablets, Keshvita | 3 products share 1 poster |
| `gasovita_poster.jpg` | Gasovita Syrup, Livovita, Kofvita | 3 products share 1 poster |
| `digestive.jpg` | Pilovita, Chyawanprash | 2 products share 1 poster |
| `diabvita_poster.jpg` | Diabvita Powder, Massvita | 2 products share 1 poster |
| `varunalaka_poster.jpg` | Varunalka, Stonevita | 2 products share 1 poster |
| `arthovedh_catalog.jpg` | Arthovedh, Ashwagandha | 2 products share (image=poster) |

**Recommendation:** Create product-specific poster images for better UX. Or keep if intentional (e.g. category-level branding).

### 9.3 Unused / Orphan Assets in public/

| File | Status |
|------|--------|
| `public/products/hero-banner.png` | Not referenced in code |
| `public/products/hero-collection.png` | Not referenced in code |
| `public/hero-slides/slide1-desktop.jpg` | Not in HeroCarousel (slides 2–5 only) |
| `public/hero-slides/slide1-mobile.jpg` | Same |

### 9.4 Banner Image Summary

| Banner | Source | Type |
|--------|--------|------|
| Home Consult CTA | Unsplash (external) | Dummy |
| Story hero | Unsplash (external) | Dummy |
| Story founder | Unsplash (external) | Dummy |
| ProductDetails LIFESTYLE | `product.poster` | Local |
| ProductDetails EXPERT | `/doctors/doc-1.jpg` | Local |
| ProductDetails TRUST | Icons only (no image) | OK |
| og-image | `/og-image.png` | Local |

### 9.5 deploy/index.html Bug (Old)

- `og:image` was `/banner.jpg` (file does not exist). Correct: `og-image.png`.
