# Gold Jacket - Handoff

## Status
Prompts 1 through 8 are complete. The application is live in production at
https://gold-jacket-omega.vercel.app.

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
- Prompt 8: Polish + Deploy
  - Mobile layouts polished and verified at 390px across all five screens
  - 48px minimum button targets and global horizontal overflow protection
  - Home, draft transition, player selection, chemistry alert, win counter,
    unit bar, and grade badge animations
  - Coach chemistry IDs corrected to canonical player IDs
  - Round 8 X Factor remains unrestricted after an era reroll
  - Encoded share URLs now load without requiring a saved database result
  - Coach pool bias matching corrected for position and era tags
  - Supabase client initialization made lazy so production prerendering is safe
  - Leaderboard tab switching and expanded mobile rosters verified
  - Production build passes with no route or chunk over 500 kB
- Scoring curve recalibrated to `-0.13 * (score - 65)`, rounded to whole wins, with integer draft-grade thresholds.

## Next
No pending code work. Configure the Gold Jacket Supabase project credentials
and a server-side Anthropic API key in Vercel when those production resources
are available.

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
- `npm run lint` and `npm run build` pass.
- Largest first-load route is `/results` at 167 kB.
- No raster images are used, so there are no image elements requiring lazy loading.
- Vercel project: `steve-6797s-projects/gold-jacket`.
- Production deploy verified at 390px with no browser console warnings or errors.
- The Vercel project currently has no environment variables. Database screens
  use their mock/fallback states, saves are unavailable, and scouting reports
  use fallback copy until production credentials are configured.
