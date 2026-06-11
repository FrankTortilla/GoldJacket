# Gold Jacket

## What it is
An NFL legend draft game. Players select a head coach, then draft 8 historical
NFL legends across eras. A simulation engine projects their team's win total
out of 17 games. Goal: build the perfect 17-0 roster.

## Tagline
"Build your legend. Earn your jacket."

## Tech Stack
- Next.js 14 (app router)
- Tailwind CSS
- Supabase (leaderboard + saved results + daily challenge)
- Vercel (deployment)
- Google Fonts: Bebas Neue (headings) + Figtree (body)
- Anthropic Claude API (AI scouting report on results screen)

## Brand
- Name: Gold Jacket
- Colors: Deep navy #0a0f1e, Gold #c9a84c, White #f5f5f5, Dark card #111827
- Max season = 17 wins (modern NFL)

## Roster Structure (8 players, 6 rounds)
- Round 1: QB — 1980s
- Round 2: RB — 1990s
- Round 3: WR/TE flex — 1990s
- Round 4: DL/Edge or LB — 2000s
- Round 5: DB/CB/S — 2010s
- Round 6: X Factor — any position, any era, no restrictions
- Round 7: WR/TE flex — 2000s
- Round 8: DL/Edge or LB — 2010s

## Era Structure
- Weighted toward 1990s and 2000s (doubled up)
- 2020s represented in X Factor wildcard slot

## Coach System (Round 0 — before draft)
- Player sees Round 1 slot machine options FIRST
- Then selects coach based on that information
- Coach influences player pool (poolBias) throughout draft
- Coach applies stat multiplier to final simulation score
- 8 coaches available

## Scoring Engine
- Position-normalized scoring (players scored vs position peers)
  - QB: passer rating + TD:INT ratio
  - RB: yards from scrimmage + TDs
  - WR/TE: yards + TDs + catch rate
  - DL/Edge: sacks + pressures
  - LB: tackles + sacks + coverage grade
  - DB: INTs + PBUs + coverage grade
- Three unit scores:
  - Offense (50%): QB + RB + WR/TE slots
  - Defense (35%): DL + LB + DB slots
  - X Factor (15%): wildcard slot, any position
- Coach multiplier applied to relevant unit
- Sigmoid curve: wins = 17 / (1 + e^(-0.08 * (totalScore - 85)))
- Era normalization applied before scoring
- 17-0 requires near-perfect roster + right coach combination
- Average score targets: 10-12 wins, good = 13-15, legendary = 17-0

## Game Modes
- Classic: Full stats visible during draft
- Gold Jacket IQ: Stats hidden, draft from memory

## Key Features
- Daily Challenge: date-based seed, same for all players, resets daily
- Head-to-head: same seed, compare rosters, draft speed tiebreaker
- Draft speed bonus: faster picks earn fractional win bonus in H2H
- Bust Card: one random player per game has hidden -20% stat penalty
- Pre-draft power rankings: top 5 available per position shown before draft
- Coach Chemistry score: how well roster fits coach system
- Draft grade: letter grade A+ to F on results screen
- AI Scouting Report: Claude API generates one-paragraph roster roast
- Shareable roster card: visual image card optimized for mobile sharing
- Hall of Fame Wall: persistent page showing all 17-0 rosters achieved

## Multiplayer
- Async: share result URL, friends try to beat your score
- Head-to-head: same seed, draft speed tiebreaker for ties

## Session Management
- Always read CLAUDE.md and HANDOFF.md at session start
- Update HANDOFF.md at end of every session
- One logical feature per Claude Code session
- Commit to GitHub after each completed prompt
