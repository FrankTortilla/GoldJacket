# Gold Jacket - Handoff

## Status
Prompts 1 through 7 are complete. The project is ready for the next prompt.

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
- Prompt 5: Supabase integration
  - `lib/db.ts` - result persistence and leaderboard queries
  - Results saving and share-code loading
  - Live leaderboard and Hall of Fame data
  - Home screen personal-best banner
- Prompt 6: Shareable roster card
  - `components/ShareCard.tsx` - fixed-size card built with inline styles
  - Web Share API wired up with a generated PNG image
  - Falls back to PNG download on desktop
  - Falls back to result URL copy on error
- Prompt 7: AI scouting report
  - `lib/scoutingReport.ts` - Anthropic Messages API integration and fallback copy
  - Results page generates a roster-specific report after game state loads
  - Scout report loading state uses animated bars and review copy
- Scoring curve recalibrated to `-0.13 * (score - 65)`, rounded to whole wins, with integer draft-grade thresholds.

## Next
Awaiting the next prompt.

## Notes
- All completed Prompt 2 and Prompt 3 work is integrated into `main`.
- `.env.local` is gitignored and must contain the real Supabase credentials for local testing.
- `.env.local` must also contain `NEXT_PUBLIC_ANTHROPIC_API_KEY` for live scouting reports.
- `next.config.mjs` is used for Next.js 14.
- `autoprefixer` is included in devDependencies for Tailwind PostCSS.
- Font variables are `--font-bebas` and `--font-figtree`.
- Tailwind brand colors are `navy`, `gold`, `gold-light`, `card`, and `card-border`.
- CSS variables are defined in `app/globals.css`.
- Run the Prompt 5 SQL in the Supabase dashboard before testing database features.
