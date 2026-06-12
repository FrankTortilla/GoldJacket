'use client';

import { useEffect, useRef } from 'react';
import type { Player } from '../lib/scoreEngine';
import PlayerCard from './PlayerCard';

interface SlotMachineProps {
  options: Player[];
  onComplete: () => void;
  isSpinning: boolean;
  isFirstRound: boolean;
  mode: 'classic' | 'iq';
}

interface RoundDetails {
  round: number;
  positions: string;
  era: string;
}

const ROUND_DETAILS: RoundDetails[] = [
  { round: 1, positions: 'QB', era: '1980s' },
  { round: 2, positions: 'RB', era: '1990s' },
  { round: 3, positions: 'WR/TE', era: '1990s' },
  { round: 4, positions: 'DL/EDGE', era: '2000s' },
  { round: 5, positions: 'DB/CB/S', era: '2010s' },
  { round: 6, positions: 'LB', era: '2000s' },
  { round: 7, positions: 'WR/TE', era: '2010s' },
  { round: 8, positions: 'X FACTOR', era: 'ANY ERA' },
];

function getRoundDetails(options: Player[], isFirstRound: boolean): RoundDetails {
  if (isFirstRound) return ROUND_DETAILS[0];

  const firstOption = options[0];

  if (!firstOption) return ROUND_DETAILS[0];

  if (firstOption.slot === 'xfactor') return ROUND_DETAILS[7];

  const slotRound = String(firstOption.slot ?? '').match(/round\D*(\d+)/i);
  if (slotRound) {
    const matchedRound = ROUND_DETAILS.find(
      ({ round }) => round === Number(slotRound[1])
    );
    if (matchedRound) return matchedRound;
  }

  const matchingRound = ROUND_DETAILS.slice(0, 7).find(({ positions, era }) => {
    const validPositions = positions.split('/');
    return validPositions.includes(firstOption.position) && firstOption.era === era;
  });

  return matchingRound ?? {
    round: 8,
    positions: firstOption.position,
    era: firstOption.era || 'ANY ERA',
  };
}

function ignoreSelection() {}

export default function SlotMachine({
  options,
  onComplete,
  isSpinning,
  isFirstRound,
  mode,
}: SlotMachineProps) {
  const onCompleteRef = useRef(onComplete);
  const duration = isFirstRound ? 1500 : 500;
  const roundDetails = getRoundDetails(options, isFirstRound);
  const animationClass = isFirstRound
    ? 'animate-[slotSpin_1.5s_ease-in-out]'
    : 'animate-[slotSpin_0.5s_ease-in-out]';

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isSpinning) return;

    const timeoutId = window.setTimeout(() => onCompleteRef.current(), duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration, isSpinning]);

  return (
    <section className="w-full">
      <style>{`
        @keyframes slotSpin {
          0% {
            transform: translateY(0);
            filter: blur(4px);
          }
          50% {
            transform: translateY(-20px);
            filter: blur(8px);
          }
          100% {
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>

      <h2 className="mb-4 font-[var(--font-bebas)] text-xl tracking-wide text-gold sm:text-2xl">
        Round {roundDetails.round} — {roundDetails.positions} — {roundDetails.era}
      </h2>

      {isSpinning ? (
        <div
          className="grid grid-cols-3 gap-2 overflow-hidden sm:gap-4"
          aria-label="Draft options spinning"
          aria-live="polite"
        >
          {options.map((player, index) => (
            <div
              key={`${player.id}-${index}`}
              className="min-h-[120px] overflow-hidden rounded-xl border border-card-border bg-card p-3 sm:p-4"
            >
              <div
                className={`flex min-h-[88px] flex-col items-center justify-center gap-3 text-center ${animationClass}`}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-gold">
                  {mode === 'classic' ? player.position : '???'}
                </span>
                <span className="font-[var(--font-bebas)] text-lg tracking-wide text-white sm:text-xl">
                  {mode === 'classic' ? player.name : '???'}
                </span>
                <span className="text-sm text-gray-600">...</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row">
          {options.map((player) => (
            <div key={player.id} className="w-full md:flex-1">
              <PlayerCard
                player={player}
                mode={mode}
                isSelected={false}
                onSelect={ignoreSelection}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
