# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server with Turbopack at localhost:3000
npm run build    # Production build
npm run lint     # ESLint via next lint
npm run format   # Prettier (writes in place)
```

No test suite is configured.

## Architecture

This is a **Next.js 15 App Router** project (Italian language, `lang="it"`) for **08 Natural Technology**, a nutraceutical brand by VIPHARMA di Tatulli Vito & Co. S.A.S. (Bitonto, BA).

### Data layer

All product and article data is static mock data — no backend or CMS yet.

- `lib/mock-data.ts` — source of truth for `PRODUCTS` and `ARTICLES` arrays
- `lib/lines.ts` — defines the four product lines (`menopausa`, `beauty`, `circolo`, `energia`) with brand colors
- `services/products.ts` and `services/articles.ts` — async wrappers over mock data (designed to be swapped for real API calls later)
- `types/index.ts` — shared TypeScript interfaces (`Product`, `Article`, `Line`, `Ingredient`)

### Routing

App Router pages under `app/`:
- `/` — homepage
- `/prodotti` — product listing; `/prodotti/[slug]` — product detail
- `/blog` — article listing; `/blog/[slug]` — article detail
- `/brand`, `/metodo`, `/trasparenza`, `/contatti`, `/b2b` — static content pages

### Components

- `components/layout/` — `Navbar`, `Footer`, `Logo` (shared across all pages via `app/layout.tsx`)
- `components/ui/` — reusable UI primitives: `Button`, `PageHeader`, `ProductCard`, `ProductGallery`
- `components/sections/` — page-level section components

### Styling

Tailwind CSS v4 with PostCSS. Three Google Fonts loaded as CSS variables:
- `--font-montserrat` (body/UI)
- `--font-cormorant` (editorial/headings)
- `--font-great-vibes` (accent script)

Utility: `lib/utils.ts` exports `cn()` (clsx + tailwind-merge). `lib/social-links.tsx` exports social link definitions.

### Images

Product images are stored under `public/products/<slug>/` with four standard views: `fronte.png`, `infografica.png`, `lato-1.png`, `lato-2.png` (plus optional `etichetta.png`). Next.js Image optimization is configured for avif/webp.
