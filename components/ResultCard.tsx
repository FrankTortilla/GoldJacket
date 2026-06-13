'use client';

import { useEffect, useState } from 'react';
import type { Coach, Player } from '../lib/scoreEngine';
import {
  calculateDraftGrade,
  isGoldJacket as qualifiesForGoldJacket,
} from '../lib/scoreEngine';
import PlayerCard from './PlayerCard';

interface ResultCardProps {
  roster: Player[];
  coach: Coach;
  projectedWins: number;
  unitScores: {
    offense: number;
    defense: number;
    xfactor: number;
  };
  strengthRating: number;
  draftGrade: string;
  scoutingReport: string;
  isGoldJacket: boolean;
  bustPlayer: Player | null;
}

type DisplayPlayer = Player & {
  team?: string;
  decade?: string;
  peakYear?: string | number;
};

type DisplayCoach = Coach & {
  bonus: Coach['bonus'] & {
    label?: string;
  };
};

interface UnitBarProps {
  label: string;
  score: number;
  isMounted: boolean;
}

const WIN_TICKS = [
  { value: 5, position: 'left-[29.4118%]' },
  { value: 10, position: 'left-[58.8235%]' },
  { value: 15, position: 'left-[88.2353%]' },
  { value: 17, position: 'left-full' },
];

function getGradeClasses(grade: string): string {
  if (grade === 'A+' || grade === 'A') {
    return 'bg-gold text-navy';
  }

  if (grade === 'B+' || grade === 'B') {
    return 'bg-[#9ca3af] text-navy';
  }

  return 'bg-gray-700 text-gray-200';
}

function getCoachBonus(coach: DisplayCoach): string {
  if (coach.bonus.label) return coach.bonus.label;

  const unit = coach.bonus.unit.charAt(0).toUpperCase() + coach.bonus.unit.slice(1);
  const percentage = Math.round((coach.bonus.multiplier - 1) * 100);
  return `${unit} +${percentage}%`;
}

function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function ignoreSelection() {}

function UnitBar({ label, score, isMounted }: UnitBarProps) {
  const normalizedScore = clampPercentage(score);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <span className="text-sm font-bold text-white">
          {Math.round(score)}/100
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-gold"
          style={{
            width: isMounted ? `${normalizedScore}%` : '0%',
            transition: 'width 800ms ease-out',
          }}
        />
      </div>
    </div>
  );
}

export default function ResultCard({
  roster,
  coach,
  projectedWins,
  unitScores,
  strengthRating,
  draftGrade,
  scoutingReport,
  isGoldJacket,
  bustPlayer,
}: ResultCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const resolvedDraftGrade = draftGrade || calculateDraftGrade(projectedWins);
  const achievedGoldJacket =
    isGoldJacket || qualifiesForGoldJacket(projectedWins);
  const winPercentage = clampPercentage((projectedWins / 17) * 100);
  const displayCoach = coach as DisplayCoach;

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="w-full rounded-2xl border border-card-border bg-card p-5 sm:p-7">
      <header className="text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <p className="font-[var(--font-bebas)] text-[56px] leading-none tracking-wide text-gold">
            {projectedWins} / 17
          </p>
          <span
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${getGradeClasses(resolvedDraftGrade)}`}
          >
            {resolvedDraftGrade}
          </span>
        </div>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          Projected Wins
        </p>

        {achievedGoldJacket && (
          <div className="mx-auto mt-5 w-fit animate-pulse rounded-full border border-gold bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold shadow-[0_0_18px_rgba(201,168,76,0.55)]">
            Gold Jacket Achieved
          </div>
        )}
      </header>

      <div className="mt-8">
        <div className="relative h-4 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gold"
            style={{
              width: isMounted ? `${winPercentage}%` : '0%',
              transition: 'width 1000ms ease-out',
            }}
          />
        </div>
        <div className="relative mt-2 h-6 text-[10px] text-gray-500">
          {WIN_TICKS.map((tick) => (
            <div
              key={tick.value}
              className={`absolute -translate-x-1/2 text-center ${tick.position}`}
            >
              <span className="mx-auto block h-2 w-px bg-gray-600" />
              <span>{tick.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <UnitBar
          label="Offense"
          score={unitScores.offense}
          isMounted={isMounted}
        />
        <UnitBar
          label="Defense"
          score={unitScores.defense}
          isMounted={isMounted}
        />
        <UnitBar
          label="X Factor"
          score={unitScores.xfactor}
          isMounted={isMounted}
        />
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 rounded-xl border border-card-border bg-navy/60 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gold">
            Coach
          </p>
          <p className="mt-1 font-[var(--font-bebas)] text-xl tracking-wide text-white">
            {coach.name}
          </p>
          <p className="text-sm text-gray-400">{getCoachBonus(displayCoach)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Strength
          </p>
          <p className="text-xl font-bold text-gold">{strengthRating}/100</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-[var(--font-bebas)] text-2xl tracking-wide text-white">
          Final Roster
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roster.map((player) => {
            const displayPlayer = player as DisplayPlayer;
            const isBust = bustPlayer?.id === player.id;

            return (
              <div
                key={player.id}
                className={`rounded-xl ${
                  isBust ? 'border-l-4 border-red-500 pl-2' : ''
                }`}
              >
                <PlayerCard
                  player={player}
                  mode="classic"
                  isSelected={false}
                  onSelect={ignoreSelection}
                />
                <div className="mt-2 px-1 text-xs text-gray-500">
                  <span>{displayPlayer.team ?? 'NFL Legend'}</span>
                  <span> | </span>
                  <span>
                    Peak {displayPlayer.peakYear ?? displayPlayer.decade ?? player.era}
                  </span>
                  {isBust && (
                    <p className="mt-1 text-red-400">
                      * (stat penalty applied)
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-[#0d1525] p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-gold">
          Scout Report
        </p>
        {scoutingReport ? (
          <p className="mt-3 italic leading-relaxed text-gray-300">
            {scoutingReport}
          </p>
        ) : (
          <div className="mt-4 animate-pulse space-y-3" aria-label="Loading scout report">
            <div className="h-3 w-full rounded bg-gray-700" />
            <div className="h-3 w-5/6 rounded bg-gray-700" />
            <div className="h-3 w-2/3 rounded bg-gray-700" />
          </div>
        )}
      </div>

      {bustPlayer && (
        <div className="mt-6 rounded-xl border border-yellow-500/60 bg-yellow-500/10 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">
            Bust Revealed
          </p>
          <p className="mt-2 text-sm text-yellow-100">
            <span className="font-bold">{bustPlayer.name}</span> stats were
            secretly reduced 20%.
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-lg bg-gold px-4 py-3 text-sm font-bold text-navy transition-colors hover:bg-gold-light"
        >
          Share Roster
        </button>
        <button
          type="button"
          className="rounded-lg border border-gold px-4 py-3 text-sm font-bold text-gold transition-colors hover:bg-gold/10"
        >
          Build Another
        </button>
      </div>
    </section>
  );
}
