'use client';

import { useEffect, useRef, useState } from 'react';
import type { Player } from '../lib/scoreEngine';
import PlayerCard from './PlayerCard';

const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  SF: { primary: '#AA0000', secondary: '#B3995D' },
  DAL: { primary: '#003594', secondary: '#869397' },
  NE: { primary: '#002244', secondary: '#C60C30' },
  GB: { primary: '#203731', secondary: '#FFB612' },
  PIT: { primary: '#101820', secondary: '#FFB612' },
  DEN: { primary: '#FB4F14', secondary: '#002244' },
  MIA: { primary: '#008E97', secondary: '#FC4C02' },
  MIN: { primary: '#4F2683', secondary: '#FFC62F' },
  CHI: { primary: '#0B162A', secondary: '#C83803' },
  NYG: { primary: '#0B2265', secondary: '#A71930' },
  BUF: { primary: '#00338D', secondary: '#C60C30' },
  SEA: { primary: '#002244', secondary: '#69BE28' },
  BAL: { primary: '#241773', secondary: '#000000' },
  KC: { primary: '#E31837', secondary: '#FFB81C' },
  LAR: { primary: '#003594', secondary: '#FFA300' },
  IND: { primary: '#002C5F', secondary: '#A2AAAD' },
  PHI: { primary: '#004C54', secondary: '#A5ACAF' },
  WAS: { primary: '#5A1414', secondary: '#FFB612' },
  TB: { primary: '#D50A0A', secondary: '#FF7900' },
  HOU: { primary: '#03202F', secondary: '#A71930' },
  DET: { primary: '#0076B6', secondary: '#B0B7BC' },
  ARI: { primary: '#97233F', secondary: '#000000' },
  CAR: { primary: '#0085CA', secondary: '#101820' },
  NO: { primary: '#101820', secondary: '#D3BC8D' },
  ATL: { primary: '#A71930', secondary: '#000000' },
  CLE: { primary: '#311D00', secondary: '#FF3C00' },
  JAX: { primary: '#006778', secondary: '#D7A22A' },
  TEN: { primary: '#0C2340', secondary: '#4B92DB' },
  LV: { primary: '#000000', secondary: '#A5ACAF' },
  CIN: { primary: '#FB4F14', secondary: '#000000' },
  NYJ: { primary: '#125740', secondary: '#000000' },
  LAC: { primary: '#0080C6', secondary: '#FFC20E' },
};

const TEAM_ABBREVIATIONS: Record<string, string> = {
  '49ers': 'SF',
  Cowboys: 'DAL',
  Patriots: 'NE',
  Packers: 'GB',
  Steelers: 'PIT',
  Broncos: 'DEN',
  Dolphins: 'MIA',
  Vikings: 'MIN',
  Bears: 'CHI',
  Giants: 'NYG',
  Bills: 'BUF',
  Seahawks: 'SEA',
  Ravens: 'BAL',
  Chiefs: 'KC',
  Rams: 'LAR',
  Colts: 'IND',
  Eagles: 'PHI',
  Redskins: 'WAS',
  Commanders: 'WAS',
  Buccaneers: 'TB',
  Texans: 'HOU',
  Lions: 'DET',
  Cardinals: 'ARI',
  Panthers: 'CAR',
  Saints: 'NO',
  Falcons: 'ATL',
  Browns: 'CLE',
  Jaguars: 'JAX',
  Titans: 'TEN',
  Raiders: 'LV',
  Bengals: 'CIN',
  Jets: 'NYJ',
  Chargers: 'LAC',
};

const TEAM_KEYS = Object.keys(TEAM_COLORS);

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

type DisplayPlayer = Player & {
  team?: string;
};

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

function createTeamSequence(): string[] {
  const sequenceLength = 6 + Math.floor(Math.random() * 3);

  return Array.from({ length: sequenceLength }, () => {
    const teamIndex = Math.floor(Math.random() * TEAM_KEYS.length);
    return TEAM_KEYS[teamIndex];
  });
}

function getPlayerTeam(player: Player): string | null {
  const team = (player as DisplayPlayer).team;

  if (!team) return null;
  if (TEAM_COLORS[team]) return team;
  return TEAM_ABBREVIATIONS[team] ?? null;
}

export default function SlotMachine({
  options,
  onComplete,
  isSpinning,
  isFirstRound,
  mode,
}: SlotMachineProps) {
  const onCompleteRef = useRef(onComplete);
  const hasSpunRef = useRef(false);
  const [spinningTeams, setSpinningTeams] = useState<string[]>([
    'SF',
    'DAL',
    'NE',
  ]);
  const [showLandingFlash, setShowLandingFlash] = useState(false);
  const [showPlayerCards, setShowPlayerCards] = useState(!isSpinning);
  const duration = isFirstRound ? 1500 : 500;
  const roundDetails = getRoundDetails(options, isFirstRound);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isSpinning) return;

    hasSpunRef.current = true;
    setShowLandingFlash(false);
    setShowPlayerCards(false);

    const sequences = Array.from({ length: 3 }, createTeamSequence);
    let flashIndex = 0;

    setSpinningTeams(sequences.map((sequence) => sequence[0]));

    const intervalId = window.setInterval(() => {
      flashIndex += 1;
      setSpinningTeams(
        sequences.map((sequence) => sequence[flashIndex % sequence.length])
      );
    }, 80);

    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
      onCompleteRef.current();
    }, duration);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [duration, isSpinning]);

  useEffect(() => {
    if (isSpinning || !hasSpunRef.current) return;

    setShowLandingFlash(true);

    const frameId = window.requestAnimationFrame(() => {
      setShowPlayerCards(true);
    });
    const timeoutId = window.setTimeout(() => {
      setShowLandingFlash(false);
    }, 500);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [isSpinning]);

  return (
    <section className="w-full">
      <h2 className="mb-4 font-[var(--font-bebas)] text-xl tracking-wide text-gold sm:text-2xl">
        Round {roundDetails.round} — {roundDetails.positions} — {roundDetails.era}
      </h2>

      {isSpinning ? (
        <div
          className="grid grid-cols-1 gap-4 overflow-hidden md:grid-cols-3"
          aria-label="Draft options spinning"
          aria-live="polite"
        >
          {spinningTeams.map((team, index) => (
            <div
              key={index}
              className="flex min-h-[160px] items-center justify-center overflow-hidden rounded-xl border border-card-border transition-colors duration-75"
              style={{ backgroundColor: TEAM_COLORS[team].primary }}
            >
              <span
                className="font-[var(--font-bebas)] text-4xl tracking-widest"
                style={{ color: TEAM_COLORS[team].secondary }}
              >
                {team}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row">
          {options.map((player) => {
            const team = getPlayerTeam(player);
            const landingColor = team ? TEAM_COLORS[team].primary : '#1f2937';

            return (
              <div
                key={player.id}
                className="w-full overflow-hidden rounded-xl border-l-4 md:flex-1"
                style={{
                  borderLeftColor: showLandingFlash ? landingColor : 'transparent',
                  backgroundColor: showLandingFlash ? landingColor : '#111827',
                  transition: 'background-color 500ms ease, border-color 500ms ease',
                }}
              >
                <div
                  className={`transition-opacity duration-300 ${
                    showPlayerCards ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <PlayerCard
                    player={player}
                    mode={mode}
                    isSelected={false}
                    onSelect={ignoreSelection}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
