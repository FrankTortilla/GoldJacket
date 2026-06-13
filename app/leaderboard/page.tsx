'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const MOCK_RESULTS = [
  {
    id: '1',
    playerName: 'Steve',
    coachId: 'belichick',
    coachName: 'Belichick',
    projectedWins: 16.8,
    draftGrade: 'A+',
    isGoldJacket: true,
    gameMode: 'classic',
    isDaily: false,
    trashTalk: 'Defense wins championships.',
    roster: [
      { name: 'Joe Montana', position: 'QB' },
      { name: 'Barry Sanders', position: 'RB' },
      { name: 'Jerry Rice', position: 'WR' },
      { name: 'Tony Gonzalez', position: 'TE' },
      { name: 'Reggie White', position: 'Edge' },
      { name: 'Ray Lewis', position: 'LB' },
      { name: 'Deion Sanders', position: 'DB' },
      { name: 'Aaron Donald', position: 'DL' },
    ],
    createdAt: '2026-06-11',
  },
  {
    id: '2',
    playerName: 'Marcus',
    coachId: 'walsh',
    coachName: 'Walsh',
    projectedWins: 15.2,
    draftGrade: 'A',
    isGoldJacket: false,
    gameMode: 'classic',
    isDaily: true,
    trashTalk: 'West Coast offense never loses.',
    roster: [
      { name: 'Joe Montana', position: 'QB' },
      { name: 'Marshall Faulk', position: 'RB' },
      { name: 'Randy Moss', position: 'WR' },
      { name: 'Rob Gronkowski', position: 'TE' },
      { name: 'Lawrence Taylor', position: 'Edge' },
      { name: 'Brian Urlacher', position: 'LB' },
      { name: 'Ed Reed', position: 'DB' },
      { name: 'JJ Watt', position: 'DL' },
    ],
    createdAt: '2026-06-11',
  },
  {
    id: '3',
    playerName: 'Jordan',
    coachId: 'reid',
    coachName: 'Andy Reid',
    projectedWins: 14.7,
    draftGrade: 'A',
    isGoldJacket: false,
    gameMode: 'iq',
    isDaily: false,
    trashTalk: 'Drafted from memory. No stats needed.',
    roster: [
      { name: 'Patrick Mahomes', position: 'QB' },
      { name: 'LaDainian Tomlinson', position: 'RB' },
      { name: 'Tyreek Hill', position: 'WR' },
      { name: 'Travis Kelce', position: 'TE' },
      { name: 'DeMarcus Ware', position: 'Edge' },
      { name: 'Patrick Willis', position: 'LB' },
      { name: 'Troy Polamalu', position: 'DB' },
      { name: 'Aaron Donald', position: 'DL' },
    ],
    createdAt: '2026-06-10',
  },
  {
    id: '4',
    playerName: 'Tyler',
    coachId: 'dungy',
    coachName: 'Dungy',
    projectedWins: 13.1,
    draftGrade: 'B+',
    isGoldJacket: false,
    gameMode: 'classic',
    isDaily: true,
    trashTalk: 'Cover 2 all day.',
    roster: [
      { name: 'Peyton Manning', position: 'QB' },
      { name: 'Emmitt Smith', position: 'RB' },
      { name: 'Marvin Harrison', position: 'WR' },
      { name: 'Antonio Gates', position: 'TE' },
      { name: 'Bruce Smith', position: 'Edge' },
      { name: 'Derrick Brooks', position: 'LB' },
      { name: 'Rod Woodson', position: 'DB' },
      { name: 'Reggie White', position: 'DL' },
    ],
    createdAt: '2026-06-12',
  },
  {
    id: '5',
    playerName: 'Chris',
    coachId: 'lombardi',
    coachName: 'Lombardi',
    projectedWins: 12.4,
    draftGrade: 'B',
    isGoldJacket: false,
    gameMode: 'iq',
    isDaily: false,
    trashTalk: 'Old school beats new school.',
    roster: [
      { name: 'Brett Favre', position: 'QB' },
      { name: 'Walter Payton', position: 'RB' },
      { name: 'Michael Irvin', position: 'WR' },
      { name: 'Shannon Sharpe', position: 'TE' },
      { name: 'Derrick Thomas', position: 'Edge' },
      { name: 'Mike Singletary', position: 'LB' },
      { name: 'Ronnie Lott', position: 'DB' },
      { name: 'Kevin Greene', position: 'DL' },
    ],
    createdAt: '2026-06-09',
  },
] as const;

type ActiveTab = 'today' | 'weekly' | 'alltime';
type FilterMode = 'all' | 'classic' | 'iq';

const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'weekly', label: 'This Week' },
  { id: 'alltime', label: 'All Time' },
];

const MODE_FILTERS: { id: FilterMode; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'classic', label: 'Classic' },
  { id: 'iq', label: 'Gold IQ' },
];

const POSITION_COLORS: Record<string, string> = {
  QB: 'bg-blue-600',
  RB: 'bg-emerald-600',
  WR: 'bg-purple-600',
  TE: 'bg-orange-600',
  Edge: 'bg-red-600',
  DL: 'bg-red-600',
  LB: 'bg-yellow-600',
  DB: 'bg-teal-600',
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function gradeClasses(grade: string) {
  if (grade === 'A+' || grade === 'A') {
    return 'bg-gold text-navy';
  }

  if (grade === 'B+' || grade === 'B') {
    return 'bg-gray-400 text-navy';
  }

  return 'bg-gray-700 text-gray-200';
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(toDateKey(new Date()));
  }, []);

  const todayDailyResults = MOCK_RESULTS.filter(
    (result) => result.isDaily && result.createdAt === today,
  );

  const weeklyStart = today ? new Date(`${today}T00:00:00`) : null;
  weeklyStart?.setDate(weeklyStart.getDate() - 6);

  const filteredResults = MOCK_RESULTS.filter((result) => {
    const matchesPeriod =
      activeTab === 'alltime' ||
      (activeTab === 'today' && result.createdAt === today) ||
      (activeTab === 'weekly' &&
        weeklyStart !== null &&
        new Date(`${result.createdAt}T00:00:00`) >= weeklyStart &&
        result.createdAt <= today);
    const matchesMode =
      filterMode === 'all' || result.gameMode === filterMode;

    return matchesPeriod && matchesMode;
  }).sort((a, b) => b.projectedWins - a.projectedWins);

  return (
    <main className="min-h-screen bg-navy px-4 pb-12 text-white sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <nav className="relative flex h-20 items-center justify-center">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-card-border text-xl text-gray-400 transition-colors hover:border-gold hover:text-gold"
            aria-label="Back to home"
          >
            ←
          </button>
          <Link
            href="/"
            className="font-[var(--font-bebas)] text-3xl tracking-wider text-gold"
          >
            LEADERBOARD
          </Link>
        </nav>

        {todayDailyResults.length > 0 && (
          <section className="mb-6 rounded-xl border border-gold/40 bg-[#2a2415] px-5 py-4 shadow-[0_0_24px_rgba(201,168,76,0.08)]">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
              </span>
              <div>
                <p className="font-[var(--font-bebas)] text-xl tracking-wide text-gold">
                  DAILY CHALLENGE LIVE
                </p>
                <p className="text-sm text-gray-400">
                  {todayDailyResults.length}{' '}
                  {todayDailyResults.length === 1 ? 'player has' : 'players have'}{' '}
                  submitted today
                </p>
              </div>
            </div>
          </section>
        )}

        <section aria-label="Leaderboard filters" className="mb-6">
          <div className="grid grid-cols-3 gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedId(null);
                }}
                className={`rounded-lg px-3 py-3 text-sm font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gold text-navy'
                    : 'bg-card-border text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {MODE_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  setFilterMode(filter.id);
                  setExpandedId(null);
                }}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
                  filterMode === filter.id
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-card-border text-gray-500 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3" aria-live="polite">
          {filteredResults.length > 0 ? (
            filteredResults.map((result, index) => {
              const isExpanded = expandedId === result.id;

              return (
                <article
                  key={result.id}
                  className={`overflow-hidden rounded-xl border bg-card transition-colors ${
                    isExpanded
                      ? 'border-gold/60'
                      : 'border-card-border hover:border-gray-600'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : result.id)
                    }
                    className="w-full p-4 text-left sm:p-5"
                    aria-expanded={isExpanded}
                    aria-controls={`roster-${result.id}`}
                  >
                    <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                      <span
                        className={`w-7 shrink-0 font-[var(--font-bebas)] text-2xl ${
                          index < 3 ? 'text-gold' : 'text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-white">
                            {result.playerName}
                          </p>
                          <span className="rounded-full bg-[#182236] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-300">
                            {result.gameMode === 'classic' ? 'Classic' : 'IQ'}
                          </span>
                          {result.isGoldJacket && (
                            <span className="rounded-full border border-gold/50 bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                              Gold Jacket
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-gold">
                          Coach {result.coachName}
                        </p>
                        <p className="mt-2 truncate text-sm italic text-gray-500 sm:whitespace-normal">
                          &ldquo;{result.trashTalk}&rdquo;
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <div className="text-right">
                          <p className="font-[var(--font-bebas)] text-3xl leading-none text-white sm:text-4xl">
                            {result.projectedWins.toFixed(1)}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-600">
                            Wins
                          </p>
                        </div>
                        <span
                          className={`rounded-md px-2.5 py-1 text-sm font-black ${gradeClasses(
                            result.draftGrade,
                          )}`}
                        >
                          {result.draftGrade}
                        </span>
                        <span
                          className={`text-gray-500 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        >
                          ▾
                        </span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div
                      id={`roster-${result.id}`}
                      className="border-t border-card-border bg-[#0d1525] p-4 sm:p-5"
                    >
                      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                        Full Roster
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {result.roster.map((player) => (
                          <div
                            key={`${result.id}-${player.position}-${player.name}`}
                            className="flex min-w-0 items-center gap-2 rounded-lg bg-card px-3 py-2.5"
                          >
                            <span
                              className={`flex h-7 min-w-7 items-center justify-center rounded px-1 text-[10px] font-bold text-white ${
                                POSITION_COLORS[player.position] ?? 'bg-gray-600'
                              }`}
                            >
                              {player.position}
                            </span>
                            <span className="truncate text-xs font-semibold text-gray-200 sm:text-sm">
                              {player.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/?challenge=${result.id}`)
                        }
                        className="mt-4 w-full rounded-lg bg-gold px-4 py-3 text-sm font-black text-navy transition-colors hover:bg-gold-light"
                      >
                        BEAT THIS SCORE
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-card-border bg-card/50 px-6 py-14 text-center">
              <p className="font-[var(--font-bebas)] text-2xl tracking-wide text-gray-300">
                No scores yet for this period.
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Be the first to submit.
              </p>
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={() => router.push('/?daily=true')}
          className="mt-8 w-full rounded-xl bg-gold px-5 py-4 font-black text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(201,168,76,0.25)]"
        >
          PLAY TODAY&apos;S CHALLENGE
        </button>
      </div>
    </main>
  );
}
