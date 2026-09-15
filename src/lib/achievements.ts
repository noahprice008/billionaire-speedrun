export type AchievementMetrics = {
  netWorth: number;
  balance: number;
  gamesPlayed: number;
  winStreak: number;
  bestStreak: number;
  biggestWin: number;
  itemsOwned: number;
  totalSpent: number;
  bonusStreak: number;
  rareOwned: number;
};

export type Achievement = {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  reward: number;
  test: (m: AchievementMetrics) => boolean;
};

/** Purely cosmetic milestones with a small fake-chip reward. */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-spin",
    name: "First Taste",
    desc: "Play your very first game.",
    emoji: "🎲",
    reward: 5_000,
    test: (m) => m.gamesPlayed >= 1,
  },
  {
    id: "ten-games",
    name: "Warmed Up",
    desc: "Play 10 games.",
    emoji: "🔥",
    reward: 25_000,
    test: (m) => m.gamesPlayed >= 10,
  },
  {
    id: "fifty-games",
    name: "Certified Degenerate",
    desc: "Play 50 games.",
    emoji: "🃏",
    reward: 250_000,
    test: (m) => m.gamesPlayed >= 50,
  },
  {
    id: "streak-5",
    name: "On A Heater",
    desc: "Win 5 games in a row.",
    emoji: "🌡️",
    reward: 100_000,
    test: (m) => m.bestStreak >= 5,
  },
  {
    id: "streak-10",
    name: "The House Is Sweating",
    desc: "Win 10 games in a row.",
    emoji: "😰",
    reward: 500_000,
    test: (m) => m.bestStreak >= 10,
  },
  {
    id: "streak-20",
    name: "Suspiciously Lucky",
    desc: "Win 20 games in a row.",
    emoji: "🕶️",
    reward: 2_500_000,
    test: (m) => m.bestStreak >= 20,
  },
  {
    id: "win-1m",
    name: "Seven Figures, One Tap",
    desc: "Land a single win over $1M.",
    emoji: "💥",
    reward: 250_000,
    test: (m) => m.biggestWin >= 1_000_000,
  },
  {
    id: "win-100m",
    name: "Obscene Single Hand",
    desc: "Land a single win over $100M.",
    emoji: "🎇",
    reward: 10_000_000,
    test: (m) => m.biggestWin >= 100_000_000,
  },
  {
    id: "nw-1m",
    name: "Millionaire",
    desc: "Reach a fictional net worth of $1M.",
    emoji: "💵",
    reward: 50_000,
    test: (m) => m.netWorth >= 1_000_000,
  },
  {
    id: "nw-100m",
    name: "Yacht Money",
    desc: "Reach a fictional net worth of $100M.",
    emoji: "🛥️",
    reward: 5_000_000,
    test: (m) => m.netWorth >= 100_000_000,
  },
  {
    id: "nw-1b",
    name: "Billionaire Speedrun Complete",
    desc: "Reach a fictional net worth of $1B.",
    emoji: "👑",
    reward: 100_000_000,
    test: (m) => m.netWorth >= 1_000_000_000,
  },
  {
    id: "nw-1t",
    name: "Economically Unreasonable",
    desc: "Reach a fictional net worth of $1T.",
    emoji: "🪐",
    reward: 10_000_000_000,
    test: (m) => m.netWorth >= 1_000_000_000_000,
  },
  {
    id: "first-buy",
    name: "Retail Therapy",
    desc: "Buy your first Vault item.",
    emoji: "🛍️",
    reward: 25_000,
    test: (m) => m.itemsOwned >= 1,
  },
  {
    id: "ten-items",
    name: "Collector",
    desc: "Own 10 Vault items.",
    emoji: "🏛️",
    reward: 500_000,
    test: (m) => m.itemsOwned >= 10,
  },
  {
    id: "rare-item",
    name: "Rare Air",
    desc: "Own a rare, limited Vault piece.",
    emoji: "🔻",
    reward: 1_000_000,
    test: (m) => m.rareOwned >= 1,
  },
  {
    id: "spend-100m",
    name: "Spend It Like You Hate It",
    desc: "Spend $100M in the Vault.",
    emoji: "💸",
    reward: 5_000_000,
    test: (m) => m.totalSpent >= 100_000_000,
  },
  {
    id: "bonus-3",
    name: "Loyal Regular",
    desc: "Claim the daily bonus 3 days in a row.",
    emoji: "📅",
    reward: 100_000,
    test: (m) => m.bonusStreak >= 3,
  },
  {
    id: "bonus-7",
    name: "House Favourite",
    desc: "Claim the daily bonus 7 days in a row.",
    emoji: "🎖️",
    reward: 1_000_000,
    test: (m) => m.bonusStreak >= 7,
  },
];

export const dailyBonusAmount = (streakDay: number) =>
  Math.round(10_000 * Math.pow(1.8, Math.max(0, Math.min(streakDay, 7) - 1)));

export const todayKey = () => new Date().toISOString().slice(0, 10);

export function daysBetween(a: string, b: string) {
  const ms = Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}
