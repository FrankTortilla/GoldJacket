// Game engine — draft flow logic

import type { Player, Coach } from './scoreEngine';

export interface GameState {
  gameId: string;
  seed: string;
  mode: 'classic' | 'iq';
  coach: Coach | null;
  currentRound: number;
  roster: (Player | null)[];
  bustPlayerId: string;
  teamSkipsRemaining: number;
  eraSkipsRemaining: number;
  draftStartTime: number;
  roundStartTimes: number[];
  roundOptions: Player[][];
  isComplete: boolean;
}

export interface RoundConfig {
  round: number;
  position: string[];
  era: string;
}

export const ROUND_CONFIG: RoundConfig[] = [
  { round: 1, position: ['QB'], era: '1980s' },
  { round: 2, position: ['RB'], era: '1990s' },
  { round: 3, position: ['WR', 'TE'], era: '1990s' },
  { round: 4, position: ['DL', 'Edge'], era: '2000s' },
  { round: 5, position: ['DB', 'CB', 'S'], era: '2010s' },
  { round: 6, position: ['LB'], era: '2000s' },
  { round: 7, position: ['WR', 'TE'], era: '2010s' },
  { round: 8, position: ['QB', 'RB', 'WR', 'TE', 'DL', 'Edge', 'LB', 'DB', 'CB', 'S'], era: 'any' },
];

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const ALL_ERAS = ['1980s', '1990s', '2000s', '2010s', '2020s'];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededShuffle<T>(arr: T[], key: string): T[] {
  const result = [...arr];
  let h = hashString(key);
  for (let i = result.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateSeed(): string {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

export function initGame(mode: 'classic' | 'iq', seed?: string): GameState {
  const resolvedSeed = seed ?? generateSeed();
  return {
    gameId: crypto.randomUUID(),
    seed: resolvedSeed,
    mode,
    coach: null,
    currentRound: 1,
    roster: Array(8).fill(null),
    bustPlayerId: '',        // hidden until isComplete=true
    teamSkipsRemaining: 1,
    eraSkipsRemaining: 1,
    draftStartTime: Date.now(),
    roundStartTimes: [],
    roundOptions: [],
    isComplete: false,
  };
}

export function generateRoundOptions(
  round: number,
  coach: Coach | null,
  draftedPlayerIds: string[],
  seed: string,
  players: Player[]
): Player[] {
  const config = ROUND_CONFIG[round - 1];
  const isAnyEra = config.era === 'any';

  let pool = players.filter(
    (p) =>
      config.position.includes(p.position) &&
      (isAnyEra || p.era === config.era) &&
      !draftedPlayerIds.includes(p.id)
  );

  // Weight bias players to the front before shuffle
  if (coach?.poolBias && coach.poolBias.length > 0) {
    const biased = pool.filter((p) => coach.poolBias!.includes(p.id));
    const rest = pool.filter((p) => !coach.poolBias!.includes(p.id));
    pool = [...biased, ...biased, ...rest]; // double-weight bias players
  }

  const shuffled = seededShuffle(pool, `${seed}${round}`);
  // Deduplicate after bias weighting
  const seen = new Set<string>();
  const unique = shuffled.filter((p) => (seen.has(p.id) ? false : seen.add(p.id) && true));

  if (unique.length >= 3) return unique.slice(0, 3);

  // Fallback: fill remaining slots from any undrafted players
  const fallback = seededShuffle(
    players.filter((p) => !draftedPlayerIds.includes(p.id) && !seen.has(p.id)),
    `${seed}${round}fallback`
  );
  return [...unique, ...fallback].slice(0, 3);
}

export function draftPlayer(
  state: GameState,
  playerId: string,
  players: Player[]
): GameState {
  const player = players.find((p) => p.id === playerId) ?? null;
  const newRoster = [...state.roster];
  newRoster[state.currentRound - 1] = player;

  const newRound = state.currentRound + 1;
  const isComplete = newRound > 8;

  // Reveal bust player only when the game is complete
  let bustPlayerId = state.bustPlayerId;
  if (isComplete && players.length > 0) {
    const bustIndex = hashString(state.seed) % players.length;
    bustPlayerId = players[bustIndex].id;
  }

  return {
    ...state,
    roster: newRoster,
    currentRound: newRound,
    roundStartTimes: [...state.roundStartTimes, Date.now()],
    isComplete,
    bustPlayerId,
  };
}

export function useTeamSkip(state: GameState, players: Player[]): GameState {
  if (state.teamSkipsRemaining === 0) return state;

  const draftedIds = state.roster.filter(Boolean).map((p) => p!.id);
  const newOptions = generateRoundOptions(
    state.currentRound,
    state.coach,
    draftedIds,
    `${state.seed}${state.currentRound}teamskip`,
    players
  );

  const updatedOptions = [...state.roundOptions];
  updatedOptions[state.currentRound - 1] = newOptions;

  return {
    ...state,
    roundOptions: updatedOptions,
    teamSkipsRemaining: state.teamSkipsRemaining - 1,
  };
}

export function useEraSkip(state: GameState, players: Player[]): GameState {
  if (state.eraSkipsRemaining === 0) return state;

  const config = ROUND_CONFIG[state.currentRound - 1];
  const currentEra = config.era;
  const altEras = ALL_ERAS.filter((e) => e !== currentEra);
  const altEra = altEras[hashString(`${state.seed}${state.currentRound}era`) % altEras.length];

  const draftedIds = state.roster.filter(Boolean).map((p) => p!.id);
  const pool = players.filter(
    (p) => config.position.includes(p.position) && p.era === altEra && !draftedIds.includes(p.id)
  );
  const shuffled = seededShuffle(pool, `${state.seed}${state.currentRound}eraskip`);
  let options = shuffled.slice(0, 3);

  if (options.length < 3) {
    const fallback = seededShuffle(
      players.filter((p) => !draftedIds.includes(p.id) && !options.find((o) => o.id === p.id)),
      `${state.seed}${state.currentRound}eraskipfallback`
    );
    options = [...options, ...fallback].slice(0, 3);
  }

  const updatedOptions = [...state.roundOptions];
  updatedOptions[state.currentRound - 1] = options;

  return {
    ...state,
    roundOptions: updatedOptions,
    eraSkipsRemaining: state.eraSkipsRemaining - 1,
  };
}

export function calculateSpeedBonus(roundStartTimes: number[]): number {
  if (roundStartTimes.length < 2) return 0;
  const deltas: number[] = [];
  for (let i = 1; i < roundStartTimes.length; i++) {
    deltas.push(roundStartTimes[i] - roundStartTimes[i - 1]);
  }
  const avgMs = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  const avgSec = avgMs / 1000;
  if (avgSec < 15) return 0.3;
  if (avgSec < 30) return 0.1;
  return 0;
}
