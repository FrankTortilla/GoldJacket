// Daily challenge — date-based seed generation

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

function dateToSeed(yyyymmdd: string): string {
  let hash = 0;
  for (let i = 0; i < yyyymmdd.length; i++) {
    hash = (hash * 31 + yyyymmdd.charCodeAt(i)) >>> 0;
  }
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += CHARS[hash % CHARS.length];
    hash = (hash * 1664525 + 1013904223) >>> 0;
  }
  return result;
}

function todayString(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

export function getDailySeed(): string {
  return dateToSeed(todayString());
}

export function isDailyChallenge(seed: string): boolean {
  return seed === getDailySeed();
}
