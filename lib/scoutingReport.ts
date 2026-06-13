interface ScoutingReportParams {
  roster: {
    name: string;
    position: string;
    decade: string;
    positionScore: number;
  }[];
  coachName: string;
  projectedWins: number;
  draftGrade: string;
  bustPlayerName: string;
  unitScores: {
    offense: number;
    defense: number;
    xfactor: number;
  };
}

interface AnthropicResponse {
  content?: {
    text?: string;
  }[];
  error?: {
    message?: string;
  };
}

const FALLBACK_REPORT =
  'Our scout is reviewing the tape. Check back later.';

export async function generateScoutingReport(
  params: ScoutingReportParams
): Promise<string> {
  try {
    const rosterList = params.roster
      .map(
        (player) =>
          `${player.position}: ${player.name} (${player.decade}, score: ${player.positionScore})`
      )
      .join('\n');

    const userPrompt = `
Coach: ${params.coachName}
Projected wins: ${params.projectedWins} / 17
Draft grade: ${params.draftGrade}
Offense: ${params.unitScores.offense}/100
Defense: ${params.unitScores.defense}/100
X Factor: ${params.unitScores.xfactor}/100
Bust player: ${params.bustPlayerName}

Roster:
${rosterList}

Write the scouting report.
`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 180,
        system: `You are a gruff, funny NFL scout writing
a one-paragraph scouting report on a fantasy roster.
Rules:
- Be specific about the actual players selected
- Call out the weakest position group honestly
- Mention the bust player by name
- Reference the coach by name and their system
- End with one bold prediction
- Keep it under 80 words
- Funny but not mean
- Write like an old school scout not a PR person`,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const data = (await response.json()) as AnthropicResponse;
    if (data.error) throw new Error(data.error.message);

    const report = data.content?.[0]?.text;
    if (!response.ok || !report) {
      throw new Error('Anthropic returned an invalid response.');
    }

    return report;
  } catch {
    return FALLBACK_REPORT;
  }
}
