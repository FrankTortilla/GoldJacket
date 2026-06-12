import type { Player } from './types';

// Peak single-season stats. Decade = primary peak era (controls draft round eligibility).
// score = 0-100 normalized quality within position group.

export const players: Player[] = [
  // ─── QBs — 1980s (Round 1 pool) ───────────────────────────────────────────
  {
    id: 'dan-marino',
    name: 'Dan Marino',
    position: 'QB', team: 'Dolphins', decade: '1980s',
    stats: { passerRating: 108.9, passingTDs: 48, interceptions: 17 },
    score: 96,
  },
  {
    id: 'joe-montana',
    name: 'Joe Montana',
    position: 'QB', team: '49ers', decade: '1980s',
    stats: { passerRating: 112.4, passingTDs: 26, interceptions: 8 },
    score: 98,
  },
  {
    id: 'john-elway',
    name: 'John Elway',
    position: 'QB', team: 'Broncos', decade: '1980s',
    stats: { passerRating: 92.8, passingTDs: 25, interceptions: 10 },
    score: 88,
  },

  // ─── QBs — 1990s ──────────────────────────────────────────────────────────
  {
    id: 'brett-favre',
    name: 'Brett Favre',
    position: 'QB', team: 'Packers', decade: '1990s',
    stats: { passerRating: 99.5, passingTDs: 38, interceptions: 13 },
    score: 91,
  },
  {
    id: 'troy-aikman',
    name: 'Troy Aikman',
    position: 'QB', team: 'Cowboys', decade: '1990s',
    stats: { passerRating: 104.9, passingTDs: 23, interceptions: 7 },
    score: 84,
  },
  {
    id: 'steve-young',
    name: 'Steve Young',
    position: 'QB', team: '49ers', decade: '1990s',
    stats: { passerRating: 112.8, passingTDs: 35, interceptions: 10 },
    score: 94,
  },
  {
    id: 'kurt-warner',
    name: 'Kurt Warner',
    position: 'QB', team: 'Rams', decade: '1990s',
    stats: { passerRating: 109.2, passingTDs: 41, interceptions: 13 },
    score: 90,
  },

  // ─── QBs — 2000s ──────────────────────────────────────────────────────────
  {
    id: 'tom-brady',
    name: 'Tom Brady',
    position: 'QB', team: 'Patriots', decade: '2000s',
    stats: { passerRating: 117.2, passingTDs: 50, interceptions: 8 },
    score: 99,
  },
  {
    id: 'peyton-manning',
    name: 'Peyton Manning',
    position: 'QB', team: 'Colts', decade: '2000s',
    stats: { passerRating: 121.1, passingTDs: 49, interceptions: 10 },
    score: 99,
  },
  {
    id: 'drew-brees',
    name: 'Drew Brees',
    position: 'QB', team: 'Saints', decade: '2000s',
    stats: { passerRating: 110.6, passingTDs: 46, interceptions: 14 },
    score: 93,
  },
  {
    id: 'eli-manning',
    name: 'Eli Manning',
    position: 'QB', team: 'Giants', decade: '2000s',
    stats: { passerRating: 92.9, passingTDs: 29, interceptions: 16 },
    score: 78,
  },
  {
    id: 'ben-roethlisberger',
    name: 'Ben Roethlisberger',
    position: 'QB', team: 'Steelers', decade: '2000s',
    stats: { passerRating: 103.3, passingTDs: 32, interceptions: 9 },
    score: 85,
  },
  {
    id: 'philip-rivers',
    name: 'Philip Rivers',
    position: 'QB', team: 'Chargers', decade: '2000s',
    stats: { passerRating: 105.5, passingTDs: 34, interceptions: 11 },
    score: 86,
  },

  // ─── QBs — 2010s ──────────────────────────────────────────────────────────
  {
    id: 'aaron-rodgers',
    name: 'Aaron Rodgers',
    position: 'QB', team: 'Packers', decade: '2010s',
    stats: { passerRating: 122.5, passingTDs: 45, interceptions: 6 },
    score: 99,
  },
  {
    id: 'russell-wilson',
    name: 'Russell Wilson',
    position: 'QB', team: 'Seahawks', decade: '2010s',
    stats: { passerRating: 110.1, passingTDs: 34, interceptions: 8 },
    score: 87,
  },
  {
    id: 'matthew-stafford',
    name: 'Matthew Stafford',
    position: 'QB', team: 'Lions', decade: '2010s',
    stats: { passerRating: 97.2, passingTDs: 41, interceptions: 16 },
    score: 80,
  },
  {
    id: 'lamar-jackson',
    name: 'Lamar Jackson',
    position: 'QB', team: 'Ravens', decade: '2010s',
    stats: { passerRating: 113.3, passingTDs: 36, interceptions: 6 },
    score: 93,
  },
  {
    id: 'josh-allen',
    name: 'Josh Allen',
    position: 'QB', team: 'Bills', decade: '2010s',
    stats: { passerRating: 107.2, passingTDs: 37, interceptions: 10 },
    score: 89,
  },

  // ─── QBs — 2020s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'patrick-mahomes',
    name: 'Patrick Mahomes',
    position: 'QB', team: 'Chiefs', decade: '2020s',
    stats: { passerRating: 113.8, passingTDs: 50, interceptions: 12 },
    score: 98,
  },
  {
    id: 'joe-burrow',
    name: 'Joe Burrow',
    position: 'QB', team: 'Bengals', decade: '2020s',
    stats: { passerRating: 108.3, passingTDs: 34, interceptions: 14 },
    score: 87,
  },

  // ─── RBs — 1980s ──────────────────────────────────────────────────────────
  {
    id: 'walter-payton',
    name: 'Walter Payton',
    position: 'RB', team: 'Bears', decade: '1980s',
    stats: { yardsFromScrimmage: 2034, touchdowns: 11 },
    score: 96,
  },
  {
    id: 'eric-dickerson',
    name: 'Eric Dickerson',
    position: 'RB', team: 'Rams', decade: '1980s',
    stats: { yardsFromScrimmage: 2244, touchdowns: 14 },
    score: 95,
  },
  {
    id: 'marcus-allen',
    name: 'Marcus Allen',
    position: 'RB', team: 'Raiders', decade: '1980s',
    stats: { yardsFromScrimmage: 2314, touchdowns: 15 },
    score: 90,
  },
  {
    id: 'franco-harris',
    name: 'Franco Harris',
    position: 'RB', team: 'Steelers', decade: '1980s',
    stats: { yardsFromScrimmage: 1477, touchdowns: 11 },
    score: 80,
  },

  // ─── RBs — 1990s (Round 2 pool) ───────────────────────────────────────────
  {
    id: 'emmitt-smith',
    name: 'Emmitt Smith',
    position: 'RB', team: 'Cowboys', decade: '1990s',
    stats: { yardsFromScrimmage: 2148, touchdowns: 25 },
    score: 94,
  },
  {
    id: 'barry-sanders',
    name: 'Barry Sanders',
    position: 'RB', team: 'Lions', decade: '1990s',
    stats: { yardsFromScrimmage: 2358, touchdowns: 11 },
    score: 98,
  },
  {
    id: 'thurman-thomas',
    name: 'Thurman Thomas',
    position: 'RB', team: 'Bills', decade: '1990s',
    stats: { yardsFromScrimmage: 2113, touchdowns: 9 },
    score: 89,
  },
  {
    id: 'terrell-davis',
    name: 'Terrell Davis',
    position: 'RB', team: 'Broncos', decade: '1990s',
    stats: { yardsFromScrimmage: 2310, touchdowns: 23 },
    score: 95,
  },
  {
    id: 'marshall-faulk',
    name: 'Marshall Faulk',
    position: 'RB', team: 'Colts', decade: '1990s',
    stats: { yardsFromScrimmage: 2227, touchdowns: 17 },
    score: 95,
  },

  // ─── RBs — 2000s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'ladainian-tomlinson',
    name: 'LaDainian Tomlinson',
    position: 'RB', team: 'Chargers', decade: '2000s',
    stats: { yardsFromScrimmage: 2323, touchdowns: 31 },
    score: 99,
  },
  {
    id: 'priest-holmes',
    name: 'Priest Holmes',
    position: 'RB', team: 'Chiefs', decade: '2000s',
    stats: { yardsFromScrimmage: 2110, touchdowns: 27 },
    score: 93,
  },
  {
    id: 'curtis-martin',
    name: 'Curtis Martin',
    position: 'RB', team: 'Jets', decade: '2000s',
    stats: { yardsFromScrimmage: 1942, touchdowns: 12 },
    score: 85,
  },

  // ─── RBs — 2010s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'adrian-peterson',
    name: 'Adrian Peterson',
    position: 'RB', team: 'Vikings', decade: '2010s',
    stats: { yardsFromScrimmage: 2314, touchdowns: 13 },
    score: 95,
  },
  {
    id: 'derrick-henry',
    name: 'Derrick Henry',
    position: 'RB', team: 'Titans', decade: '2010s',
    stats: { yardsFromScrimmage: 2141, touchdowns: 17 },
    score: 90,
  },

  // ─── RBs — 2020s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'christian-mccaffrey',
    name: 'Christian McCaffrey',
    position: 'RB', team: '49ers', decade: '2020s',
    stats: { yardsFromScrimmage: 2392, touchdowns: 19 },
    score: 96,
  },

  // ─── WRs — 1980s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'art-monk',
    name: 'Art Monk',
    position: 'WR', team: 'Redskins', decade: '1980s',
    stats: { receivingYards: 1372, receivingTDs: 7, catchRate: 72 },
    score: 82,
  },

  // ─── WRs — 1990s (Round 3 pool) ───────────────────────────────────────────
  {
    id: 'jerry-rice',
    name: 'Jerry Rice',
    position: 'WR', team: '49ers', decade: '1990s',
    stats: { receivingYards: 1848, receivingTDs: 15, catchRate: 73 },
    score: 99,
  },
  {
    id: 'randy-moss',
    name: 'Randy Moss',
    position: 'WR', team: 'Vikings', decade: '1990s',
    stats: { receivingYards: 1632, receivingTDs: 17, catchRate: 57 },
    score: 97,
  },
  {
    id: 'michael-irvin',
    name: 'Michael Irvin',
    position: 'WR', team: 'Cowboys', decade: '1990s',
    stats: { receivingYards: 1603, receivingTDs: 10, catchRate: 58 },
    score: 88,
  },
  {
    id: 'cris-carter',
    name: 'Cris Carter',
    position: 'WR', team: 'Vikings', decade: '1990s',
    stats: { receivingYards: 1241, receivingTDs: 13, catchRate: 72 },
    score: 87,
  },
  {
    id: 'tim-brown',
    name: 'Tim Brown',
    position: 'WR', team: 'Raiders', decade: '1990s',
    stats: { receivingYards: 1408, receivingTDs: 5, catchRate: 57 },
    score: 82,
  },

  // ─── WRs — 2000s (Round 7 pool) ───────────────────────────────────────────
  {
    id: 'terrell-owens',
    name: 'Terrell Owens',
    position: 'WR', team: '49ers', decade: '2000s',
    stats: { receivingYards: 1412, receivingTDs: 16, catchRate: 61 },
    score: 94,
  },
  {
    id: 'marvin-harrison',
    name: 'Marvin Harrison',
    position: 'WR', team: 'Colts', decade: '2000s',
    stats: { receivingYards: 1722, receivingTDs: 11, catchRate: 71 },
    score: 93,
  },
  {
    id: 'hines-ward',
    name: 'Hines Ward',
    position: 'WR', team: 'Steelers', decade: '2000s',
    stats: { receivingYards: 1329, receivingTDs: 12, catchRate: 62 },
    score: 85,
  },
  {
    id: 'larry-fitzgerald',
    name: 'Larry Fitzgerald',
    position: 'WR', team: 'Cardinals', decade: '2000s',
    stats: { receivingYards: 1431, receivingTDs: 12, catchRate: 68 },
    score: 89,
  },
  {
    id: 'steve-smith-sr',
    name: 'Steve Smith Sr.',
    position: 'WR', team: 'Panthers', decade: '2000s',
    stats: { receivingYards: 1563, receivingTDs: 12, catchRate: 62 },
    score: 88,
  },
  {
    id: 'andre-johnson',
    name: 'Andre Johnson',
    position: 'WR', team: 'Texans', decade: '2000s',
    stats: { receivingYards: 1575, receivingTDs: 8, catchRate: 64 },
    score: 87,
  },

  // ─── WRs — 2010s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'calvin-johnson',
    name: 'Calvin Johnson',
    position: 'WR', team: 'Lions', decade: '2010s',
    stats: { receivingYards: 1964, receivingTDs: 5, catchRate: 59 },
    score: 94,
  },
  {
    id: 'davante-adams',
    name: 'Davante Adams',
    position: 'WR', team: 'Packers', decade: '2010s',
    stats: { receivingYards: 1553, receivingTDs: 17, catchRate: 74 },
    score: 92,
  },
  {
    id: 'deandre-hopkins',
    name: 'DeAndre Hopkins',
    position: 'WR', team: 'Texans', decade: '2010s',
    stats: { receivingYards: 1572, receivingTDs: 11, catchRate: 60 },
    score: 89,
  },

  // ─── WRs — 2020s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'justin-jefferson',
    name: 'Justin Jefferson',
    position: 'WR', team: 'Vikings', decade: '2020s',
    stats: { receivingYards: 1809, receivingTDs: 8, catchRate: 68 },
    score: 94,
  },
  {
    id: 'cooper-kupp',
    name: 'Cooper Kupp',
    position: 'WR', team: 'Rams', decade: '2020s',
    stats: { receivingYards: 1947, receivingTDs: 16, catchRate: 75 },
    score: 95,
  },

  // ─── TEs — 1980s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'kellen-winslow',
    name: 'Kellen Winslow',
    position: 'TE', team: 'Chargers', decade: '1980s',
    stats: { receivingYards: 1075, receivingTDs: 10, catchRate: 67 },
    score: 85,
  },
  {
    id: 'ozzie-newsome',
    name: 'Ozzie Newsome',
    position: 'TE', team: 'Browns', decade: '1980s',
    stats: { receivingYards: 1001, receivingTDs: 5, catchRate: 65 },
    score: 80,
  },

  // ─── TEs — 1990s (Round 3 pool) ───────────────────────────────────────────
  {
    id: 'shannon-sharpe',
    name: 'Shannon Sharpe',
    position: 'TE', team: 'Broncos', decade: '1990s',
    stats: { receivingYards: 1062, receivingTDs: 10, catchRate: 63 },
    score: 87,
  },

  // ─── TEs — 2000s (Round 7 pool) ───────────────────────────────────────────
  {
    id: 'tony-gonzalez',
    name: 'Tony Gonzalez',
    position: 'TE', team: 'Chiefs', decade: '2000s',
    stats: { receivingYards: 1258, receivingTDs: 7, catchRate: 72 },
    score: 92,
  },
  {
    id: 'antonio-gates',
    name: 'Antonio Gates',
    position: 'TE', team: 'Chargers', decade: '2000s',
    stats: { receivingYards: 964, receivingTDs: 13, catchRate: 68 },
    score: 90,
  },
  {
    id: 'jason-witten',
    name: 'Jason Witten',
    position: 'TE', team: 'Cowboys', decade: '2000s',
    stats: { receivingYards: 1145, receivingTDs: 5, catchRate: 81 },
    score: 83,
  },

  // ─── TEs — 2010s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'rob-gronkowski',
    name: 'Rob Gronkowski',
    position: 'TE', team: 'Patriots', decade: '2010s',
    stats: { receivingYards: 1327, receivingTDs: 17, catchRate: 75 },
    score: 98,
  },

  // ─── TEs — 2020s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'travis-kelce',
    name: 'Travis Kelce',
    position: 'TE', team: 'Chiefs', decade: '2020s',
    stats: { receivingYards: 1416, receivingTDs: 11, catchRate: 73 },
    score: 96,
  },

  // ─── DEs — 1980s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'reggie-white',
    name: 'Reggie White',
    position: 'DE', team: 'Eagles', decade: '1980s',
    stats: { sacks: 21, pressures: 55 },
    score: 99,
  },

  // ─── DEs — 1990s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'bruce-smith',
    name: 'Bruce Smith',
    position: 'DE', team: 'Bills', decade: '1990s',
    stats: { sacks: 19, pressures: 52 },
    score: 96,
  },
  {
    id: 'chris-doleman',
    name: 'Chris Doleman',
    position: 'DE', team: 'Vikings', decade: '1990s',
    stats: { sacks: 21, pressures: 50 },
    score: 91,
  },

  // ─── LBs — 1980s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'lawrence-taylor',
    name: 'Lawrence Taylor',
    position: 'LB', team: 'Giants', decade: '1980s',
    stats: { tackles: 105, sacks: 20.5, coverageGrade: 85 },
    score: 99,
  },

  // ─── LBs — 1990s (X Factor pool) ──────────────────────────────────────────
  {
    id: 'derrick-thomas',
    name: 'Derrick Thomas',
    position: 'LB', team: 'Chiefs', decade: '1990s',
    stats: { tackles: 100, sacks: 20, coverageGrade: 82 },
    score: 96,
  },
  {
    id: 'kevin-greene',
    name: 'Kevin Greene',
    position: 'LB', team: 'Panthers', decade: '1990s',
    stats: { tackles: 82, sacks: 14.5, coverageGrade: 72 },
    score: 88,
  },

  // ─── DTs / DEs / LBs — 2000s (Round 4 pool) ──────────────────────────────
  {
    id: 'ray-lewis',
    name: 'Ray Lewis',
    position: 'LB', team: 'Ravens', decade: '2000s',
    stats: { tackles: 161, sacks: 1, coverageGrade: 89 },
    score: 97,
  },
  {
    id: 'warren-sapp',
    name: 'Warren Sapp',
    position: 'DT', team: 'Buccaneers', decade: '2000s',
    stats: { sacks: 12.5, pressures: 40 },
    score: 88,
  },
  {
    id: 'michael-strahan',
    name: 'Michael Strahan',
    position: 'DE', team: 'Giants', decade: '2000s',
    stats: { sacks: 22.5, pressures: 55 },
    score: 94,
  },
  {
    id: 'jason-taylor',
    name: 'Jason Taylor',
    position: 'DE', team: 'Dolphins', decade: '2000s',
    stats: { sacks: 18.5, pressures: 50 },
    score: 91,
  },
  {
    id: 'demarcus-ware',
    name: 'DeMarcus Ware',
    position: 'LB', team: 'Cowboys', decade: '2000s',
    stats: { tackles: 62, sacks: 20, coverageGrade: 75 },
    score: 93,
  },

  // ─── DTs / DEs / LBs — 2010s (Round 8 pool) ──────────────────────────────
  {
    id: 'jj-watt',
    name: 'J.J. Watt',
    position: 'DE', team: 'Texans', decade: '2010s',
    stats: { sacks: 20.5, pressures: 65 },
    score: 97,
  },
  {
    id: 'aaron-donald',
    name: 'Aaron Donald',
    position: 'DT', team: 'Rams', decade: '2010s',
    stats: { sacks: 20.5, pressures: 56 },
    score: 99,
  },
  {
    id: 'von-miller',
    name: 'Von Miller',
    position: 'LB', team: 'Broncos', decade: '2010s',
    stats: { tackles: 60, sacks: 18.5, coverageGrade: 78 },
    score: 92,
  },
  {
    id: 'tj-watt',
    name: 'T.J. Watt',
    position: 'LB', team: 'Steelers', decade: '2010s',
    stats: { tackles: 54, sacks: 22.5, coverageGrade: 82 },
    score: 96,
  },

  // ─── CBs / Ss — 1980s (X Factor pool) ────────────────────────────────────
  {
    id: 'ronnie-lott',
    name: 'Ronnie Lott',
    position: 'S', team: '49ers', decade: '1980s',
    stats: { defInterceptions: 10, passBreakups: 15, coverageGrade: 93 },
    score: 97,
  },
  {
    id: 'lester-hayes',
    name: 'Lester Hayes',
    position: 'CB', team: 'Raiders', decade: '1980s',
    stats: { defInterceptions: 13, passBreakups: 28, coverageGrade: 97 },
    score: 91,
  },
  {
    id: 'mel-blount',
    name: 'Mel Blount',
    position: 'CB', team: 'Steelers', decade: '1980s',
    stats: { defInterceptions: 11, passBreakups: 18, coverageGrade: 96 },
    score: 92,
  },
  {
    id: 'ken-houston',
    name: 'Ken Houston',
    position: 'S', team: 'Redskins', decade: '1980s',
    stats: { defInterceptions: 9, passBreakups: 15, coverageGrade: 90 },
    score: 88,
  },

  // ─── CBs / Ss — 1990s (X Factor pool) ────────────────────────────────────
  {
    id: 'deion-sanders',
    name: 'Deion Sanders',
    position: 'CB', team: '49ers', decade: '1990s',
    stats: { defInterceptions: 6, passBreakups: 20, coverageGrade: 99 },
    score: 99,
  },
  {
    id: 'rod-woodson',
    name: 'Rod Woodson',
    position: 'CB', team: 'Steelers', decade: '1990s',
    stats: { defInterceptions: 11, passBreakups: 22, coverageGrade: 96 },
    score: 95,
  },
  {
    id: 'eric-allen',
    name: 'Eric Allen',
    position: 'CB', team: 'Eagles', decade: '1990s',
    stats: { defInterceptions: 8, passBreakups: 18, coverageGrade: 88 },
    score: 84,
  },
  {
    id: 'darrell-green',
    name: 'Darrell Green',
    position: 'CB', team: 'Redskins', decade: '1990s',
    stats: { defInterceptions: 7, passBreakups: 16, coverageGrade: 90 },
    score: 85,
  },
  {
    id: 'aeneas-williams',
    name: 'Aeneas Williams',
    position: 'CB', team: 'Cardinals', decade: '1990s',
    stats: { defInterceptions: 9, passBreakups: 20, coverageGrade: 93 },
    score: 88,
  },

  // ─── CBs / Ss — 2000s (X Factor pool) ────────────────────────────────────
  {
    id: 'charles-woodson',
    name: 'Charles Woodson',
    position: 'CB', team: 'Packers', decade: '2000s',
    stats: { defInterceptions: 9, passBreakups: 20, coverageGrade: 95 },
    score: 91,
  },
  {
    id: 'ed-reed',
    name: 'Ed Reed',
    position: 'S', team: 'Ravens', decade: '2000s',
    stats: { defInterceptions: 9, passBreakups: 15, coverageGrade: 92 },
    score: 96,
  },
  {
    id: 'champ-bailey',
    name: 'Champ Bailey',
    position: 'CB', team: 'Broncos', decade: '2000s',
    stats: { defInterceptions: 2, passBreakups: 20, coverageGrade: 93 },
    score: 88,
  },
  {
    id: 'brian-dawkins',
    name: 'Brian Dawkins',
    position: 'S', team: 'Eagles', decade: '2000s',
    stats: { defInterceptions: 4, passBreakups: 16, coverageGrade: 90 },
    score: 88,
  },
  {
    id: 'john-lynch',
    name: 'John Lynch',
    position: 'S', team: 'Buccaneers', decade: '2000s',
    stats: { defInterceptions: 4, passBreakups: 12, coverageGrade: 87 },
    score: 82,
  },

  // ─── CBs / Ss — 2010s (Round 5 pool) ─────────────────────────────────────
  {
    id: 'troy-polamalu',
    name: 'Troy Polamalu',
    position: 'S', team: 'Steelers', decade: '2010s',
    stats: { defInterceptions: 7, passBreakups: 10, coverageGrade: 93 },
    score: 93,
  },
  {
    id: 'richard-sherman',
    name: 'Richard Sherman',
    position: 'CB', team: 'Seahawks', decade: '2010s',
    stats: { defInterceptions: 8, passBreakups: 24, coverageGrade: 97 },
    score: 94,
  },
  {
    id: 'darrelle-revis',
    name: 'Darrelle Revis',
    position: 'CB', team: 'Jets', decade: '2010s',
    stats: { defInterceptions: 1, passBreakups: 22, coverageGrade: 99 },
    score: 95,
  },
];
