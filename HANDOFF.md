# Gold Jacket — Handoff

## Status
Prompt 2 complete — data layer committed and pushed, ready for Prompt 3

## Next
Prompt 3 — Scoring engine (lib/scoreEngine.ts, lib/gameEngine.ts)

## Notes
- `.env.local` is populated with real Supabase credentials (gitignored)
- `next.config.mjs` — Next.js 14 requires `.mjs`, not `.ts`
- `autoprefixer` added to devDependencies (required by Tailwind PostCSS)
- Font vars: `--font-bebas` (Bebas Neue) and `--font-figtree` (Figtree) applied in layout.tsx
- Tailwind extended with brand colors: `navy`, `gold`, `gold-light`, `card`, `card-border`
- CSS variables defined in `app/globals.css`
- All placeholder files in place: data/, lib/, components/, app/ routes

## Data layer (Prompt 2)
- `data/types.ts` — Player, Coach, DraftSlot, DRAFT_SLOTS, SLOT_POSITIONS
- `data/players.ts` — 91 unique players; decade field controls round eligibility
  - Round 1 pool (QB 1980s): Marino, Montana, Elway
  - Round 2 pool (RB 1990s): E. Smith, B. Sanders, Thomas, T. Davis, M. Faulk
  - Round 3 pool (WR/TE 1990s): Rice, R. Moss, Irvin, Carter, T. Brown, Sharpe
  - Round 4 pool (DL/LB 2000s): R. Lewis, Sapp, Strahan, J. Taylor, Ware
  - Round 5 pool (DB 2010s): Polamalu, Sherman, Revis
  - Round 8 pool (DL/LB 2010s): J.J. Watt, A. Donald, V. Miller, T.J. Watt
  - All other players are X Factor (Round 6) eligible only
- `data/coaches.ts` — 8 coaches: Walsh, Noll, Shula, Gibbs, J. Johnson, Belichick, Reid, Dungy
  - Each has a unit multiplier (offense/defense/xfactor/all) and poolBias positions
  - Andy Reid has highest offense multiplier (1.25×); Jimmy Johnson has xfactor 1.35×
