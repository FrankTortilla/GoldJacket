export type Position =
  | 'QB'
  | 'RB'
  | 'WR'
  | 'TE'
  | 'DL'
  | 'Edge'
  | 'LB'
  | 'CB'
  | 'S';
export type Decade = '1980s' | '1990s' | '2000s' | '2010s' | '2020s';
export type Unit = 'offense' | 'defense' | 'xfactor' | 'all';
export type SlotType = 'QB' | 'RB' | 'WR_TE' | 'DL_LB' | 'DB' | 'XFACTOR';

export interface PlayerStats {
  // QB
  passerRating?: number;
  passingTDs?: number;
  interceptions?: number;
  // RB
  yardsFromScrimmage?: number;
  touchdowns?: number;
  // WR / TE
  receivingYards?: number;
  receivingTDs?: number;
  catchRate?: number; // percentage 0-100
  // DL / Edge
  sacks?: number;
  pressures?: number;
  // LB (also uses sacks from above)
  tackles?: number;
  coverageGrade?: number; // 0-100
  // DB
  defInterceptions?: number;
  passBreakups?: number;
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  team: string;
  decade: Decade;
  peakYear: number;
  stats: PlayerStats;
  positionScore: number;
  eraMultiplier: number;
  superBowlRings: number;
  bio: string;
}

export interface CoachMultiplier {
  unit: Unit;
  value: number; // 1.20 = +20%
}

export interface Coach {
  id: string;
  name: string;
  team: string;
  era: string;
  specialty: string;
  multiplier: CoachMultiplier;
  poolBias: Position[]; // positions bumped in draft probability
  description: string;
}

export interface DraftSlot {
  round: number;
  slotType: SlotType;
  decade?: Decade;
  label: string;
}

export const DRAFT_SLOTS: DraftSlot[] = [
  { round: 1, slotType: 'QB',     decade: '1980s', label: 'QB — 1980s' },
  { round: 2, slotType: 'RB',     decade: '1990s', label: 'RB — 1990s' },
  { round: 3, slotType: 'WR_TE',  decade: '1990s', label: 'WR/TE — 1990s' },
  { round: 4, slotType: 'DL_LB',  decade: '2000s', label: 'DL/LB — 2000s' },
  { round: 5, slotType: 'DB',     decade: '2010s', label: 'DB — 2010s' },
  { round: 6, slotType: 'XFACTOR',                 label: 'X Factor — Any Era' },
  { round: 7, slotType: 'WR_TE',  decade: '2000s', label: 'WR/TE — 2000s' },
  { round: 8, slotType: 'DL_LB',  decade: '2010s', label: 'DL/LB — 2010s' },
];

export const SLOT_POSITIONS: Record<SlotType, Position[]> = {
  QB:      ['QB'],
  RB:      ['RB'],
  WR_TE:   ['WR', 'TE'],
  DL_LB:   ['DL', 'Edge', 'LB'],
  DB:      ['CB', 'S'],
  XFACTOR: ['QB', 'RB', 'WR', 'TE', 'DL', 'Edge', 'LB', 'CB', 'S'],
};
