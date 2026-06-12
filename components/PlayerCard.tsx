'use client';

import { useState } from 'react';
import type { Player } from '../lib/scoreEngine';

interface PlayerCardProps {
  player: Player;
  mode: 'classic' | 'iq';
  isSelected: boolean;
  onSelect: (playerId: string) => void;
}

interface PlayerStats {
  passerRating?: number;
  passingTDs?: number;
  interceptions?: number;
  yardsFromScrimmage?: number;
  touchdowns?: number;
  receivingYards?: number;
  receivingTDs?: number;
  catchRate?: number;
  sacks?: number;
  pressures?: number;
  tackles?: number;
  defInterceptions?: number;
  passBreakups?: number;
}

type DisplayPlayer = Player & {
  team?: string;
  decade?: string;
  stats?: PlayerStats;
};

interface StatItem {
  label: string;
  value: string;
}

const POSITION_COLORS: Record<Player['position'], string> = {
  QB: 'bg-blue-600',
  RB: 'bg-green-600',
  WR: 'bg-purple-600',
  TE: 'bg-orange-600',
  DL: 'bg-red-600',
  Edge: 'bg-red-600',
  LB: 'bg-yellow-600',
  DB: 'bg-teal-600',
  CB: 'bg-teal-600',
  S: 'bg-teal-600',
};

function displayValue(value: number | undefined, suffix = ''): string {
  return value === undefined ? 'N/A' : `${value.toLocaleString()}${suffix}`;
}

function getPlayerStats(player: DisplayPlayer): StatItem[] {
  const stats = player.stats ?? {};

  switch (player.position) {
    case 'QB': {
      const touchdownRatio =
        stats.passingTDs === undefined || stats.interceptions === undefined
          ? 'N/A'
          : `${stats.passingTDs}:${stats.interceptions}`;

      return [
        { label: 'Passer Rating', value: displayValue(stats.passerRating) },
        { label: 'TD:INT Ratio', value: touchdownRatio },
      ];
    }
    case 'RB':
      return [
        { label: 'Scrimmage Yards', value: displayValue(stats.yardsFromScrimmage) },
        { label: 'Rushing TDs', value: displayValue(stats.touchdowns) },
      ];
    case 'WR':
    case 'TE':
      return [
        { label: 'Receiving Yards', value: displayValue(stats.receivingYards) },
        { label: 'Receiving TDs', value: displayValue(stats.receivingTDs) },
        { label: 'Catch Rate', value: displayValue(stats.catchRate, '%') },
      ];
    case 'DL':
    case 'Edge':
      return [
        { label: 'Sacks', value: displayValue(stats.sacks) },
        { label: 'Pressures', value: displayValue(stats.pressures) },
      ];
    case 'LB':
      return [
        { label: 'Tackles', value: displayValue(stats.tackles) },
        { label: 'Sacks', value: displayValue(stats.sacks) },
      ];
    case 'DB':
    case 'CB':
    case 'S':
      return [
        { label: 'Interceptions', value: displayValue(stats.defInterceptions) },
        { label: 'Pass Breakups', value: displayValue(stats.passBreakups) },
      ];
  }
}

export default function PlayerCard({
  player,
  mode,
  isSelected,
  onSelect,
}: PlayerCardProps) {
  const [hasGlow, setHasGlow] = useState(false);
  const displayPlayer = player as DisplayPlayer;
  const stats = getPlayerStats(displayPlayer);

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(player.id)}
      onMouseEnter={() => setHasGlow(true)}
      onMouseLeave={() => setHasGlow(false)}
      onFocus={() => setHasGlow(true)}
      onBlur={() => setHasGlow(false)}
      className={`relative min-h-[120px] w-full rounded-xl border bg-card p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-gold focus-visible:scale-[1.02] focus-visible:border-gold focus-visible:outline-none ${
        isSelected ? 'border-gold' : 'border-card-border'
      }`}
      style={{
        boxShadow: hasGlow ? '0 0 12px rgba(201,168,76,0.4)' : 'none',
      }}
    >
      {isSelected && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 text-lg font-bold text-gold"
        >
          ✓
        </span>
      )}

      <div className="flex items-start gap-3 pr-7">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded text-xs font-bold text-white ${POSITION_COLORS[player.position]}`}
        >
          {player.position}
        </span>

        <div className="min-w-0">
          <h3 className="font-[var(--font-bebas)] text-lg font-bold tracking-wide text-white">
            {player.name}
          </h3>
          {mode === 'classic' && (
            <p className="text-sm text-gray-400">
              {displayPlayer.team ?? 'NFL Legend'} · {displayPlayer.decade ?? player.era}
            </p>
          )}
        </div>
      </div>

      {mode === 'classic' ? (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="font-bold text-gold">{stat.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 flex gap-3 text-lg font-bold tracking-[0.2em] text-gray-600">
          <span>???</span>
          <span>???</span>
          <span>???</span>
        </div>
      )}
    </button>
  );
}
