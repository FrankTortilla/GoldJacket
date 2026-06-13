'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_HOF = [
  {
    id: '1',
    playerName: 'Steve',
    coachName: 'Belichick',
    projectedWins: 17.0,
    draftGrade: 'A+',
    roster: [
      { name: 'Joe Montana', position: 'QB', decade: '1980s' },
      { name: 'Barry Sanders', position: 'RB', decade: '1990s' },
      { name: 'Jerry Rice', position: 'WR', decade: '1990s' },
      { name: 'Tony Gonzalez', position: 'TE', decade: '2000s' },
      { name: 'Reggie White', position: 'Edge', decade: '2000s' },
      { name: 'Ray Lewis', position: 'LB', decade: '2000s' },
      { name: 'Deion Sanders', position: 'DB', decade: '2010s' },
      { name: 'Aaron Donald', position: 'DL', decade: '2010s' },
    ],
    trashTalk: 'Perfection is the only standard.',
    createdAt: '2026-06-11',
  },
];

const POSITION_COLORS: Record<string, string> = {
  QB: 'bg-blue-600',
  RB: 'bg-green-600',
  WR: 'bg-purple-600',
  TE: 'bg-purple-600',
  DL: 'bg-red-600',
  Edge: 'bg-red-600',
  LB: 'bg-yellow-600',
  DB: 'bg-teal-600',
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function HallOfFamePage() {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = async (entryId: string) => {
    const shareUrl = `${window.location.origin}/results?hof=${entryId}`;
    let didCopy = false;

    try {
      await navigator.clipboard.writeText(shareUrl);
      didCopy = true;
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      didCopy = document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    if (didCopy) {
      setCopiedId(entryId);
      window.setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-navy px-4 pb-12 text-white sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <nav className="relative flex h-20 items-center justify-center">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-card-border text-xl text-gray-400 transition-colors hover:border-gold hover:text-gold"
            aria-label="Back to home"
          >
            ←
          </button>
          <h1 className="font-[var(--font-bebas)] text-3xl tracking-wider text-gold">
            HALL OF FAME
          </h1>
        </nav>

        <section className="mb-5 rounded-xl border border-[#3d2e00] bg-[#1a1200] p-6 text-center shadow-[inset_0_1px_0_rgba(201,168,76,0.08)]">
          <p className="font-[var(--font-bebas)] text-[32px] leading-none tracking-wide text-gold">
            THE 17-0 CLUB
          </p>
          <p className="mt-1.5 text-sm text-gray-500">
            Only the greatest rosters ever assembled
          </p>
          <span className="mt-4 inline-flex rounded-full border border-gold/30 bg-gold px-4 py-1.5 text-xs font-black uppercase tracking-wider text-navy">
            {MOCK_HOF.length} Perfect{' '}
            {MOCK_HOF.length === 1 ? 'Season' : 'Seasons'}
          </span>
        </section>

        {MOCK_HOF.length > 0 ? (
          <section aria-label="Perfect season rosters">
            {MOCK_HOF.map((entry) => (
              <article
                key={entry.id}
                className="mb-4 rounded-2xl border border-gold bg-card p-5 shadow-[0_0_20px_rgba(201,168,76,0.1)]"
              >
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <span className="rounded-full bg-gold px-3 py-1 text-xs font-black text-navy">
                    {entry.projectedWins.toFixed(0)}-0
                  </span>
                  <div className="min-w-0 text-center">
                    <h2 className="truncate font-[var(--font-bebas)] text-[22px] tracking-wide text-gold">
                      {entry.playerName}
                    </h2>
                    <span className="sr-only">
                      Draft grade {entry.draftGrade}
                    </span>
                  </div>
                  <time
                    dateTime={entry.createdAt}
                    className="text-right text-xs text-gray-500"
                  >
                    {formatDate(entry.createdAt)}
                  </time>
                </div>

                <p className="mb-3 mt-3 text-sm text-gray-400">
                  COACH:{' '}
                  <span className="font-semibold text-gray-300">
                    {entry.coachName}
                  </span>
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {entry.roster.map((player) => (
                    <div
                      key={`${entry.id}-${player.position}-${player.name}`}
                      className="flex min-w-0 items-center gap-2 rounded-lg border border-card-border bg-[#0d1525] px-2.5 py-2.5"
                    >
                      <span
                        className={`flex h-8 min-w-8 items-center justify-center rounded px-1 text-[10px] font-bold text-white ${
                          POSITION_COLORS[player.position] ?? 'bg-gray-600'
                        }`}
                      >
                        {player.position}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-white">
                          {player.name}
                        </span>
                        <span className="block text-xs text-gray-600">
                          {player.decade}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                <blockquote className="mt-3 border-t border-card-border pt-3 text-sm italic text-gray-400">
                  <span className="mr-1.5 font-[var(--font-bebas)] text-xl not-italic text-gold">
                    “
                  </span>
                  {entry.trashTalk}
                </blockquote>

                <button
                  type="button"
                  onClick={() => handleShare(entry.id)}
                  className="mt-4 rounded-lg border border-gold px-4 py-2 text-xs font-bold text-gold transition-all hover:bg-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  {copiedId === entry.id ? 'Copied!' : 'Share This Roster'}
                </button>
              </article>
            ))}
          </section>
        ) : (
          <section className="px-5 py-[60px] text-center">
            <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full border border-gold bg-gold/10 text-4xl shadow-[0_0_24px_rgba(201,168,76,0.2)]">
              🧥
            </div>
            <h2 className="mt-5 font-[var(--font-bebas)] text-[28px] tracking-wide text-white">
              NO PERFECT SEASONS YET
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              17-0 is legendary. Will you be first?
            </p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mt-6 rounded-lg bg-gold px-6 py-3 text-sm font-black text-navy transition-colors hover:bg-gold-light"
            >
              ATTEMPT 17-0
            </button>
          </section>
        )}

        <footer className="mt-5 border-t border-card-border">
          <p className="mb-3 mt-5 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
            THINK YOU CAN DO IT?
          </p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full rounded-xl bg-gold px-5 py-4 font-black text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(201,168,76,0.25)]"
          >
            START YOUR LEGACY
          </button>
        </footer>
      </div>
    </main>
  );
}
