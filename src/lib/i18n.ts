export type LangCode = "en" | "zh" | "es" | "ar" | "fr" | "ru" | "pt" | "ja" | "ko" | "hi";

export const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "ru", label: "Русский" },
  { code: "pt", label: "Português" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "hi", label: "हिन्दी" },
];

export const en = {
  brand: "Billionaire Speedrun",
  tagline: "A completely fake fortune, built at speed.",
  casino: "Casino",
  vault: "Vault",
  empire: "Empire",
  balance: "Balance",
  netWorth: "Net worth",
  about: "About & FAQ",
  play: "Play",
  spin: "Spin",
  bet: "Bet",
  playAgain: "Play again",
  toVault: "Cash out to Vault",
  close: "Close",
  youWon: "You won",
  youLost: "House got lucky",
  betSize: "Bet size",
  easyMoney: "Easy Money",
  easyMoneyDesc: "No casino knowledge required. Tap, win, repeat.",
  signature: "Signature Spectacle",
  signatureDesc: "The main event. Loud, shiny, absurd.",
  classics: "High-Roller Classics",
  classicsDesc: "For people who know what a croupier is.",
  addToEmpire: "Add to Empire",
  winMoreFirst: "Win more first 💰",
  owned: "Owned",
  all: "All",
  reset: "Reset my empire",
  resetConfirm: "This wipes your fake fortune and every fake possession. Sure?",
  gamesPlayed: "Games played",
  winStreak: "Win streak",
  biggestWin: "Biggest single win",
  itemsOwned: "Items owned",
  emptyEmpire: "Your empire is embarrassingly empty. Go win something.",
  disclaimer:
    "Free novelty simulator. All currency is fictional. No real wagers, no real purchases, nothing to withdraw. Not affiliated with any real casino or luxury brand.",
  currency: "Currency",
  language: "Language",
  faqTitle: "About & FAQ",
  ratesNote: "Prices and exchange rates are for entertainment only and are not real-time.",
};

export type StringKey = keyof typeof en;

// Other languages ship with the same keys, stubbed to English until translated.
const stub = (): typeof en => ({ ...en });

export const dictionaries: Record<LangCode, typeof en> = {
  en,
  zh: stub(),
  es: stub(),
  ar: stub(),
  fr: stub(),
  ru: stub(),
  pt: stub(),
  ja: stub(),
  ko: stub(),
  hi: stub(),
};

export const FAQ = [
  {
    q: "Is this a real casino or payment app?",
    a: "No. Fictional currency only — there is nothing to deposit, wager, or withdraw. Ever.",
  },
  {
    q: "Can I actually buy any of these items?",
    a: "No. The Vault is a fantasy catalog. Nothing ships. Your imaginary jet has imaginary landing rights.",
  },
  {
    q: "Do I need an account?",
    a: "No signup. Your empire lives in your browser's localStorage and nowhere else.",
  },
  {
    q: "Is this affiliated with any real casino, brand, or luxury house?",
    a: "No. Every item, coin, and horse here is invented. Any resemblance to real opulence is satire.",
  },
  {
    q: "Are the prices real?",
    a: "Prices and exchange rates are for entertainment only and are not real-time.",
  },
];