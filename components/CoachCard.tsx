'use client';

import type { Coach } from '../lib/scoreEngine';

interface CoachCardProps {
  coach: Coach;
  isSelected: boolean;
  onSelect: (coachId: string) => void;
  showBias: boolean;
}

interface StructuredPoolBias {
  positions: string[];
  decades: string[];
}

type DisplayCoach = Omit<Coach, 'bonus' | 'poolBias'> & {
  era?: string;
  record?: string;
  superBowls?: number;
  specialty?: string;
  bonus: Coach['bonus'] & {
    label?: string;
  };
  poolBias?: string[] | StructuredPoolBias;
};

function formatBonus(coach: DisplayCoach): string {
  if (coach.bonus.label) return coach.bonus.label;

  const unit = coach.bonus.unit.charAt(0).toUpperCase() + coach.bonus.unit.slice(1);
  const percentage = Math.round((coach.bonus.multiplier - 1) * 100);
  return `${unit} +${percentage}%`;
}

function getPoolBias(poolBias: DisplayCoach['poolBias']): StructuredPoolBias {
  if (!poolBias) return { positions: [], decades: [] };

  if (!Array.isArray(poolBias)) {
    return {
      positions: poolBias.positions ?? [],
      decades: poolBias.decades ?? [],
    };
  }

  return {
    positions: poolBias.filter((bias) => !/^\d{4}s$/.test(bias)),
    decades: poolBias.filter((bias) => /^\d{4}s$/.test(bias)),
  };
}

export default function CoachCard({
  coach,
  isSelected,
  onSelect,
  showBias,
}: CoachCardProps) {
  const displayCoach = coach as DisplayCoach;
  const poolBias = getPoolBias(displayCoach.poolBias);
  const superBowls = displayCoach.superBowls ?? 0;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(coach.id)}
      className={`relative w-full rounded-xl border p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:border-gold-light focus-visible:scale-[1.02] focus-visible:border-gold-light focus-visible:outline-none ${
        isSelected
          ? 'border-gold bg-[#1a2235]'
          : 'border-card-border bg-card'
      }`}
      style={{
        boxShadow: isSelected ? '0 0 16px rgba(201,168,76,0.5)' : 'none',
      }}
    >
      {isSelected && (
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy"
        >
          ✓
        </span>
      )}

      <div className="pr-9">
        <h3 className="font-[var(--font-bebas)] text-2xl tracking-wide text-white">
          {coach.name}
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          {displayCoach.era ?? 'NFL Legend'}
          {displayCoach.record ? ` · ${displayCoach.record}` : ''}
        </p>

        <div
          className="mt-3 flex min-h-3 flex-wrap gap-1.5"
          aria-label={`${superBowls} Super Bowl${superBowls === 1 ? '' : 's'}`}
        >
          {Array.from({ length: superBowls }, (_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="h-3 w-3 rounded-full bg-gold shadow-sm shadow-gold/40"
            />
          ))}
        </div>

        <p className="mt-3 text-sm italic text-gold">
          {displayCoach.specialty ?? 'Legendary Leadership'}
        </p>

        <span className="mt-3 inline-flex rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">
          {formatBonus(displayCoach)}
        </span>
      </div>

      {showBias && (
        <div className="mt-5 border-t border-card-border pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Draft Bias
          </p>
          <div className="mt-2 space-y-1 text-sm text-gray-300">
            <p>
              <span className="text-gray-500">Positions: </span>
              {poolBias.positions.join(', ') || 'None'}
            </p>
            <p>
              <span className="text-gray-500">Decades: </span>
              {poolBias.decades.join(', ') || 'None'}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}
