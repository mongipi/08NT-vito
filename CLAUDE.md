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

Data is stored in PostgreSQL via Prisma (`prisma/schema.prisma`). There is no CMS.

- `services/` — read-side data access (`products.ts`, `articles.ts`); returns mapped DTOs, not raw Prisma rows
- `lib/actions/` — server actions for mutations (checkout, account, coupon, and `lib/actions/admin/*`)
- `lib/settings.ts` — key/value `Setting` table with a 60s in-process cache; `SETTING_KEYS` is the authoritative list of admin-editable values (`/admin/impostazioni`)
- `lib/site-settings.ts` — maps those settings into `PublicSiteSettings` for the storefront
- `types/index.ts` — shared TypeScript interfaces (`Product`, `Article`, `Line`, `Ingredient`)

Content that is *not* in `SETTING_KEYS` is intentionally hardcoded in the component that renders it (nav links, footer sections, home features, product page copy, `/metodo` content in `lib/method-page.ts`).

### Routing

App Router pages under `app/`:
- `/` — homepage
- `/prodotti` — product listing; `/prodotti/[slug]` — product detail
- `/blog` — article listing; `/blog/[slug]` — article detail
- `/checkout`, `/account/**` — cart-to-order flow and customer area
- `/admin/**` — admin panel (guarded by `middleware.ts` + `app/admin/layout.tsx`)
- `/metodo`, `/contatti`, `/b2b`, `/lavora-con-noi`, `/privacy`, `/cookie`, `/note-legali`, `/termini-condizioni-vendita`, `/resi-e-spedizioni` — static content pages

### Components

- `components/layout/` — `Navbar`, `Footer`, `Logo` (shared across all pages via `app/layout.tsx`)
- `components/ui/` — reusable UI primitives: `Button`, `PageHeader`, `ProductCard`, `ProductGallery`
- `app/admin/_components/` — admin-only primitives (`AdminShell`, `Badge`, `ConfirmModal`, `styles.ts`)

### Styling

Tailwind CSS v4 with PostCSS. Three Google Fonts loaded as CSS variables:
- `--font-montserrat` (body/UI)
- `--font-cormorant` (editorial/headings)
- `--font-great-vibes` (accent script)

Utility: `lib/utils.ts` exports `cn()` (clsx + tailwind-merge), `formatDate()`, `slugify()`. Social links come from `getSocialLinks()` in `lib/site-settings.ts` (URLs are admin-editable).

Note: `Navbar`, `Footer` and several storefront sections still use the legacy `v61-*` CSS classes from `app/globals.css`. Do not convert them to Tailwind without an explicit request — a previous attempt changed the layout and was rolled back.

### Images

Product images live in the database (`ProductImage` model, `Bytes`) and are served by `app/api/product-images/[productId]/[key]/route.ts` with immutable caching. Standard keys: `fronte`, `infografica`, `lato-1`, `lato-2` (plus optional `etichetta`). Legacy copies under `public/products/<slug>/` are still on disk as a fallback. Next.js Image optimization is configured for avif/webp.
