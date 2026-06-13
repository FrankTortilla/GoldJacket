'use client';

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type MouseEvent,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toPng } from 'html-to-image';
import ShareCard from '../../components/ShareCard';
import { encodeResult } from '../../lib/shareUtils';
import { generateScoutingReport } from '../../lib/scoutingReport';
import {
  getResultByShareCode,
  saveResult,
  type GameResult,
} from '../../lib/db';
import { getDailySeed } from '../../lib/dailyChallenge';
import {
  calculateDraftGrade,
  isGoldJacket,
  projectWins,
  type Coach,
  type Player,
  type UnitScores,
} from '../../lib/scoreEngine';
import type { GameState } from '../../lib/gameEngine';
import { players as playerData } from '../../data/players';
import { coaches as coachData } from '../../data/coaches';

interface ResultCardProps {
  roster: Player[];
  coach: Coach;
  projectedWins: number;
  unitScores: UnitScores;
  strengthRating: number;
  draftGrade: string;
  scoutingReport: string;
  isLoadingReport: boolean;
  isGoldJacket: boolean;
  bustPlayer: Player | null;
  onShare?: () => void;
  onReset?: () => void;
}

interface ScoreResult {
  projectedWins?: number;
  unitScores?: UnitScores;
  strengthRating?: number;
  draftGrade?: string;
  scoutingReport?: string;
  isGoldJacket?: boolean;
}

interface CompletedGame {
  state: GameState;
  scoreResult: ScoreResult;
}

interface DisplayResult {
  state: GameState;
  roster: Player[];
  coach: Coach;
  projectedWins: number;
  unitScores: UnitScores;
  strengthRating: number;
  draftGrade: string;
  scoutingReport: string;
  achievedGoldJacket: boolean;
  bustPlayer: Player | null;
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

const ResultCard = dynamic(() => import('../../components/ResultCard'), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] animate-pulse rounded-2xl bg-card" />
  ),
}) as ComponentType<ResultCardProps>;

function normalizePosition(position: string): Player['position'] {
  if (position === 'DE') return 'Edge';
  if (position === 'DT') return 'DL';
  return position as Player['position'];
}

const players: RuntimePlayer[] = playerData.map((player) => ({
  ...player,
  position: normalizePosition(player.position),
  era: player.decade,
  positionScore: player.score,
  eraMultiplier: 1,
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
  chemistryPlayers: coach.chemistryPlayers.map((playerId) =>
    playerId.replaceAll('_', '-')
  ),
}));

function isUnitScores(value: unknown): value is UnitScores {
  if (!value || typeof value !== 'object') return false;
  const scores = value as Record<string, unknown>;

  return (
    typeof scores.offense === 'number' &&
    typeof scores.defense === 'number' &&
    typeof scores.xfactor === 'number'
  );
}

function getFallbackUnitScores(projectedWins: number): UnitScores {
  const rating = Math.min(100, Math.max(0, (projectedWins / 17) * 100));

  return {
    offense: rating,
    defense: rating,
    xfactor: rating,
  };
}

function normalizeCompletedGame(
  state: GameState,
  scoreResult: ScoreResult
): DisplayResult | null {
  const coach =
    coaches.find((candidate) => candidate.id === state.coach?.id) ??
    (state.coach as Coach | null);
  const roster = state.roster
    .map((player) => {
      if (!player) return null;
      return players.find((candidate) => candidate.id === player.id) ?? player;
    })
    .filter((player): player is Player => Boolean(player));

  if (!coach || roster.length === 0) return null;

  const providedWins =
    typeof scoreResult.projectedWins === 'number'
      ? scoreResult.projectedWins
      : undefined;
  const unitScores = isUnitScores(scoreResult.unitScores)
    ? scoreResult.unitScores
    : getFallbackUnitScores(providedWins ?? 10);
  const projectedWins = Math.round(
    providedWins ?? projectWins(unitScores, 1)
  );
  const strengthRating =
    typeof scoreResult.strengthRating === 'number'
      ? scoreResult.strengthRating
      : Math.round(
          unitScores.offense * 0.5 +
            unitScores.defense * 0.35 +
            unitScores.xfactor * 0.15
        );
  const bustPlayer =
    players.find((player) => player.id === state.bustPlayerId) ?? null;

  return {
    state: {
      ...state,
      coach,
      roster,
    },
    roster,
    coach,
    projectedWins,
    unitScores,
    strengthRating,
    draftGrade:
      scoreResult.draftGrade || calculateDraftGrade(projectedWins),
    scoutingReport: scoreResult.scoutingReport ?? '',
    achievedGoldJacket:
      scoreResult.isGoldJacket ?? isGoldJacket(projectedWins),
    bustPlayer,
  };
}

function normalizeDatabaseResult(gameResult: GameResult): DisplayResult | null {
  const coach = coaches.find(
    (candidate) => candidate.id === gameResult.coachId
  );
  const roster: Player[] = gameResult.roster.map((storedPlayer, index) => {
    const canonicalPlayer = players.find(
      (candidate) => candidate.name === storedPlayer.name
    );

    if (canonicalPlayer) return canonicalPlayer;

    return {
      id: `shared-${index}-${storedPlayer.name
        .toLowerCase()
        .replaceAll(' ', '-')}`,
      name: storedPlayer.name,
      position: normalizePosition(storedPlayer.position),
      era: storedPlayer.decade,
      positionScore: storedPlayer.positionScore,
      eraMultiplier: 1,
    };
  });

  if (!coach || roster.length === 0) return null;

  const state: GameState = {
    gameId: `shared-${gameResult.id ?? gameResult.shareCode}`,
    seed: gameResult.seed,
    mode: gameResult.gameMode,
    coach,
    currentRound: 9,
    roster,
    bustPlayerId: '',
    teamSkipsRemaining: 0,
    eraSkipsRemaining: 0,
    draftStartTime: 0,
    roundStartTimes: [],
    roundOptions: [],
    isComplete: true,
  };

  return normalizeCompletedGame(state, {
    projectedWins: gameResult.projectedWins,
    unitScores: gameResult.unitScores,
    strengthRating: gameResult.strengthRating,
    draftGrade: gameResult.draftGrade,
    isGoldJacket: gameResult.isGoldJacket,
  });
}

function ResultsExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<DisplayResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [scoutingReport, setScoutingReport] = useState('');
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [nickname, setNickname] = useState('');
  const [trashTalk, setTrashTalk] = useState('');
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'success' | 'error'
  >('idle');
  const [savedShareCode, setSavedShareCode] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadResult() {
      const code = searchParams.get('code');

      if (code) {
        const databaseResult = await getResultByShareCode(code);
        if (isCancelled) return;

        const sharedResult = databaseResult
          ? normalizeDatabaseResult(databaseResult)
          : null;

        if (!sharedResult) {
          setIsNotFound(true);
          setIsLoading(false);
          return;
        }

        setSavedShareCode(code);
        setNickname(databaseResult?.playerName ?? '');
        setSaveStatus('success');
        setResult(sharedResult);
        setIsLoading(false);
        return;
      }

      let loadedResult: DisplayResult | null = null;
      const completedGameRaw = window.sessionStorage.getItem(
        'goldJacket_completedGame'
      );

      if (completedGameRaw) {
        try {
          const completedGame = JSON.parse(completedGameRaw) as CompletedGame;
          loadedResult = normalizeCompletedGame(
            completedGame.state,
            completedGame.scoreResult
          );
        } catch {
          loadedResult = null;
        }
      }

      if (!loadedResult) {
        const currentStateRaw = window.sessionStorage.getItem(
          'goldJacketGameState'
        );
        const currentResultRaw = window.sessionStorage.getItem(
          'goldJacketResult'
        );

        if (currentStateRaw && currentResultRaw) {
          try {
            const state = JSON.parse(currentStateRaw) as GameState;
            const storedResult = JSON.parse(currentResultRaw) as {
              gameState?: GameState;
            } & ScoreResult;
            loadedResult = normalizeCompletedGame(
              storedResult.gameState ?? state,
              storedResult
            );
          } catch {
            loadedResult = null;
          }
        }
      }

      window.sessionStorage.removeItem('goldJacket_completedGame');
      window.sessionStorage.removeItem('goldJacketGameState');
      window.sessionStorage.removeItem('goldJacketResult');

      if (!loadedResult) {
        router.replace('/');
        return;
      }

      const personalBest = Number(
        window.localStorage.getItem('goldJacket_personalBest') ?? 0
      );
      if (loadedResult.projectedWins > personalBest) {
        window.localStorage.setItem(
          'goldJacket_personalBest',
          String(loadedResult.projectedWins)
        );
        setIsNewPersonalBest(true);
      }

      if (!isCancelled) {
        setResult(loadedResult);
        setIsLoading(false);
      }
    }

    void loadResult();

    return () => {
      isCancelled = true;
    };
  }, [router, searchParams]);

  useEffect(() => {
    if (!result) return;

    let isCancelled = false;
    setIsLoadingReport(true);

    void generateScoutingReport({
      roster: result.roster.map((player) => ({
        name: player.name,
        position: player.position,
        decade: player.era,
        positionScore: player.positionScore,
      })),
      coachName: result.coach.name,
      projectedWins: result.projectedWins,
      draftGrade: result.draftGrade,
      bustPlayerName: result.bustPlayer?.name ?? 'None identified',
      unitScores: result.unitScores,
    }).then((report) => {
      if (isCancelled) return;
      setScoutingReport(report);
      setIsLoadingReport(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [result]);

  useEffect(() => {
    if (!result) return;

    let isCancelled = false;

    void import('canvas-confetti').then(({ default: confetti }) => {
      if (isCancelled) return;

      if (result.achievedGoldJacket) {
        confetti({
          particleCount: 180,
          spread: 110,
          startVelocity: 45,
          origin: { y: 0.62 },
          colors: ['#c9a84c', '#e8c96d', '#f5f5f5'],
        });
      } else if (result.projectedWins >= 15) {
        confetti({
          particleCount: 60,
          spread: 75,
          origin: { y: 0.68 },
          colors: ['#c9a84c', '#e8c96d'],
        });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [result]);

  useEffect(() => {
    if (!shareToast) return;
    const timeoutId = window.setTimeout(() => setShareToast(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [shareToast]);

  async function handleShare() {
    if (!result) return;

    const code =
      savedShareCode ??
      encodeResult(result.state, {
        projectedWins: result.projectedWins,
        draftGrade: result.draftGrade,
        isGoldJacket: result.achievedGoldJacket,
      });
    const shareUrl = `${window.location.origin}/results?code=${encodeURIComponent(code)}`;

    try {
      if (!shareCardRef.current) return;

      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'gold-jacket-roster.png', {
        type: 'image/png',
      });

      if (
        window.navigator.share &&
        window.navigator.canShare?.({ files: [file] })
      ) {
        await window.navigator.share({
          title: 'Gold Jacket',
          text: `I projected ${result.projectedWins} wins. Can you beat it?`,
          url: shareUrl,
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.download = 'gold-jacket-roster.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Share failed:', error);
      await window.navigator.clipboard.writeText(shareUrl);
      setShareToast(true);
    }
  }

  function handleReset() {
    window.sessionStorage.clear();
    router.push('/');
  }

  function handleResultCardClick(event: MouseEvent<HTMLDivElement>) {
    const button = (event.target as HTMLElement).closest('button');
    if (!button) return;

    const label = button.textContent?.trim().toUpperCase();
    if (label === 'SHARE ROSTER') void handleShare();
    if (label === 'BUILD ANOTHER') handleReset();
  }

  async function handleSave() {
    if (!result || saveStatus === 'saving' || saveStatus === 'success') return;

    setSaveStatus('saving');
    const shareCode = encodeResult(result.state, {
      projectedWins: result.projectedWins,
      draftGrade: result.draftGrade,
      isGoldJacket: result.achievedGoldJacket,
    });
    const isDailyChallenge = result.state.seed === getDailySeed();
    const gameResult: GameResult = {
      playerName: nickname.trim() || 'Anonymous',
      coachId: result.coach.id,
      coachName: result.coach.name,
      roster: result.roster.map((player) => ({
        name: player.name,
        position: player.position,
        decade: player.era,
        positionScore: player.positionScore,
      })),
      projectedWins: result.projectedWins,
      strengthRating: result.strengthRating,
      unitScores: result.unitScores,
      draftGrade: result.draftGrade,
      isGoldJacket: result.achievedGoldJacket,
      gameMode: result.state.mode,
      shareCode,
      seed: result.state.seed,
      isDailyChallenge,
      challengeDate: isDailyChallenge
        ? new Date().toISOString().slice(0, 10)
        : undefined,
      trashTalk: trashTalk.trim() || undefined,
    };
    const savedCode = await saveResult(gameResult);

    if (!savedCode) {
      setSaveStatus('error');
      return;
    }

    setSavedShareCode(savedCode);
    window.history.replaceState(
      {},
      '',
      `/results?code=${encodeURIComponent(savedCode)}`
    );
    setSaveStatus('success');
  }

  if (isNotFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy px-5 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-card-border bg-card p-7 text-center">
          <h1 className="font-[var(--font-bebas)] text-3xl tracking-wide text-gold">
            Result not found
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            This shared result may have been removed or the link is invalid.
          </p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-6 w-full rounded-lg bg-gold px-4 py-3 text-sm font-bold text-navy transition-colors hover:bg-gold-light"
          >
            BACK TO HOME
          </button>
        </div>
      </main>
    );
  }

  if (isLoading || !result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy text-gold">
        <p className="animate-pulse font-[var(--font-bebas)] text-2xl">
          Loading Results...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy px-4 pb-12 pt-5 text-white sm:px-6">
      <div className="mx-auto w-full max-w-[480px]">
        <nav className="relative flex h-12 items-center justify-center">
          <button
            type="button"
            aria-label="Back to home"
            onClick={() => router.push('/')}
            className="absolute left-0 rounded-full border border-card-border px-3 py-1.5 text-lg text-gray-400 transition-colors hover:border-gold hover:text-gold"
          >
            ←
          </button>
          <p className="font-[var(--font-bebas)] text-2xl tracking-wider text-gold">
            Gold Jacket
          </p>
        </nav>

        {isNewPersonalBest && (
          <div className="mt-4 animate-[slideDown_500ms_ease-out] rounded-xl bg-gold px-4 py-3 text-center text-sm font-bold text-navy shadow-[0_0_18px_rgba(201,168,76,0.35)]">
            NEW PERSONAL BEST — {result.projectedWins} wins
          </div>
        )}

        <div className="mt-5" onClickCapture={handleResultCardClick}>
          <ResultCard
            roster={result.roster}
            coach={result.coach}
            projectedWins={result.projectedWins}
            unitScores={result.unitScores}
            strengthRating={result.strengthRating}
            draftGrade={result.draftGrade}
            scoutingReport={scoutingReport}
            isLoadingReport={isLoadingReport}
            isGoldJacket={result.achievedGoldJacket}
            bustPlayer={result.bustPlayer}
            onShare={handleShare}
            onReset={handleReset}
          />
        </div>

        {saveStatus !== 'success' ? (
          <section className="mt-6 rounded-2xl border border-card-border bg-card p-5">
            <h2 className="font-[var(--font-bebas)] text-2xl tracking-wide text-white">
              Save Your Score
            </h2>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                maxLength={20}
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="Your nickname"
                className="w-full rounded-lg border border-card-border bg-navy px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-gold"
              />
              <input
                type="text"
                maxLength={60}
                value={trashTalk}
                onChange={(event) => setTrashTalk(event.target.value)}
                placeholder="Patriots fan, obviously"
                className="w-full rounded-lg border border-card-border bg-navy px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-gold"
              />
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saveStatus === 'saving'}
                className="w-full rounded-lg bg-gold px-4 py-3 text-sm font-bold text-navy transition-colors hover:bg-gold-light disabled:cursor-wait disabled:opacity-60"
              >
                {saveStatus === 'saving'
                  ? 'SAVING...'
                  : 'SAVE TO LEADERBOARD'}
              </button>
              {saveStatus === 'error' && (
                <p className="text-center text-sm font-bold text-red-300">
                  Save failed, try again
                </p>
              )}
            </div>
          </section>
        ) : (
          <div className="mt-6 rounded-xl border border-green-400/40 bg-green-400/10 px-4 py-3 text-center text-sm font-bold text-green-300">
            Saved to leaderboard!
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push('/leaderboard')}
          className="mt-4 w-full rounded-lg border border-gold px-4 py-3 text-sm font-bold text-gold transition-colors hover:bg-gold/10"
        >
          VIEW LEADERBOARD
        </button>
      </div>

      {shareToast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-navy shadow-lg">
          Link copied!
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-9999px',
          pointerEvents: 'none',
        }}
      >
        <div ref={shareCardRef} style={{ width: '390px', height: '680px' }}>
          <ShareCard
            roster={result.roster.map((player) => ({
              name: player.name,
              position: player.position,
              decade: player.era,
              positionScore: player.positionScore,
            }))}
            coachName={result.coach.name}
            projectedWins={result.projectedWins}
            draftGrade={result.draftGrade}
            unitScores={result.unitScores}
            isGoldJacket={result.achievedGoldJacket}
            playerName={nickname.trim() || 'Anonymous'}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-navy text-gold">
          <p className="animate-pulse font-[var(--font-bebas)] text-2xl">
            Loading Results...
          </p>
        </main>
      }
    >
      <ResultsExperience />
    </Suspense>
  );
}
