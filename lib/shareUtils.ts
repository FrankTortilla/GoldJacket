// Share utilities — encode/decode results and generate share URLs

import type { GameState } from './gameEngine';

export function encodeResult(state: GameState, score: object): string {
  const payload = {
    coachId: state.coach?.id ?? null,
    rosterIds: state.roster.map((p) => p?.id ?? null),
    seed: state.seed,
    projectedWins: (score as Record<string, unknown>).projectedWins,
    draftGrade: (score as Record<string, unknown>).draftGrade,
    isGoldJacket: (score as Record<string, unknown>).isGoldJacket,
  };
  return btoa(JSON.stringify(payload));
}

export function decodeResult(code: string): { state: Partial<GameState>; score: object } | null {
  try {
    const parsed = JSON.parse(atob(code));
    return { state: parsed, score: parsed };
  } catch {
    return null;
  }
}

export function generateShareURL(shareCode: string): string {
  return `/results?code=${encodeURIComponent(shareCode)}`;
}
