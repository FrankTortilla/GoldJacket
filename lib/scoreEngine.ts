// Score engine — win projection via sigmoid curve

export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'DL' | 'Edge' | 'LB' | 'DB' | 'CB' | 'S';
export type Unit = 'offense' | 'defense' | 'xfactor';

export interface Player {
  id: string;
  name: string;
  position: Position;
  era: string;
  positionScore: number;
  eraMultiplier: number;
  slot?: Unit | string;
}

export interface CoachBonus {
  unit: Unit;
  multiplier: number;
}

export interface Coach {
  id: string;
  name: string;
  bonus: CoachBonus;
  chemistryPlayers: string[];
  poolBias?: string[];
}

export interface UnitScores {
  offense: number;
  defense: number;
  xfactor: number;
}

const OFFENSE_POSITIONS: Position[] = ['QB', 'RB', 'WR', 'TE'];
const DEFENSE_POSITIONS: Position[] = ['DL', 'Edge', 'LB', 'DB', 'CB', 'S'];

function isOffensePlayer(p: Player): boolean {
  return OFFENSE_POSITIONS.includes(p.position);
}

function isDefensePlayer(p: Player): boolean {
  return DEFENSE_POSITIONS.includes(p.position);
}

export function calculateUnitScore(players: Player[], unit: Unit): number {
  let group: Player[];

  if (unit === 'offense') {
    group = players.filter((p) => p.slot !== 'xfactor' && isOffensePlayer(p));
  } else if (unit === 'defense') {
    group = players.filter((p) => p.slot !== 'xfactor' && isDefensePlayer(p));
  } else {
    group = players.filter((p) => p.slot === 'xfactor');
  }

  if (group.length === 0) return 0;

  const total = group.reduce((sum, p) => sum + p.positionScore * p.eraMultiplier, 0);
  const avg = total / group.length;

  const weights: Record<Unit, number> = { offense: 0.5, defense: 0.35, xfactor: 0.15 };
  return avg * weights[unit];
}

export function applyCoachBonus(unitScores: UnitScores, coach: Coach): UnitScores {
  const adjusted = { ...unitScores };
  const { unit, multiplier } = coach.bonus;
  adjusted[unit] = adjusted[unit] * multiplier;
  return adjusted;
}

export function applyChemistryBonus(players: Player[], coach: Coach): Player[] {
  return players.map((p) =>
    coach.chemistryPlayers.includes(p.id)
      ? { ...p, positionScore: p.positionScore + 3 }
      : p
  );
}

export function calculateBustPenalty(players: Player[], bustPlayerId: string): Player[] {
  return players.map((p) =>
    p.id === bustPlayerId
      ? { ...p, positionScore: p.positionScore * 0.8 }
      : p
  );
}

export function projectWins(unitScores: UnitScores, coachMultiplier: number): number {
  // Calibration check (actual values):
  // score 55  → ~4 wins
  // score 62  → ~7 wins
  // score 70  → ~11 wins
  // score 78  → ~14 wins
  // score 86  → ~16 wins
  // score 93  → ~17 wins
  // score 98  → ~17 wins
  const baseScore =
    unitScores.offense * 0.5 +
    unitScores.defense * 0.35 +
    unitScores.xfactor * 0.15;

  const totalScore = baseScore * coachMultiplier;
  const raw = 17 / (1 + Math.exp(-0.13 * (totalScore - 65)));
  const rounded = Math.round(raw);
  return rounded;
}

export function calculateStrengthRating(totalScore: number): number {
  return Math.min(100, Math.max(0, Math.round(totalScore)));
}

export function calculateDraftGrade(projectedWins: number): string {
  if (projectedWins === 17) return 'A+';
  if (projectedWins >= 15) return 'A';
  if (projectedWins >= 13) return 'B+';
  if (projectedWins >= 11) return 'B';
  if (projectedWins >= 9) return 'C+';
  if (projectedWins >= 7) return 'C';
  if (projectedWins >= 5) return 'D';
  return 'F';
}

export function isGoldJacket(projectedWins: number): boolean {
  return projectedWins === 17;
}
