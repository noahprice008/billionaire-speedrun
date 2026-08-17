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
  Component: ComponentType<{ open: boolean; onOpenChange: (v: boolean) => void }>;
};

const TIERS: { title: string; desc: string; games: GameDef[] }[] = [
  {
    title: "Easy Money",
    desc: "No casino knowledge required. Tap, win, repeat.",
    games: [
      { key: "scratch", name: "Diamond Scratch Cards", blurb: "Three panels, one smug grin.", emoji: "💎", Component: ScratchCards },
      { key: "wheel", name: "Golden Wheel of Fortune", blurb: "One tap, up to 25×.", emoji: "🎡", Component: GoldenWheel },
      { key: "coin", name: "Double-or-Nothing Flip", blurb: "Heads or tails, mostly heads.", emoji: "🪙", Component: CoinFlip },
      { key: "boxes", name: "Mystery Vault Boxes", blurb: "Four doors, all of them pay.", emoji: "🚪", Component: VaultBoxes },
    ],
  },
  {
    title: "Signature Spectacle",
    desc: "The main event. Loud, shiny, absurd.",
    games: [
      { key: "slots", name: "High-Roller Slots", blurb: "Jets, diamonds, cascading wins.", emoji: "🎰", Component: Slots },
      { key: "horses", name: "VIP Horse Racing", blurb: "Six seconds of thunderous nonsense.", emoji: "🏇", Component: HorseRacing },
      { key: "coins", name: "Meme Coin Desk", blurb: "Ape in, cash out at the top.", emoji: "📈", Component: MemeCoin },
    ],
  },
  {
    title: "High-Roller Classics",
    desc: "For people who know what a croupier is.",
    games: [
      { key: "roulette", name: "Private Club Roulette", blurb: "Single zero and a boosted all-in.", emoji: "🔴", Component: Roulette },
      { key: "cards", name: "Baccarat & Blackjack", blurb: "One hand. Dealer busts a lot.", emoji: "🃏", Component: CardTable },
    ],
  },
];

function CasinoPage() {
  const [openGame, setOpenGame] = useState<string | null>(null);

  return (
    <AppShell>
      <section className="surface-lux relative overflow-hidden p-6 text-center sm:text-left">
        <img
          src={logo}
          alt="Billionaire Speedrun crowned diamond logo"
          width={816}
          height={816}
          className="mx-auto size-24 object-contain drop-shadow-[0_0_28px_oklch(0.64_0.22_328/0.45)] sm:absolute sm:top-4 sm:right-5 sm:size-32"
        />
        <p className="mt-3 text-[10px] tracking-[0.35em] text-orchid uppercase sm:mt-0">
          Billionaire Speedrun
        </p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight sm:max-w-lg sm:text-5xl">
          Get obscenely rich.{" "}
          <span className="text-gradient-lux">None of it is real.</span>
        </h1>
        <p className="mt-3 max-w-lg text-sm text-silver">
          Free, no signup, no deposits, nothing to withdraw. The games are rigged in your favour on
          purpose — that's the entire joke.
        </p>
      </section>

      {TIERS.map((tier) => (
        <section key={tier.title} className="mt-8">
          <h2 className="font-display text-2xl">{tier.title}</h2>
          <p className="text-xs text-silver">{tier.desc}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tier.games.map((g) => (
              <button
                key={g.key}
                onClick={() => setOpenGame(g.key)}
                className="surface flex items-center gap-4 p-4 text-left transition-transform active:scale-[0.99] hover:border-gold/40"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald-deep/40 text-2xl">
                  {g.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-base text-platinum">{g.name}</span>
                  <span className="block text-xs text-silver">{g.blurb}</span>
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
