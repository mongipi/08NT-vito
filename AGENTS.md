# Repository Guidelines

## Project Structure & Module Organization
`app/` contains the Next.js App Router pages, route handlers, and page-specific client components. Shared UI lives in `components/`, with layout primitives in `components/layout` and reusable storefront/admin widgets in `components/ui`. Business logic and integrations live in `lib/` and `services/`; prefer `services/` for Prisma-backed reads and `lib/actions/` for mutations. Database schema and seed data are in `prisma/`. Static assets belong in `public/`, especially `public/v61/` for production visuals and `reference_static_v61/` for legacy design reference only.

## Build, Test, and Development Commands
Use `npm run dev` for local development and `npm run build` to verify the production bundle. Use `npm run start` only after a successful build. Run `npm run format` to apply Prettier formatting. Database helpers are `npm run db:generate`, `npm run db:push`, `npm run db:migrate`, `npm run db:seed`, and `npm run db:studio`. For a quick type safety pass, use `npx tsc --noEmit`.

## Coding Style & Naming Conventions
This repo uses TypeScript, React 19, Next.js 15, and Prisma. Prettier enforces 2-space indentation, single quotes, no semicolons, trailing commas (`es5`), and a 100-character line width. ESLint extends `next/core-web-vitals` and `next/typescript`. Use `PascalCase` for React components, `camelCase` for functions and variables, and `kebab-case` for route folders such as `app/lavora-con-noi`. Keep server-side data access close to existing patterns instead of introducing new abstractions.

## Testing Guidelines
There is no dedicated automated test suite yet. Every change should at minimum pass `npm run build` and `npx tsc --noEmit`. For UI work, manually verify desktop, mobile, and tablet breakpoints; this project frequently targets `360x800`, `768x1024`, and `1024x768`. When touching checkout, email, auth, or Stripe flows, note what was verified manually and what still depends on external services.

## Commit & Pull Request Guidelines
Recent history follows short Conventional Commit subjects such as `fix:` and `feat:`. Keep commit messages imperative and scoped, for example `fix: align footer courier logos`. Pull requests should include a concise summary, affected pages or flows, any required env or schema changes, and before/after screenshots for visual updates. Link related issues when available and call out any manual QA performed.

## Security & Configuration Tips
Never commit real secrets from `.env` or `.env.local`. Treat SMTP, Stripe, OpenAI, Supabase, and OAuth credentials as environment-only settings. If you change Prisma models, include the schema update and the exact command needed to sync the database.
