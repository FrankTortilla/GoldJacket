import type { Coach, Player } from '../lib/scoreEngine';
import { ROUND_CONFIG } from '../lib/gameEngine';

interface RosterSidebarProps {
  roster: (Player | null)[];
  currentRound: number;
  coach: Coach | null;
}

type DisplayPlayer = Player & {
  team?: string;
  decade?: string;
};

type DisplayCoach = Coach & {
  bonus: Coach['bonus'] & {
    label?: string;
  };
};

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

function getPositionLabel(round: number): string {
  if (round === 8) return 'X Factor';

  const positions = ROUND_CONFIG[round - 1]?.position ?? [];

  if (round === 4) return 'DL/Edge';
  if (round === 5) return 'DB';
  return positions.join('/');
}

function getCoachBonus(coach: DisplayCoach): string {
  if (coach.bonus.label) return coach.bonus.label;

  const unit = coach.bonus.unit.charAt(0).toUpperCase() + coach.bonus.unit.slice(1);
  const percentage = Math.round((coach.bonus.multiplier - 1) * 100);
  return `${unit} +${percentage}%`;
}

export default function RosterSidebar({
  roster,
  currentRound,
  coach,
}: RosterSidebarProps) {
  const displayCoach = coach as DisplayCoach | null;

  return (
    <aside className="hidden w-full bg-navy p-4 md:block md:w-[240px] md:shrink-0">
      <div>
        {displayCoach ? (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-gold">
              Coach
            </p>
            <h2 className="mt-1 font-[var(--font-bebas)] text-xl tracking-wide text-white">
              {displayCoach.name}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {getCoachBonus(displayCoach)}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-600">No Coach Selected</p>
        )}
      </div>

      <div className="my-4 h-px w-full bg-gold" />

      <ol className="space-y-2">
        {ROUND_CONFIG.map((roundConfig, index) => {
          const player = roster[index] ?? null;
          const displayPlayer = player as DisplayPlayer | null;
          const round = roundConfig.round;
          const isCurrentRound = round === currentRound;
          const isFutureRound = !player && round > currentRound;
          const positionLabel = getPositionLabel(round);

          return (
            <li
              key={round}
              className={`rounded-lg border p-3 transition-colors ${
                isCurrentRound
                  ? 'animate-pulse border-gold'
                  : isFutureRound
                    ? 'border-dashed border-card-border'
                    : 'border-card-border'
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs text-gray-600">Slot {round}</span>
                <span
                  className={`text-xs font-bold ${
                    isCurrentRound ? 'text-gold' : 'text-gray-600'
                  }`}
                >
                  {positionLabel}
                </span>
              </div>

              {displayPlayer ? (
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white ${POSITION_COLORS[displayPlayer.position]}`}
                  >
                    {displayPlayer.position}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {displayPlayer.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {displayPlayer.team ?? 'NFL Legend'} ·{' '}
                      {displayPlayer.decade ?? displayPlayer.era}
                    </p>
                  </div>
                </div>
              ) : isCurrentRound ? (
                <p className="text-xs text-gold">Drafting...</p>
              ) : (
                <p className="text-xs text-gray-600">{positionLabel}</p>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
