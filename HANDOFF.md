# Gold Jacket — Handoff

## Status
Prompt 2 (partial) — coaches.ts complete with all 8 coaches. players.ts still empty.

## Completed
- `data/coaches.ts` — 8 coaches with full schema: id, name, era, record, superBowls, specialty, bio, bonus, poolBias, chemistryPlayers
- All multipliers capped at 1.20x maximum
- Coach count: exactly 8

## Coaches
| ID | Name | Bonus | Multiplier |
|---|---|---|---|
| belichick | Bill Belichick | INTs & Sacks +20% | 1.20 |
| walsh | Bill Walsh | Passing & Receiving +20% | 1.20 |
| lombardi | Vince Lombardi | All Stats +10% | 1.10 |
| johnson | Jimmy Johnson | X Factor +20% | 1.20 |
| shanahan | Mike Shanahan | Rushing +20% | 1.20 |
| reid | Andy Reid | Receiving TDs +20% | 1.20 |
| dungy | Tony Dungy | INTs +20% | 1.20 |
| shula | Don Shula | All Stats +8% | 1.08 |

## Open Issues
⚠️ OPEN ISSUE: Verify chemistryPlayers IDs in coaches.ts match exact player IDs in players.ts before Prompt 5. coaches.ts uses snake_case, players.ts may use kebab-case.

## Next
- Populate `data/players.ts` with NFL legends pool (Prompt 2 continuation)
- Build scoring engine in `lib/scoreEngine.ts`

## Notes
- `.env.local` is populated with real Supabase credentials (gitignored)
- `next.config.mjs` — Next.js 14 requires `.mjs`, not `.ts`
- `autoprefixer` added to devDependencies (required by Tailwind PostCSS)
- Font vars: `--font-bebas` (Bebas Neue) and `--font-figtree` (Figtree) applied in layout.tsx
- Tailwind extended with brand colors: `navy`, `gold`, `gold-light`, `card`, `card-border`
- CSS variables defined in `app/globals.css`
- All placeholder files in place: data/, lib/, components/, app/ routes
- Tony Dungy's requested bonus was INTs +22% — capped to 1.20x per project rules
- Don Shula has empty poolBias (no positional bias by design)
