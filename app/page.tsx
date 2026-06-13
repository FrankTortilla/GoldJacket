'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HOW_TO_PLAY_RULES = [
  'Select your coach',
  'Draft 8 legends across eras',
  'Simulation projects your wins out of 17',
  '17-0 earns your Gold Jacket',
  'One Bust card hidden in every draft',
  'Daily Challenge resets every midnight',
];

export default function Home() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [personalBest, setPersonalBest] = useState<number | null>(null);

  useEffect(() => {
    const storedPersonalBest = window.localStorage.getItem(
      'goldJacket_personalBest'
    );
    if (storedPersonalBest) {
      const parsedPersonalBest = Number(storedPersonalBest);
      if (Number.isFinite(parsedPersonalBest)) {
        setPersonalBest(parsedPersonalBest);
      }
    }

    const frameId = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center overflow-x-hidden bg-navy px-5 pb-12 pt-28 text-white sm:px-8 md:justify-center md:py-20"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)',
      }}
    >
      <nav className="fixed right-5 top-5 z-20 flex items-center gap-4 sm:right-8 sm:top-7 sm:gap-6">
        <button
          type="button"
          onClick={() => router.push('/leaderboard')}
          className="text-xs font-bold tracking-wide text-gray-500 transition-colors hover:text-gold sm:text-sm"
        >
          LEADERBOARD
        </button>
        <button
          type="button"
          onClick={() => router.push('/hof')}
          className="text-xs font-bold tracking-wide text-gray-500 transition-colors hover:text-gold sm:text-sm"
        >
          HALL OF FAME
        </button>
      </nav>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <header className="text-center">
          <h1
            className={`bg-gradient-to-r from-gold to-gold-light bg-clip-text font-[var(--font-bebas)] text-[clamp(2.75rem,15vw,4.5rem)] leading-none tracking-[0.06em] text-transparent transition-all duration-[600ms] ${
              isReady ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            Gold Jacket
          </h1>
          <p
            className={`mt-4 text-xs font-bold uppercase tracking-[0.24em] text-gray-500 transition-all duration-[600ms] delay-200 sm:text-sm ${
              isReady ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            Build your legend. Earn your jacket.
          </p>
          {personalBest !== null && (
            <p className="mt-3 text-sm font-bold text-gold">
              Your best: {Math.round(personalBest)} wins
            </p>
          )}
          <div
            className={`mx-auto mt-5 h-px w-20 bg-gold transition-all duration-[600ms] delay-200 ${
              isReady ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
            }`}
          />
        </header>

        <section
          className={`mt-10 grid w-full max-w-2xl grid-cols-1 gap-5 transition-all duration-[600ms] delay-300 md:grid-cols-2 ${
            isReady ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
          aria-label="Choose a game mode"
        >
          <button
            type="button"
            onClick={() => router.push('/draft?mode=classic')}
            className="group flex cursor-pointer flex-col items-center rounded-xl border border-card-border bg-card p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-[0_0_18px_rgba(201,168,76,0.25)] focus-visible:border-gold focus-visible:outline-none"
          >
            <span aria-hidden="true" className="text-4xl">
              🏈
            </span>
            <h2 className="mt-4 font-[var(--font-bebas)] text-2xl tracking-wide text-gold">
              Classic
            </h2>
            <p className="mb-6 mt-2 text-sm text-gray-400">
              Full stats visible. Make informed picks.
            </p>
            <span className="mt-auto w-full rounded-lg bg-gold px-5 py-3 text-sm font-bold text-navy transition-colors group-hover:bg-gold-light">
              PLAY CLASSIC
            </span>
          </button>

          <button
            type="button"
            onClick={() => router.push('/draft?mode=iq')}
            className="group flex cursor-pointer flex-col items-center rounded-xl border border-card-border bg-card p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-[0_0_18px_rgba(201,168,76,0.25)] focus-visible:border-gold focus-visible:outline-none"
          >
            <span aria-hidden="true" className="text-4xl">
              🧠
            </span>
            <h2 className="mt-4 font-[var(--font-bebas)] text-2xl tracking-wide text-white">
              Gold Jacket IQ
            </h2>
            <p className="mb-6 mt-2 text-sm text-gray-400">
              Stats hidden. Draft from memory.
            </p>
            <span className="mt-auto w-full rounded-lg border border-gold px-5 py-3 text-sm font-bold text-gold transition-colors group-hover:bg-gold/10">
              PLAY IQ
            </span>
          </button>
        </section>

        <div
          className={`mt-7 flex w-full flex-col items-center transition-all duration-[600ms] delay-[400ms] ${
            isReady ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={() => router.push('/draft?mode=classic&daily=true')}
            className="min-h-12 rounded-full border border-gold px-5 py-2 text-xs font-bold tracking-wider text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            DAILY CHALLENGE
          </button>

          <button
            type="button"
            aria-expanded={showRules}
            aria-controls="how-to-play-rules"
            onClick={() => setShowRules((isOpen) => !isOpen)}
            className="mt-6 text-sm font-bold tracking-wide text-gray-500 transition-colors hover:text-gold"
          >
            HOW TO PLAY
          </button>

          <div
            id="how-to-play-rules"
            className={`grid w-full max-w-lg transition-all duration-300 ${
              showRules
                ? 'mt-4 grid-rows-[1fr] opacity-100'
                : 'mt-0 grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <ol className="space-y-2 rounded-xl border border-card-border bg-[#0d1525] p-5 text-sm text-gray-300">
                {HOW_TO_PLAY_RULES.map((rule, index) => (
                  <li key={rule} className="flex gap-3">
                    <span className="font-bold text-gold">{index + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          paddingTop: '24px',
          paddingBottom: '32px',
          marginTop: '24px',
          borderTop: '1px solid #1f2937',
        }}
      >
        <img
          src="/caspr-logo.svg"
          width="56"
          height="23"
          alt="Caspr"
          style={{
            opacity: 0.3,
            filter: 'brightness(0) invert(1)',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.3')}
        />
      </div>
    </main>
  );
}
