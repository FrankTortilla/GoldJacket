# Gold Jacket - Handoff

## Status
Prompts 1, 2, and 3 are complete. The project is ready for Prompt 4 - UI Screens.

## Completed
- Prompt 1: Next.js 14 scaffold, Tailwind CSS, Supabase setup, fonts, brand colors, routes, and placeholder structure
- Prompt 2: Data layer
  - `data/players.ts` - 92 NFL legends with full stats
  - `data/coaches.ts` - 8 coaches with bonuses and pool bias
- Prompt 3: Game and scoring logic
  - `lib/scoreEngine.ts` - all 8 scoring functions
  - `lib/gameEngine.ts` - full draft flow (161 lines)
  - `lib/dailyChallenge.ts` - UTC-safe daily seed
  - `lib/shareUtils.ts` - base64 share-code encoding and decoding

## Next
Prompt 4 - UI Screens. Start with the first UI component and build the draft experience against the completed data and game engines.

## Repository Integration
- `main` currently contains the Prompt 1 scaffold and placeholder data/lib files.
- Prompt 2 implementation commits are on remote Prompt 2 branches.
- Prompt 3 implementation commits are on `origin/claude/zen-davinci-tjh04u`.
- Integrate the completed Prompt 2 and Prompt 3 work before wiring UI components to these modules on `main`.

## Notes
- `.env.local` contains real Supabase credentials and is gitignored.
- `next.config.mjs` is used for Next.js 14.
- `autoprefixer` is included in devDependencies for Tailwind PostCSS.
- Font variables are `--font-bebas` and `--font-figtree`.
- Tailwind brand colors are `navy`, `gold`, `gold-light`, `card`, and `card-border`.
- CSS variables are defined in `app/globals.css`.
