'use client';

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  initGame,
  generateRoundOptions,
  draftPlayer,
  useTeamSkip as applyTeamSkip,
  useEraSkip as applyEraSkip,
  calculateSpeedBonus,
  type GameState,
} from '../../lib/gameEngine';
import {
  calculateUnitScore,
  applyCoachBonus,
  applyChemistryBonus,
  projectWins,
  calculateDraftGrade,
  type Coach,
  type Player,
  type UnitScores,
} from '../../lib/scoreEngine';
import { getDailySeed } from '../../lib/dailyChallenge';
import { players as playerData } from '../../data/players';
import { coaches as coachData } from '../../data/coaches';
import { getChemistry, getRivalry } from '../../data/rivalries';
import SlotMachine from '../../components/SlotMachine';
import PlayerCard from '../../components/PlayerCard';
import CoachCard from '../../components/CoachCard';
import RosterSidebar from '../../components/RosterSidebar';

type DraftPhase =
  | 'coach-select'
  | 'spinning'
  | 'picking'
  | 'selecting'
  | 'round-transition'
  | 'complete';

interface PairAlert {
  label: string;
  icon: string;
}

type SourcePlayer = (typeof playerData)[number];

interface RuntimePlayer extends Player {
  team: string;
  decade: string;
  stats: SourcePlayer['stats'];
}

interface RuntimeCoach extends Coach {
  era: string;
  record: string;
  superBowls: number;
  specialty: string;
  bio: string;
  bonus: Coach['bonus'] & {
    label: string;
  };
  poolBias: string[];
}

interface Projection {
  wins: number;
  unitScores: UnitScores;
}

const ROUND_LABELS = [
  { position: 'QB', era: '1980s' },
  { position: 'RB', era: '1990s' },
  { position: 'WR/TE', era: '1990s' },
  { position: 'DL/EDGE', era: '2000s' },
  { position: 'DB', era: '2010s' },
  { position: 'LB', era: '2000s' },
  { position: 'WR/TE', era: '2010s' },
  { position: 'X FACTOR', era: 'ANY ERA' },
];

const PLACEHOLDER_POSITIONS: Player['position'][] = [
  'QB',
  'RB',
  'WR',
  'DL',
  'DB',
  'LB',
  'WR',
  'QB',
];

const POSITION_TAGS = new Set([
  'QB',
  'RB',
  'WR',
  'TE',
  'DL',
  'Edge',
  'LB',
  'DB',
  'CB',
  'S',
]);

function normalizePosition(position: string): Player['position'] {
  if (position === 'DE') return 'Edge';
  if (position === 'DT') return 'DL';
  return position as Player['position'];
}

const players: RuntimePlayer[] = playerData.map((player) => ({
  ...player,
  position: normalizePosition(player.position),
  era: player.decade,
  positionScore: player.positionScore,
  eraMultiplier: player.eraMultiplier,
}));

function normalizeCoachUnit(unit: string): Coach['bonus']['unit'] {
  if (unit === 'defense' || unit === 'xfactor') return unit;
  return 'offense';
}

const coaches: RuntimeCoach[] = coachData.map((coach) => ({
  ...coach,
  bonus: {
    ...coach.bonus,
    unit: normalizeCoachUnit(coach.bonus.unit),
  },
}));

function playerWithSlot(player: Player, rosterIndex: number): Player {
  return {
    ...player,
    slot: rosterIndex === 7 ? 'xfactor' : undefined,
  };
}

function createPlaceholder(rosterIndex: number): Player {
  return {
    id: `average-player-${rosterIndex}`,
    name: 'Average Starter',
    position: PLACEHOLDER_POSITIONS[rosterIndex],
    era: '2000s',
    positionScore: 70,
    eraMultiplier: 1,
    slot: rosterIndex === 7 ? 'xfactor' : undefined,
  };
}

function calculateProjection(
  roster: (Player | null)[],
  coach: Coach | null
): Projection {
  const filledRoster = Array.from({ length: 8 }, (_, index) => {
    const player = roster[index];
    return player
      ? playerWithSlot(player, index)
      : createPlaceholder(index);
  });
  const chemistryRoster = coach
    ? applyChemistryBonus(filledRoster, coach)
    : filledRoster;
  const weightedScores: UnitScores = {
    offense: calculateUnitScore(chemistryRoster, 'offense'),
    defense: calculateUnitScore(chemistryRoster, 'defense'),
    xfactor: calculateUnitScore(chemistryRoster, 'xfactor'),
  };
  const baseScores: UnitScores = {
    offense: weightedScores.offense / 0.5,
    defense: weightedScores.defense / 0.35,
    xfactor: weightedScores.xfactor / 0.15,
  };
  const unitScores = coach
    ? applyCoachBonus(baseScores, coach)
    : baseScores;

  return {
    wins: projectWins(unitScores, 1),
    unitScores,
  };
}

function calculateCoachConfidence(
  roster: (Player | null)[],
  coach: RuntimeCoach | null
): number {
  const draftedPlayers = roster.filter((player): player is Player => Boolean(player));

  if (!coach || draftedPlayers.length === 0) return 0;

  const biasedPositions = coach.poolBias.filter((tag) => POSITION_TAGS.has(tag));
  const matches = draftedPlayers.filter((player) =>
    biasedPositions.includes(player.position)
  ).length;

  return Math.round((matches / draftedPlayers.length) * 100);
}

function getDraftComment(
  player: Player,
  chemistry: PairAlert | null,
  rivalry: PairAlert | null
): string {
  let comment: string;

  if (player.positionScore >= 95) {
    comment = 'Elite pick. Your opponents are already scared.';
  } else if (player.positionScore >= 85) {
    comment = `Solid choice. ${player.name} brings real firepower.`;
  } else if (player.positionScore >= 75) {
    comment = `Decent pick. ${player.name} gets the job done.`;
  } else if (player.positionScore >= 65) {
    comment = "Questionable... but let's see how it plays out.";
  } else {
    comment = 'Bold strategy. Very bold.';
  }

  if (chemistry) {
    comment += ` + ${chemistry.icon} ${chemistry.label} detected!`;
  }

  if (rivalry) {
    comment += ` ${rivalry.icon} ${rivalry.label} on the same team?`;
  }

  return comment;
}

function getRosterPlayerIds(roster: (Player | null)[]): string[] {
  return roster
    .filter((player): player is Player => Boolean(player))
    .map((player) => player.id);
}

function decorateRoster(roster: (Player | null)[]): (Player | null)[] {
  const playerIds = getRosterPlayerIds(roster);
  const chemistry = getChemistry(playerIds);
  const rivalry = getRivalry(playerIds);
  const chemistryIds = new Set(chemistry?.players ?? []);
  const rivalryIds = new Set(rivalry?.players ?? []);

  return roster.map((player) => {
    if (!player) return null;

    const badges = [
      chemistryIds.has(player.id) ? chemistry?.pair.icon : '',
      rivalryIds.has(player.id) ? rivalry?.pair.icon : '',
    ]
      .filter(Boolean)
      .join(' ');

    return badges ? { ...player, name: `${player.name} ${badges}` } : player;
  });
}

function DraftExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [phase, setPhase] = useState<DraftPhase>('coach-select');
  const [selectedCoach, setSelectedCoach] = useState<RuntimeCoach | null>(null);
  const [currentOptions, setCurrentOptions] = useState<Player[]>([]);
  const [liveWins, setLiveWins] = useState(0);
  const [coachConfidence, setCoachConfidence] = useState(0);
  const [lastPickComment, setLastPickComment] = useState('');
  const [chemistryAlert, setChemistryAlert] = useState<PairAlert | null>(null);
  const [rivalryAlert, setRivalryAlert] = useState<PairAlert | null>(null);
  const [mobileRosterOpen, setMobileRosterOpen] = useState(false);
  const [isFirstRound, setIsFirstRound] = useState(true);
  const [selectingPlayerId, setSelectingPlayerId] = useState<string | null>(
    null
  );
  const [completedRound, setCompletedRound] = useState<number | null>(null);
  const selectionTimerRef = useRef<number | null>(null);
  const roundTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (selectionTimerRef.current) {
        window.clearTimeout(selectionTimerRef.current);
      }
      if (roundTimerRef.current) {
        window.clearTimeout(roundTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const mode = searchParams.get('mode') === 'iq' ? 'iq' : 'classic';
    const seed =
      searchParams.get('daily') === 'true' ? getDailySeed() : undefined;
    const initialGame = initGame(mode, seed);
    const previewOptions = generateRoundOptions(
      1,
      null,
      [],
      initialGame.seed,
      players
    );

    initialGame.roundOptions[0] = previewOptions;
    setGameState(initialGame);
    setCurrentOptions(previewOptions);
    setPhase('coach-select');
    setIsFirstRound(true);
    setSelectingPlayerId(null);
    setCompletedRound(null);
  }, [searchParams]);

  useEffect(() => {
    if (!chemistryAlert) return;
    const timeoutId = window.setTimeout(() => setChemistryAlert(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [chemistryAlert]);

  useEffect(() => {
    if (!rivalryAlert) return;
    const timeoutId = window.setTimeout(() => setRivalryAlert(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [rivalryAlert]);

  const confirmCoach = useCallback(() => {
    if (!gameState || !selectedCoach) return;

    const draftedIds = getRosterPlayerIds(gameState.roster);
    const options = generateRoundOptions(
      1,
      selectedCoach,
      draftedIds,
      gameState.seed,
      players
    );
    const nextState = {
      ...gameState,
      coach: selectedCoach,
      roundOptions: [options],
      roundStartTimes: [Date.now()],
    };

    setGameState(nextState);
    setCurrentOptions(options);
    setLiveWins(calculateProjection(nextState.roster, selectedCoach).wins);
    setPhase('spinning');
    setIsFirstRound(true);
  }, [gameState, selectedCoach]);

  const handleSpinComplete = useCallback(() => {
    setPhase('picking');
  }, []);

  const handlePlayerSelect = useCallback(
    (playerId: string) => {
      if (!gameState || !selectedCoach || phase !== 'picking') return;

      const drafted = players.find((player) => player.id === playerId);
      if (!drafted) return;

      setSelectingPlayerId(playerId);
      setPhase('selecting');

      selectionTimerRef.current = window.setTimeout(() => {
        const draftedRound = gameState.currentRound;
        const nextState = draftPlayer(gameState, playerId, players);
        const playerIds = getRosterPlayerIds(nextState.roster);
        const chemistryMatch = getChemistry(playerIds);
        const rivalryMatch = getRivalry(playerIds);
        const nextChemistry = chemistryMatch
          ? {
              label: chemistryMatch.pair.label,
              icon: chemistryMatch.pair.icon,
            }
          : null;
        const nextRivalry = rivalryMatch
          ? {
              label: rivalryMatch.pair.label,
              icon: rivalryMatch.pair.icon,
            }
          : null;
        const projection = calculateProjection(nextState.roster, selectedCoach);
        const confidence = calculateCoachConfidence(
          nextState.roster,
          selectedCoach
        );
        const commentary = getDraftComment(
          drafted,
          nextChemistry,
          nextRivalry
        );

        setSelectingPlayerId(null);
        setChemistryAlert(nextChemistry);
        setRivalryAlert(nextRivalry);
        setLastPickComment(commentary);
        setLiveWins(projection.wins);
        setCoachConfidence(confidence);

        if (draftedRound === 8) {
          const completedState = {
            ...nextState,
            coach: selectedCoach,
            isComplete: true,
          };
          const speedBonus = calculateSpeedBonus(
            completedState.roundStartTimes
          );
          const finalWins = Math.min(17, projection.wins + speedBonus);
          const result = {
            gameState: completedState,
            projectedWins: finalWins,
            unitScores: projection.unitScores,
            strengthRating: Math.round(
              projection.unitScores.offense * 0.5 +
                projection.unitScores.defense * 0.35 +
                projection.unitScores.xfactor * 0.15
            ),
            draftGrade: calculateDraftGrade(finalWins),
            speedBonus,
            chemistry: chemistryMatch,
            rivalry: rivalryMatch,
          };

          setGameState(completedState);
          setPhase('complete');
          window.sessionStorage.setItem(
            'goldJacketGameState',
            JSON.stringify(completedState)
          );
          window.sessionStorage.setItem(
            'goldJacketResult',
            JSON.stringify(result)
          );
          router.push('/results');
          return;
        }

        const nextOptions = generateRoundOptions(
          nextState.currentRound,
          selectedCoach,
          playerIds,
          nextState.seed,
          players
        );
        const roundOptions = [...nextState.roundOptions];
        roundOptions[nextState.currentRound - 1] = nextOptions;

        setGameState({
          ...nextState,
          coach: selectedCoach,
          roundOptions,
        });
        setCompletedRound(draftedRound);
        setPhase('round-transition');

        roundTimerRef.current = window.setTimeout(() => {
          setCompletedRound(null);
          setCurrentOptions(nextOptions);
          setIsFirstRound(false);
          setPhase('spinning');
        }, 800);
      }, 350);
    },
    [gameState, phase, router, selectedCoach]
  );

  const handleTeamSkip = useCallback(() => {
    if (!gameState || gameState.teamSkipsRemaining === 0) return;
    const nextState = applyTeamSkip(gameState, players);
    const options =
      nextState.roundOptions[nextState.currentRound - 1] ?? currentOptions;

    setGameState(nextState);
    setCurrentOptions(options);
  }, [currentOptions, gameState]);

  const handleEraSkip = useCallback(() => {
    if (!gameState || gameState.eraSkipsRemaining === 0) return;
    const nextState = applyEraSkip(gameState, players);
    const options =
      nextState.roundOptions[nextState.currentRound - 1] ?? currentOptions;

    setGameState(nextState);
    setCurrentOptions(options);
  }, [currentOptions, gameState]);

  if (!gameState) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy text-gold">
        <p className="animate-pulse font-[var(--font-bebas)] text-2xl">
          Loading Draft...
        </p>
      </main>
    );
  }

  if (phase === 'coach-select') {
    return (
      <main className="min-h-screen bg-navy px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="text-center">
            <h1 className="font-[var(--font-bebas)] text-4xl tracking-wide text-white">
              Choose Your Coach
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Round 1 is live — draft accordingly
            </p>
          </header>

          <section className="mt-8 rounded-2xl border border-card-border bg-card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gold">
              Round 1 Preview — QB · 1980s
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {currentOptions.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  mode="classic"
                  isSelected={false}
                  onSelect={() => undefined}
                />
              ))}
            </div>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {coaches.map((coach) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                isSelected={selectedCoach?.id === coach.id}
                onSelect={() => setSelectedCoach(coach)}
                showBias
              />
            ))}
          </section>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              disabled={!selectedCoach}
              onClick={confirmCoach}
              className="rounded-lg bg-gold px-8 py-3 text-sm font-bold text-navy transition-all hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              CONFIRM COACH
            </button>
          </div>
        </div>
      </main>
    );
  }

  const displayRound = Math.min(gameState.currentRound, 8);
  const roundLabel = ROUND_LABELS[displayRound - 1];
  const confidenceColor =
    coachConfidence > 70
      ? '#4ade80'
      : coachConfidence >= 40
        ? '#fbbf24'
        : '#f87171';
  const decoratedRoster = decorateRoster(gameState.roster);
  const isXFactorRound = displayRound === 8;

  return (
    <main className="min-h-screen bg-navy text-white">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes draftToRoster {
          0% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
          }
          45% {
            opacity: 1;
            transform: scale(0.92) translate(0, 8px);
          }
          100% {
            opacity: 0;
            transform: scale(0.72) translate(42vw, -12px);
          }
        }
        @keyframes roundComplete {
          0%, 18% {
            opacity: 0;
            transform: scale(0.94);
          }
          30%, 72% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.04);
          }
        }
        @keyframes alertSlideIn {
          from {
            opacity: 0;
            transform: translateY(-18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 767px) {
          @keyframes draftToRoster {
            0% {
              opacity: 1;
              transform: scale(1) translate(0, 0);
            }
            45% {
              opacity: 1;
              transform: scale(0.92) translate(0, 8px);
            }
            100% {
              opacity: 0;
              transform: scale(0.72) translate(28vw, 35vh);
            }
          }
        }
      `}</style>
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-8 gap-1.5" aria-label="Draft progress">
            {Array.from({ length: 8 }, (_, index) => {
              const round = index + 1;
              const isComplete = round < displayRound;
              const isCurrent = round === displayRound;

              return (
                <span
                  key={round}
                  className={`h-2 rounded-full ${
                    isComplete
                      ? 'bg-gold'
                      : isCurrent
                        ? 'animate-pulse bg-gold-light'
                        : 'bg-card-border'
                  }`}
                />
              );
            })}
          </div>

          <header className="mt-6 flex min-w-0 flex-col gap-4 border-b border-card-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="font-[var(--font-bebas)] text-2xl tracking-wide text-gold">
                Round {displayRound} of 8
              </p>
              <h1
                className={`mt-1 break-words font-[var(--font-bebas)] text-[clamp(1.65rem,8vw,1.875rem)] tracking-wide ${
                  isXFactorRound
                    ? 'animate-pulse bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent'
                    : 'text-white'
                }`}
              >
                {isXFactorRound
                  ? 'X FACTOR — ANY LEGEND, ANY ERA'
                  : `${roundLabel.position} — ${roundLabel.era}`}
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Team Skip: {gameState.teamSkipsRemaining} · Era Skip:{' '}
                {gameState.eraSkipsRemaining}
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
              <button
                type="button"
                disabled={gameState.teamSkipsRemaining === 0 || phase !== 'picking'}
                onClick={handleTeamSkip}
                className="min-w-0 rounded-lg border border-card-border px-2 py-2 text-[11px] font-bold text-gray-300 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-35 sm:px-3 sm:text-xs"
              >
                TEAM SKIP ({gameState.teamSkipsRemaining})
              </button>
              <button
                type="button"
                disabled={gameState.eraSkipsRemaining === 0 || phase !== 'picking'}
                onClick={handleEraSkip}
                className="min-w-0 rounded-lg border border-card-border px-2 py-2 text-[11px] font-bold text-gray-300 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-35 sm:px-3 sm:text-xs"
              >
                ERA SKIP ({gameState.eraSkipsRemaining})
              </button>
            </div>
          </header>

          <section className="mt-5 grid gap-5 rounded-xl border border-card-border bg-card p-4 sm:grid-cols-2">
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Projected Wins
                  </p>
                  <p className="font-[var(--font-bebas)] text-4xl leading-none text-gold">
                    {liveWins.toFixed(1)}
                  </p>
                </div>
                <span className="text-xs text-gray-500">of 17</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-500"
                  style={{ width: `${Math.min(100, (liveWins / 17) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  System Fit
                </p>
                <span className="text-sm font-bold text-white">
                  {coachConfidence}%
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${coachConfidence}%`,
                    backgroundColor: confidenceColor,
                  }}
                />
              </div>
            </div>
          </section>

          <div className="mt-6 space-y-3">
            {chemistryAlert && (
              <div className="animate-[alertSlideIn_300ms_ease-out] rounded-lg border border-green-400/50 bg-green-400/10 px-4 py-3 text-sm font-bold text-green-300">
                {chemistryAlert.icon} {chemistryAlert.label} — Chemistry Bonus
                Active!
              </div>
            )}
            {rivalryAlert && (
              <div className="animate-pulse rounded-lg border border-red-400/50 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300">
                {rivalryAlert.icon} {rivalryAlert.label} — Rivalry on your
                roster!
              </div>
            )}
          </div>

          <section className="mt-6">
            {phase === 'spinning' ? (
              <SlotMachine
                options={currentOptions}
                onComplete={handleSpinComplete}
                isSpinning
                isFirstRound={isFirstRound}
                mode={gameState.mode}
              />
            ) : (
              <div>
                <h2 className="mb-4 font-[var(--font-bebas)] text-2xl tracking-wide text-gold">
                  Make Your Pick
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {currentOptions.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      mode={gameState.mode}
                      isSelected={selectingPlayerId === player.id}
                      isDrafting={selectingPlayerId === player.id}
                      onSelect={handlePlayerSelect}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {lastPickComment && (
            <div
              key={lastPickComment}
              className="mt-6 animate-[fadeIn_300ms_ease-out] rounded-xl bg-[#0d1525] p-4 text-sm italic text-gray-300"
            >
              {lastPickComment}
            </div>
          )}
        </section>

        <div className="sticky top-0 hidden h-screen md:block">
          <RosterSidebar
            roster={decoratedRoster}
            currentRound={displayRound}
            coach={selectedCoach}
          />
        </div>
      </div>

      {completedRound !== null && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-navy/80 px-6 backdrop-blur-sm">
          <p className="animate-[roundComplete_800ms_ease-in-out_forwards] text-center font-[var(--font-bebas)] text-[clamp(2.25rem,10vw,4rem)] tracking-wider text-gold">
            Round {completedRound} Complete
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setMobileRosterOpen(true)}
        className="fixed bottom-5 right-5 z-30 rounded-full bg-gold px-5 py-3 text-xs font-bold text-navy shadow-lg md:hidden"
      >
        VIEW ROSTER
      </button>

      {mobileRosterOpen && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/70 md:hidden">
          <button
            type="button"
            aria-label="Close roster"
            onClick={() => setMobileRosterOpen(false)}
            className="absolute inset-0"
          />
          <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border-t border-gold bg-navy p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-[var(--font-bebas)] text-2xl text-white">
                Your Roster
              </h2>
              <button
                type="button"
                onClick={() => setMobileRosterOpen(false)}
                className="rounded-full border border-card-border px-3 py-1 text-sm text-gray-400"
              >
                CLOSE
              </button>
            </div>
            <div className="[&>aside]:!block [&>aside]:!w-full">
              <RosterSidebar
                roster={decoratedRoster}
                currentRound={displayRound}
                coach={selectedCoach}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function DraftPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-navy text-gold">
          <p className="animate-pulse font-[var(--font-bebas)] text-2xl">
            Loading Draft...
          </p>
        </main>
      }
    >
      <DraftExperience />
    </Suspense>
  );
}
