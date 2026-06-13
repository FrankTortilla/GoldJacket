'use client';

interface ShareCardProps {
  roster: {
    name: string;
    position: string;
    decade: string;
    positionScore: number;
  }[];
  coachName: string;
  projectedWins: number;
  draftGrade: string;
  unitScores: {
    offense: number;
    defense: number;
    xfactor: number;
  };
  isGoldJacket: boolean;
  playerName: string;
}

function clampScore(score: number): number {
  return Math.min(100, Math.max(0, score));
}

function getPositionColors(position: string) {
  if (position === 'QB') {
    return { backgroundColor: '#1e3a5f', color: '#60a5fa' };
  }

  if (position === 'RB') {
    return { backgroundColor: '#1a3a1a', color: '#4ade80' };
  }

  if (position === 'WR' || position === 'TE') {
    return { backgroundColor: '#2d1b4e', color: '#a78bfa' };
  }

  if (position === 'DL' || position === 'Edge') {
    return { backgroundColor: '#3a1a1a', color: '#f87171' };
  }

  if (position === 'LB') {
    return { backgroundColor: '#3a2a00', color: '#fbbf24' };
  }

  if (position === 'DB' || position === 'CB' || position === 'S') {
    return { backgroundColor: '#003a3a', color: '#2dd4bf' };
  }

  return { backgroundColor: '#1f2937', color: '#9ca3af' };
}

function UnitBar({ label, score }: { label: string; score: number }) {
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: '#6b7280', fontSize: '9px' }}>{label}</span>
        <span style={{ color: '#6b7280', fontSize: '9px' }}>
          {Math.round(score)}
        </span>
      </div>
      <div
        style={{
          height: '4px',
          marginTop: '3px',
          marginBottom: '8px',
          overflow: 'hidden',
          borderRadius: '999px',
          backgroundColor: '#1f2937',
        }}
      >
        <div
          style={{
            width: `${clampScore(score)}%`,
            height: '4px',
            borderRadius: '999px',
            backgroundColor: '#c9a84c',
          }}
        />
      </div>
    </div>
  );
}

export default function ShareCard({
  roster,
  coachName,
  projectedWins,
  draftGrade,
  unitScores,
  isGoldJacket,
  playerName,
}: ShareCardProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        width: '390px',
        height: '680px',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#0a0f1e',
        color: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <header style={{ padding: '20px 20px 12px' }}>
        <div
          style={{
            color: '#c9a84c',
            fontFamily: 'serif',
            fontSize: '28px',
            fontWeight: 900,
            letterSpacing: '3px',
            lineHeight: 1,
          }}
        >
          GOLD JACKET
        </div>
        <div
          style={{
            marginTop: '2px',
            color: '#6b7280',
            fontSize: '10px',
            letterSpacing: '2px',
          }}
        >
          Draft legends. Chase perfection.
        </div>
        <div
          style={{
            marginTop: '8px',
            color: '#6b7280',
            fontSize: '9px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          BUILT BY {playerName || 'ANONYMOUS'}
        </div>
      </header>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '0 20px',
          padding: '9px 12px',
          border: '1px solid #1f2937',
          borderRadius: '10px',
          backgroundColor: '#111827',
        }}
      >
        <div style={{ color: '#9ca3af', fontSize: '11px' }}>
          COACH: {coachName}
        </div>
        <div
          style={{
            padding: '2px 10px',
            borderRadius: '999px',
            backgroundColor: '#c9a84c',
            color: '#0a0f1e',
            fontSize: '13px',
            fontWeight: 800,
          }}
        >
          {draftGrade}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 20px 12px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#c9a84c',
              fontSize: '64px',
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {projectedWins}
          </span>
          <span
            style={{
              marginLeft: '8px',
              color: '#6b7280',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            / 17 WINS
          </span>
        </div>
        <div
          style={{
            marginTop: '5px',
            color: '#6b7280',
            fontSize: '9px',
            letterSpacing: '3px',
          }}
        >
          PROJECTED WINS
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <UnitBar label="OFFENSE" score={unitScores.offense} />
        <UnitBar label="DEFENSE" score={unitScores.defense} />
        <UnitBar label="X FACTOR" score={unitScores.xfactor} />
      </div>

      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          marginTop: '4px',
          padding: '0 20px',
        }}
      >
        {roster.slice(0, 8).map((player) => {
          const positionColors = getPositionColors(player.position);

          return (
            <div
              key={`${player.position}-${player.name}`}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                width: '175px',
                minHeight: '48px',
                alignItems: 'center',
                padding: '6px',
                border: '1px solid #1f2937',
                backgroundColor: '#111827',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  width: '22px',
                  height: '22px',
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  backgroundColor: positionColors.backgroundColor,
                  color: positionColors.color,
                  fontSize: '8px',
                  fontWeight: 800,
                }}
              >
                {player.position}
              </span>
              <span
                style={{
                  minWidth: 0,
                  marginLeft: '6px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    overflow: 'hidden',
                    color: '#f5f5f5',
                    fontSize: '11px',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {player.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    marginTop: '2px',
                    color: '#6b7280',
                    fontSize: '9px',
                  }}
                >
                  {player.decade}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {isGoldJacket && (
        <div
          style={{
            alignSelf: 'center',
            marginTop: '14px',
            padding: '6px 16px',
            border: '1px solid #c9a84c',
            borderRadius: '999px',
            backgroundColor: '#1a1200',
            color: '#c9a84c',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '2px',
          }}
        >
          GOLD JACKET ACHIEVED
        </div>
      )}

      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          padding: '14px 20px 18px',
          borderTop: '1px solid #1f2937',
        }}
      >
        <span style={{ color: '#374151', fontSize: '10px' }}>
          goldjacket.gg
        </span>
        <span style={{ color: '#374151', fontSize: '9px' }}>
          Can you beat this roster?
        </span>
      </footer>
    </div>
  );
}
