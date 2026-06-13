# Gold Jacket - Handoff

## Status
Prompts 1, 2, 3, and 4 are complete. The project is ready for Prompt 5 - Supabase integration.

## Completed
- Prompt 1: Next.js 14 scaffold, Tailwind CSS, Supabase setup, fonts, brand colors, routes, and placeholder structure
- Prompt 2: Data layer
  - `data/players.ts` - 92 NFL legends with full stats
  - `data/coaches.ts` - 8 coaches with bonuses and pool bias
- Prompt 3: Game and scoring logic
  - `lib/scoreEngine.ts` - all 8 scoring functions
  - `lib/gameEngine.ts` - full draft flow
  - `lib/dailyChallenge.ts` - UTC-safe daily seed
  - `lib/shareUtils.ts` - base64 share-code encoding and decoding
- Prompt 4: UI screens and supporting draft interactions
  - `components/PlayerCard.tsx`
  - `components/CoachCard.tsx`
  - `components/SlotMachine.tsx`
  - `components/RosterSidebar.tsx`
  - `components/ResultCard.tsx`
  - `data/rivalries.ts`
  - `app/page.tsx`
  - `app/draft/page.tsx`
  - `app/results/page.tsx`
  - `app/leaderboard/page.tsx`
  - `app/hof/page.tsx`

## Next
Prompt 5 - Supabase integration.

## Notes
- All completed Prompt 2 and Prompt 3 work is integrated into `main`.
- `.env.local` contains real Supabase credentials and is gitignored.
- `next.config.mjs` is used for Next.js 14.
- `autoprefixer` is included in devDependencies for Tailwind PostCSS.
- Font variables are `--font-bebas` and `--font-figtree`.
- Tailwind brand colors are `navy`, `gold`, `gold-light`, `card`, and `card-border`.
- CSS variables are defined in `app/globals.css`.
