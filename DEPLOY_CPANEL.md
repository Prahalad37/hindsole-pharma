# cPanel Deploy Guide – AyurVita

## Step 1: Create deploy.zip

```bash
npm run deploy:zip
```

Creates `deploy.zip` in project root (~26 MB) containing:
- `index.html`, `assets/`, `blogs/`, `products/`, `doctors/`, `hero-slides/`, `logo.svg`, `og-image.png`
- `.htaccess` for SPA routing, HTTPS redirect, gzip, caching

## Step 2: Upload to cPanel

1. **cPanel** → **File Manager** → open `public_html`
2. Delete existing files (or back them up first)
3. **Upload** → select `deploy.zip`
4. **Extract** the zip in `public_html`

Final structure:

```
public_html/
├── .htaccess
├── index.html
├── assets/
├── blogs/
├── products/
├── doctors/
├── hero-slides/
├── logo.svg
└── og-image.png
```

## Step 3: Check .htaccess

If Apache `mod_rewrite` is on, `.htaccess` will:
- Force HTTPS
- Route all paths (e.g. `/shop`, `/product/dr-arthovita-oil`) to `index.html`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 404 on refresh | Enable `mod_rewrite`, confirm `.htaccess` is uploaded |
| Mixed content (HTTP assets on HTTPS) | Ensure `VITE_SITE_URL` in `.env` is `https://ayurvita.in` |
| Blank page | Check browser console for errors; ensure Firebase env vars are set in build |

## Build Env Vars

Set these before `npm run deploy:zip` so they are baked into the build:

```
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_WHATSAPP_NUMBER=
VITE_SITE_URL=https://ayurvita.in
```

See `.env.example` for reference.
