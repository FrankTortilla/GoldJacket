export interface CoachBonus {
  label: string;
  unit: 'offense' | 'defense' | 'xfactor' | 'rushing' | 'receiving' | 'passing' | 'all';
  stat?: string;
  multiplier: number; // capped at 1.20
}

export interface Coach {
  id: string;
  name: string;
  era: string;
  record: string;
  superBowls: number;
  specialty: string;
  bio: string;
  bonus: CoachBonus;
  poolBias: string[]; // position/era tags that get weighted higher in draft pool
  chemistryPlayers: string[]; // player IDs that historically fit this coach's system
}

export const coaches: Coach[] = [
  {
    id: 'belichick',
    name: 'Bill Belichick',
    era: '2000s-2020s',
    record: '302-133',
    superBowls: 6,
    specialty: 'Defense Master',
    bio: 'The greatest defensive mind in NFL history. Built dynasties through scheme versatility, elite secondary play, and a relentless pass rush. His defenses suffocate opponents into submission.',
    bonus: {
      label: 'INTs & Sacks +20%',
      unit: 'defense',
      stat: 'ints_sacks',
      multiplier: 1.20,
    },
    poolBias: ['DB', 'CB', 'S', 'Edge', 'DL', '2000s', '2010s'],
    chemistryPlayers: ['tom-brady', 'randy-moss', 'rob-gronkowski', 'darrelle-revis'],
  },
  {
    id: 'walsh',
    name: 'Bill Walsh',
    era: '1980s-1990s',
    record: '102-63',
    superBowls: 3,
    specialty: 'West Coast Offense',
    bio: 'Architect of the West Coast offense. Walsh turned precision passing into an art form, revolutionizing how the game was played and producing Hall of Famers at every skill position.',
    bonus: {
      label: 'Passing & Receiving +20%',
      unit: 'offense',
      stat: 'passing_receiving',
      multiplier: 1.20,
    },
    poolBias: ['QB', 'WR', 'TE', '1980s', '1990s'],
    chemistryPlayers: ['joe-montana', 'jerry-rice', 'steve-young'],
  },
  {
    id: 'lombardi',
    name: 'Vince Lombardi',
    era: '1960s-1980s',
    record: '105-35',
    superBowls: 2,
    specialty: 'Toughness Multiplier',
    bio: 'The gold standard of coaching excellence. Lombardi built winners through discipline, execution, and the power sweep. No coach in history demanded - or got - more from his players.',
    bonus: {
      label: 'All Stats +10%',
      unit: 'all',
      multiplier: 1.10,
    },
    poolBias: ['1980s', '1990s', 'RB', 'LB'],
    chemistryPlayers: [],
  },
  {
    id: 'johnson',
    name: 'Jimmy Johnson',
    era: '1990s-2000s',
    record: '80-64',
    superBowls: 2,
    specialty: 'Cowboys Dynasty',
    bio: 'Built the 1990s Cowboys dynasty through elite talent evaluation and a fearless offensive identity. Johnson had an uncanny ability to identify X-factor talent that changed games.',
    bonus: {
      label: 'X Factor +20%',
      unit: 'xfactor',
      multiplier: 1.20,
    },
    poolBias: ['1990s', 'WR', 'RB', 'CB'],
    chemistryPlayers: ['troy-aikman', 'emmitt-smith', 'michael-irvin', 'deion-sanders'],
  },
  {
    id: 'shanahan',
    name: 'Mike Shanahan',
    era: '1990s-2000s',
    record: '170-138',
    superBowls: 2,
    specialty: 'Run Game Specialist',
    bio: 'Master of the zone-blocking scheme that turned undrafted backs into 1,000-yard rushers. Shanahan\'s offense was built on deception, precision, and a dominant ground game.',
    bonus: {
      label: 'Rushing +20%',
      unit: 'rushing',
      multiplier: 1.20,
    },
    poolBias: ['RB', '1990s', '2000s'],
    chemistryPlayers: ['terrell-davis', 'john-elway', 'shannon-sharpe'],
  },
  {
    id: 'reid',
    name: 'Andy Reid',
    era: '2000s-2020s',
    record: '250-153',
    superBowls: 2,
    specialty: 'Offensive Genius',
    bio: 'The most creative offensive mind of his generation. Reid\'s motion-heavy, receiver-friendly system creates mismatches all over the field and has produced record-breaking offenses.',
    bonus: {
      label: 'Receiving TDs +20%',
      unit: 'receiving',
      stat: 'receiving_tds',
      multiplier: 1.20,
    },
    poolBias: ['WR', 'TE', '2000s', '2020s'],
    chemistryPlayers: ['patrick-mahomes', 'travis-kelce'],
  },
  {
    id: 'dungy',
    name: 'Tony Dungy',
    era: '1990s-2010s',
    record: '148-79',
    superBowls: 1,
    specialty: 'Cover 2 Defense',
    bio: 'The quiet assassin. Dungy\'s Tampa 2 scheme redefined defensive football, creating a blueprint that teams still copy today. His DBs thrived in a system built for ball-hawking excellence.',
    bonus: {
      label: 'INTs +20%',
      unit: 'defense',
      stat: 'ints',
      multiplier: 1.20,
    },
    poolBias: ['DB', 'CB', 'S', 'LB', '1990s', '2000s', '2010s'],
    chemistryPlayers: ['peyton-manning'],
  },
  {
    id: 'shula',
    name: 'Don Shula',
    era: '1970s-1990s',
    record: '347-173',
    superBowls: 2,
    specialty: 'Balanced Attack',
    bio: 'The winningest coach in NFL history built with balance, not brilliance. Shula adapted to his personnel across four decades, elevating every player on his roster regardless of position.',
    bonus: {
      label: 'All Stats +8%',
      unit: 'all',
      multiplier: 1.08,
    },
    poolBias: [],
    chemistryPlayers: ['dan-marino'],
  },
];

export default coaches;
