/**
 * Rigged in the player's favour on purpose — this is a novelty simulator,
 * not a casino. ~85% win rate with a rare (~5%) jackpot multiplier.
 */
export type Outcome = { won: boolean; multiplier: number; jackpot: boolean };

export function rollOutcome(winRate = 0.85): Outcome {
  const r = Math.random();
  if (r > winRate) return { won: false, multiplier: 0, jackpot: false };
  const j = Math.random();
  if (j < 0.05) return { won: true, multiplier: 12 + Math.random() * 38, jackpot: true };
  if (j < 0.3) return { won: true, multiplier: 2.5 + Math.random() * 3, jackpot: false };
  return { won: true, multiplier: 1.4 + Math.random() * 1, jackpot: false };
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}