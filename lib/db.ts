import { supabase } from './supabase';

export type GameResult = {
  id?: string;
  playerName: string;
  coachId: string;
  coachName: string;
  roster: {
    name: string;
    position: string;
    decade: string;
    positionScore: number;
  }[];
  projectedWins: number;
  strengthRating: number;
  unitScores: {
    offense: number;
    defense: number;
    xfactor: number;
  };
  draftGrade: string;
  isGoldJacket: boolean;
  gameMode: 'classic' | 'iq';
  shareCode: string;
  seed: string;
  isDailyChallenge: boolean;
  challengeDate?: string;
  trashTalk?: string;
  createdAt?: string;
};

type GameResultRow = {
  id: string;
  player_name: string;
  coach_id: string;
  coach_name: string;
  roster: GameResult['roster'];
  projected_wins: number | string;
  strength_rating: number;
  unit_scores: GameResult['unitScores'];
  draft_grade: string;
  is_gold_jacket: boolean;
  game_mode: GameResult['gameMode'];
  share_code: string;
  seed: string;
  is_daily_challenge: boolean;
  challenge_date: string | null;
  trash_talk: string | null;
  created_at: string;
};

function toRow(result: GameResult) {
  return {
    player_name: result.playerName,
    coach_id: result.coachId,
    coach_name: result.coachName,
    roster: result.roster,
    projected_wins: result.projectedWins,
    strength_rating: result.strengthRating,
    unit_scores: result.unitScores,
    draft_grade: result.draftGrade,
    is_gold_jacket: result.isGoldJacket,
    game_mode: result.gameMode,
    share_code: result.shareCode,
    seed: result.seed,
    is_daily_challenge: result.isDailyChallenge,
    challenge_date: result.challengeDate ?? null,
    trash_talk: result.trashTalk ?? null,
  };
}

function fromRow(row: GameResultRow): GameResult {
  return {
    id: row.id,
    playerName: row.player_name,
    coachId: row.coach_id,
    coachName: row.coach_name,
    roster: row.roster,
    projectedWins: Number(row.projected_wins),
    strengthRating: row.strength_rating,
    unitScores: row.unit_scores,
    draftGrade: row.draft_grade,
    isGoldJacket: row.is_gold_jacket,
    gameMode: row.game_mode,
    shareCode: row.share_code,
    seed: row.seed,
    isDailyChallenge: row.is_daily_challenge,
    challengeDate: row.challenge_date ?? undefined,
    trashTalk: row.trash_talk ?? undefined,
    createdAt: row.created_at,
  };
}

function getLocalPeriodStart(period: 'today' | 'weekly'): string {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (period === 'weekly') {
    const daysSinceMonday = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - daysSinceMonday);
  }

  return start.toISOString();
}

function getUtcDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export async function saveResult(
  result: GameResult
): Promise<string | null> {
  const { data, error } = await supabase
    .from('game_results')
    .insert(toRow(result))
    .select('share_code')
    .single();

  if (error) {
    console.error('Failed to save game result:', error);
    return null;
  }

  return data.share_code;
}

export async function getLeaderboard(
  options: {
    mode?: 'classic' | 'iq' | 'all';
    period?: 'today' | 'weekly' | 'alltime';
    limit?: number;
  } = {}
): Promise<GameResult[]> {
  const {
    mode = 'all',
    period = 'alltime',
    limit = 25,
  } = options;
  let query = supabase
    .from('game_results')
    .select('*')
    .order('projected_wins', { ascending: false })
    .limit(limit);

  if (mode !== 'all') {
    query = query.eq('game_mode', mode);
  }

  if (period === 'today' || period === 'weekly') {
    query = query.gte('created_at', getLocalPeriodStart(period));
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to load leaderboard:', error);
    return [];
  }

  return (data as GameResultRow[]).map(fromRow);
}

export async function getGoldJackets(): Promise<GameResult[]> {
  const { data, error } = await supabase
    .from('game_results')
    .select('*')
    .eq('is_gold_jacket', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load Gold Jacket results:', error);
    return [];
  }

  return (data as GameResultRow[]).map(fromRow);
}

export async function getDailyLeaderboard(
  date = getUtcDateKey()
): Promise<GameResult[]> {
  const { data, error } = await supabase
    .from('game_results')
    .select('*')
    .eq('is_daily_challenge', true)
    .eq('challenge_date', date)
    .order('projected_wins', { ascending: false });

  if (error) {
    console.error('Failed to load daily leaderboard:', error);
    return [];
  }

  return (data as GameResultRow[]).map(fromRow);
}

export async function getResultByShareCode(
  code: string
): Promise<GameResult | null> {
  const { data, error } = await supabase
    .from('game_results')
    .select('*')
    .eq('share_code', code)
    .maybeSingle();

  if (error) {
    console.error('Failed to load shared result:', error);
    return null;
  }

  return data ? fromRow(data as GameResultRow) : null;
}
