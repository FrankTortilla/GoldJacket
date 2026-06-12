# Gold Jacket — Handoff

## Status
Prompt 2 partial — scoreEngine.ts complete, gameEngine.ts not yet built

## Completed
- Prompt 1: Next.js 14 scaffold, Tailwind, fonts, brand colors, placeholder files
- Prompt 2a: `/lib/scoreEngine.ts` — all 8 functions implemented and pushed
  - Types: Player, Coach, CoachBonus, UnitScores, Unit, Position
  - calculateUnitScore, applyCoachBonus, applyChemistryBonus, calculateBustPenalty
  - projectWins, calculateStrengthRating, calculateDraftGrade, isGoldJacket

## Next
Build `/lib/gameEngine.ts`:
- GameState type (see spec in conversation)
- RoundConfig array (8 rounds with position/era constraints)
- initGame, generateRoundOptions, draftPlayer, useTeamSkip, useEraSkip, calculateSpeedBonus
- Import Player/Coach types from scoreEngine.ts
- Pure functions — no mutation, bust player hidden until isComplete=true

Then: data layer — `/data/players.ts` and `/data/coaches.ts` (Prompt 2 data)

## Notes
- `.env.local` is populated with real Supabase credentials (gitignored)
- `next.config.mjs` — Next.js 14 requires `.mjs`, not `.ts`
- `autoprefixer` added to devDependencies (required by Tailwind PostCSS)
- Font vars: `--font-bebas` (Bebas Neue) and `--font-figtree` (Figtree) applied in layout.tsx
- Tailwind extended with brand colors: `navy`, `gold`, `gold-light`, `card`, `card-border`
- CSS variables defined in `app/globals.css`
- All placeholder files in place: data/, lib/, components/, app/ routes
- Branch: `claude/zen-davinci-tjh04u`
