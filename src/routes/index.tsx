import { createFileRoute } from "@tanstack/react-router";
import { useState, type ComponentType } from "react";
import { AppShell } from "@/components/AppShell";
import { CoinFlip, GoldenWheel, ScratchCards, VaultBoxes } from "@/components/games/EasyGames";
import { HorseRacing, MemeCoin, Slots } from "@/components/games/SignatureGames";
import { CardTable, Roulette } from "@/components/games/ClassicGames";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Billionaire Speedrun — Fake Fortune, Real Dopamine" },
      {
        name: "description",
        content:
          "A free, no-signup novelty simulator: play rigged fake-money casino games, inflate an imaginary net worth, then blow it in a fantasy luxury vault.",
      },
      { property: "og:title", content: "Billionaire Speedrun — Fake Fortune, Real Dopamine" },
      {
        property: "og:description",
        content: "A free, no-signup novelty simulator: play rigged fake-money casino games, inflate an imaginary net worth, then blow it in a fantasy luxury vault.",
      },
    ],
  }),
  component: CasinoPage,
});

type GameDef = {
  key: string;
  name: string;
  blurb: string;
  emoji: string;
  tag?: string;
  Component: ComponentType<{ open: boolean; onOpenChange: (v: boolean) => void }>;
};

const TIERS: { title: string; desc: string; games: GameDef[] }[] = [
  {
    title: "Easy Money",
    desc: "No casino knowledge required. Tap, win, repeat.",
    games: [
      { key: "scratch", name: "Diamond Scratch Cards", blurb: "Three panels, one smug grin.", emoji: "💎", tag: "Instant win", Component: ScratchCards },
      { key: "wheel", name: "Golden Wheel of Fortune", blurb: "One tap, up to 25×.", emoji: "🎡", tag: "Up to 25×", Component: GoldenWheel },
      { key: "coin", name: "Double-or-Nothing Flip", blurb: "Heads or tails, mostly heads.", emoji: "🪙", tag: "One tap", Component: CoinFlip },
      { key: "boxes", name: "Mystery Vault Boxes", blurb: "Four doors, all of them pay.", emoji: "🚪", tag: "Always pays", Component: VaultBoxes },
    ],
  },
  {
    title: "Signature Spectacle",
    desc: "The main event. Loud, shiny, absurd.",
    games: [
      { key: "slots", name: "High-Roller Slots", blurb: "Jets, diamonds, cascading wins.", emoji: "🎰", tag: "Jackpot", Component: Slots },
      { key: "horses", name: "VIP Horse Racing", blurb: "Six seconds of thunderous nonsense.", emoji: "🏇", tag: "Live-ish", Component: HorseRacing },
      { key: "coins", name: "Meme Coin Desk", blurb: "Ape in, cash out at the top.", emoji: "📈", tag: "Volatile", Component: MemeCoin },
    ],
  },
  {
    title: "High-Roller Classics",
    desc: "For people who know what a croupier is.",
    games: [
      { key: "roulette", name: "Private Club Roulette", blurb: "Single zero and a boosted all-in.", emoji: "🔴", tag: "Table", Component: Roulette },
      { key: "cards", name: "Baccarat & Blackjack", blurb: "One hand. Dealer busts a lot.", emoji: "🃏", tag: "Table", Component: CardTable },
    ],
  },
];

function CasinoPage() {
  const [openGame, setOpenGame] = useState<string | null>(null);

  return (
    <AppShell>
      <section className="surface-lux relative overflow-hidden bg-[radial-gradient(120%_140%_at_100%_0%,oklch(0.64_0.22_328/0.22),transparent_55%),radial-gradient(90%_120%_at_0%_100%,oklch(0.72_0.093_85.5/0.18),transparent_60%)] p-6 text-center sm:text-left">
        <img
          src={logo}
          alt="Billionaire Speedrun crowned diamond logo"
          width={816}
          height={816}
          className="mx-auto size-24 object-contain drop-shadow-[0_0_28px_oklch(0.64_0.22_328/0.45)] sm:absolute sm:top-4 sm:right-5 sm:size-32"
        />
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-obsidian/50 px-3 py-1 text-[10px] tracking-[0.3em] text-gold uppercase sm:mt-0">
          <span className="size-1.5 animate-pulse rounded-full bg-gold-bright" />
          Welcome bonus · 10,000 fake chips
        </p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight sm:max-w-lg sm:text-5xl">
          Get obscenely rich.{" "}
          <span className="text-gradient-lux">None of it is real.</span>
        </h1>
        <p className="mt-3 max-w-lg text-sm text-silver">
          Free, no signup, no deposits, nothing to withdraw. The games are rigged in your favour on
          purpose — that's the entire joke.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
          {["Instant play", "No signup", "90% rigged to win", "24/7 nonsense"].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border bg-obsidian/60 px-3 py-1 text-[11px] text-silver"
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      {TIERS.map((tier) => (
        <section key={tier.title} className="mt-8">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-gradient-to-b from-gold-bright to-orchid" />
            <div className="min-w-0">
              <h2 className="font-display text-2xl leading-tight">{tier.title}</h2>
              <p className="text-xs text-silver">{tier.desc}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {tier.games.map((g) => (
              <button
                key={g.key}
                onClick={() => setOpenGame(g.key)}
                className="group surface relative overflow-hidden p-0 text-left transition-transform active:scale-[0.98] hover:border-gold/50"
              >
                <span className="relative grid h-24 place-items-center bg-[radial-gradient(80%_100%_at_50%_0%,oklch(0.72_0.093_85.5/0.28),transparent_70%),linear-gradient(160deg,oklch(0.25_0.06_170/0.6),transparent)] text-4xl sm:h-28 sm:text-5xl">
                  <span className="transition-transform duration-300 group-hover:scale-110">{g.emoji}</span>
                  {g.tag && (
                    <span className="absolute top-2 left-2 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold tracking-wider text-obsidian uppercase">
                      {g.tag}
                    </span>
                  )}
                </span>
                <span className="block border-t border-border p-3">
                  <span className="block truncate font-display text-sm text-platinum sm:text-base">{g.name}</span>
                  <span className="block truncate text-[11px] text-silver">{g.blurb}</span>
                  <span className="mt-2 block rounded-full bg-gold py-1.5 text-center text-[11px] font-bold text-obsidian transition-colors group-hover:bg-gold-bright">
                    Play now
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      {TIERS.flatMap((t) => t.games).map(({ key, Component }) => (
        <Component
          key={key}
          open={openGame === key}
          onOpenChange={(v) => setOpenGame(v ? key : null)}
        />
      ))}
    </AppShell>
  );
}
