# Gold Jacket — Handoff

## Status
Prompt 1 complete — app running clean on localhost:3001, ready for Prompt 2

## Next
Prompt 2 — Data layer (players.ts, coaches.ts, types)

## Notes
- `.env.local` is populated with real Supabase credentials (gitignored)
- `next.config.mjs` — Next.js 14 requires `.mjs`, not `.ts`
- `autoprefixer` added to devDependencies (required by Tailwind PostCSS)
- Font vars: `--font-bebas` (Bebas Neue) and `--font-figtree` (Figtree) applied in layout.tsx
- Tailwind extended with brand colors: `navy`, `gold`, `gold-light`, `card`, `card-border`
- CSS variables defined in `app/globals.css`
- All placeholder files in place: data/, lib/, components/, app/ routes
