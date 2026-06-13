// Share utilities — encode/decode results and generate share URLs

import type { GameState } from './gameEngine';

export interface SharedResultPayload {
  coachId: string | null;
  rosterIds: (string | null)[];
  seed: string;
  mode: GameState['mode'];
  bustPlayerId: string;
  projectedWins?: number;
  unitScores?: unknown;
  strengthRating?: number;
  draftGrade?: string;
  isGoldJacket?: boolean;
}

export function encodeResult(state: GameState, score: object): string {
  const scoreData = score as Record<string, unknown>;
  const payload = {
    coachId: state.coach?.id ?? null,
    rosterIds: state.roster.map((p) => p?.id ?? null),
    seed: state.seed,
    mode: state.mode,
    bustPlayerId: state.bustPlayerId,
    projectedWins: scoreData.projectedWins,
    unitScores: scoreData.unitScores,
    strengthRating: scoreData.strengthRating,
    draftGrade: scoreData.draftGrade,
    isGoldJacket: scoreData.isGoldJacket,
  };
  return btoa(JSON.stringify(payload));
}

export function decodeResult(code: string): SharedResultPayload | null {
  try {
    const parsed = JSON.parse(atob(code)) as Partial<SharedResultPayload>;

    if (
      typeof parsed.seed !== 'string' ||
      !Array.isArray(parsed.rosterIds) ||
      (parsed.coachId !== null && typeof parsed.coachId !== 'string')
    ) {
      return null;
    }

    return {
      coachId: parsed.coachId ?? null,
      rosterIds: parsed.rosterIds,
      seed: parsed.seed,
      mode: parsed.mode === 'iq' ? 'iq' : 'classic',
      bustPlayerId:
        typeof parsed.bustPlayerId === 'string' ? parsed.bustPlayerId : '',
      projectedWins: parsed.projectedWins,
      unitScores: parsed.unitScores,
      strengthRating: parsed.strengthRating,
      draftGrade: parsed.draftGrade,
      isGoldJacket: parsed.isGoldJacket,
    };
  } catch {
    return null;
  }
}

export function generateShareURL(shareCode: string): string {
  return `/results?code=${encodeURIComponent(shareCode)}`;
}
