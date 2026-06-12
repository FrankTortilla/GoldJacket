export interface ChemistryPair {
  players: [string, string];
  label: string;
  icon: string;
}

export interface RivalryPair {
  players: [string, string];
  label: string;
  icon: string;
}

export const CHEMISTRY_PAIRS: ChemistryPair[] = [
  { players: ['joe-montana', 'jerry-rice'], label: 'Dynasty Duo', icon: '🔥' },
  { players: ['peyton-manning', 'marvin-harrison'], label: 'Perfect Chemistry', icon: '🔥' },
  { players: ['tom-brady', 'rob-gronkowski'], label: 'Dynasty Duo', icon: '🔥' },
  { players: ['troy-aikman', 'michael-irvin'], label: 'Triplets', icon: '🔥' },
  { players: ['brett-favre', 'reggie-white'], label: 'Packers Legends', icon: '🔥' },
  { players: ['steve-young', 'jerry-rice'], label: 'West Coast Magic', icon: '🔥' },
  { players: ['ladainian-tomlinson', 'antonio-gates'], label: 'Chargers Legends', icon: '🔥' },
  { players: ['patrick-mahomes', 'travis-kelce'], label: 'Modern Dynasty', icon: '🔥' },
  { players: ['ray-lewis', 'ed-reed'], label: 'Ravens Defense', icon: '🔥' },
  { players: ['emmitt-smith', 'michael-irvin'], label: 'Triplets', icon: '🔥' },
  { players: ['walter-payton', 'mike-singletary'], label: 'Bears Legends', icon: '🔥' },
  { players: ['troy-polamalu', 'james-harrison'], label: 'Steelers Defense', icon: '🔥' },
  { players: ['randy-moss', 'tom-brady'], label: 'Perfect Season', icon: '🔥' },
  { players: ['marshall-faulk', 'kurt-warner'], label: 'Greatest Show', icon: '🔥' },
  { players: ['deion-sanders', 'rod-woodson'], label: 'DB Legends', icon: '🔥' },
];

export const RIVALRY_PAIRS: RivalryPair[] = [
  { players: ['lawrence-taylor', 'joe-montana'], label: 'LT vs Montana', icon: '⚔️' },
  { players: ['deion-sanders', 'jerry-rice'], label: 'Prime Time vs GOAT', icon: '⚔️' },
  { players: ['ray-lewis', 'tom-brady'], label: 'Ravens vs Patriots', icon: '⚔️' },
  { players: ['reggie-white', 'barry-sanders'], label: 'Unstoppable Forces', icon: '⚔️' },
  { players: ['bruce-smith', 'john-elway'], label: 'AFC Wars', icon: '⚔️' },
  { players: ['aaron-donald', 'patrick-mahomes'], label: 'Modern Titans', icon: '⚔️' },
  { players: ['jj-watt', 'peyton-manning'], label: 'Manning vs Watt', icon: '⚔️' },
  { players: ['darrelle-revis', 'randy-moss'], label: 'Revis Island', icon: '⚔️' },
  { players: ['lawrence-taylor', 'walter-payton'], label: 'NFC Legends', icon: '⚔️' },
  { players: ['rod-woodson', 'jerry-rice'], label: 'Steel vs Gold', icon: '⚔️' },
];

function findPair<T extends ChemistryPair | RivalryPair>(
  playerIds: string[],
  pairs: T[]
): { pair: T; players: string[] } | null {
  const playerIdSet = new Set(playerIds);
  const pair = pairs.find(({ players }) =>
    players.every((playerId) => playerIdSet.has(playerId))
  );

  return pair ? { pair, players: [...pair.players] } : null;
}

export function getChemistry(
  playerIds: string[]
): { pair: ChemistryPair; players: string[] } | null {
  return findPair(playerIds, CHEMISTRY_PAIRS);
}

export function getRivalry(
  playerIds: string[]
): { pair: RivalryPair; players: string[] } | null {
  return findPair(playerIds, RIVALRY_PAIRS);
}
