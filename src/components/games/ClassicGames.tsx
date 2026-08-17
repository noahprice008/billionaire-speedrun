import { useState } from "react";
import { GameShell, PlayButton, type GameBodyProps } from "./GameShell";
import { pick, randInt, rollOutcome } from "@/lib/rng";
import { Money } from "@/components/Money";
import { cn } from "@/lib/utils";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

/* ---------------- Private Club Roulette ---------------- */

const BETS = [
  { id: "red", label: "Red", mult: 2 },
  { id: "black", label: "Black", mult: 2 },
  { id: "odd", label: "Odd", mult: 2 },
  { id: "even", label: "Even", mult: 2 },
  { id: "dozen", label: "1st Dozen", mult: 3 },
  { id: "straight", label: "Straight Up 7", mult: 36 },
] as const;

function RouletteBody({ bet, settle, busy }: GameBodyProps) {
  const [spinning, setSpinning] = useState(false);
  const [ball, setBall] = useState<number | null>(null);

  const play = (mult: number, allIn = false) => {
    if (spinning || busy) return;
    const o = rollOutcome(allIn ? 0.8 : 0.86);
    setSpinning(true);
    setTimeout(() => {
      setBall(o.won ? (mult === 36 ? 7 : randInt(1, 36)) : randInt(0, 36));
      setSpinning(false);
      const payout = allIn ? (o.jackpot ? 20 : 3) : o.jackpot ? mult * 2 : mult - 1 + 0.4;
      settle(o.won, payout, allIn ? "All-in on a single-zero wheel. Reckless. Rewarded." : undefined);
    }, 2400);
  };

  return (
    <div className="space-y-4">
      <div className="grid place-items-center py-2">
        <div
          className="grid size-32 place-items-center rounded-full border-4 border-gold/60 bg-emerald-deep font-display text-3xl text-platinum"
          style={{
            transition: "transform 2.3s cubic-bezier(0.15,0.9,0.2,1)",
            transform: spinning ? "rotate(1440deg)" : "rotate(0deg)",
          }}
        >
          {spinning ? "•" : (ball ?? "0")}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {BETS.map((b) => (
          <button
            key={b.id}
            onClick={() => play(b.mult)}
            disabled={spinning || busy}
            className="rounded-lg border border-border py-2 text-[11px] text-silver hover:text-platinum disabled:opacity-40"
          >
            {b.label}
            <span className="block text-gold">{b.mult}×</span>
          </button>
        ))}
      </div>
      <PlayButton onClick={() => play(3, true)} disabled={spinning || busy} label="ALL-IN (boosted)" />
      <p className="text-center text-xs text-silver">
        Single-zero wheel. Staking <Money usd={bet} short />.
      </p>
    </div>
  );
}

export function Roulette(p: Props) {
  return (
    <GameShell {...p} title="Private Club Roulette" subtitle="Single zero, velvet rope, imaginary croupier.">
      {(b) => <RouletteBody {...b} />}
    </GameShell>
  );
}

/* ---------------- Baccarat & Blackjack ---------------- */

const CARDS = ["A", "K", "Q", "J", "10", "9", "8", "7"];

function CardBody({ bet, settle, busy }: GameBodyProps) {
  const [mode, setMode] = useState<"blackjack" | "baccarat">("blackjack");
  const [hand, setHand] = useState<string[]>([]);
  const [dealer, setDealer] = useState<string[]>([]);
  const [dealing, setDealing] = useState(false);

  const deal = () => {
    if (dealing || busy) return;
    const o = rollOutcome(0.86);
    setDealing(true);
    setHand([pick(CARDS), pick(CARDS)]);
    setDealer([pick(CARDS), "🂠"]);
    setTimeout(() => {
      setDealer([pick(CARDS), pick(CARDS), ...(o.won ? [pick(CARDS)] : [])]);
      setDealing(false);
      settle(
        o.won,
        o.jackpot ? o.multiplier : mode === "baccarat" ? 1.95 : 2.1,
        o.jackpot
          ? "Natural, then the dealer busts spectacularly. Chandelier trembles."
          : o.won
            ? mode === "blackjack"
              ? "Dealer busts. Dealer is fictional. Dealer is fine."
              : "Banker folds like a napkin."
            : undefined,
      );
    }, 1600);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["blackjack", "baccarat"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs capitalize",
              mode === m ? "border-gold bg-accent text-gold-bright" : "border-border text-silver",
            )}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="space-y-3 rounded-xl border border-gold/25 bg-emerald-deep/30 p-4">
        <div>
          <div className="mb-1 text-[10px] tracking-widest text-silver uppercase">Dealer</div>
          <div className="flex gap-2">
            {(dealer.length ? dealer : ["🂠", "🂠"]).map((c, i) => (
              <span
                key={i}
                className="animate-win-pop grid h-16 w-11 place-items-center rounded border border-gold/40 bg-charcoal font-display text-lg"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[10px] tracking-widest text-silver uppercase">You</div>
          <div className="flex gap-2">
            {(hand.length ? hand : ["🂠", "🂠"]).map((c, i) => (
              <span
                key={i}
                className="animate-win-pop grid h-16 w-11 place-items-center rounded border border-gold/40 bg-charcoal font-display text-lg"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <PlayButton onClick={deal} disabled={dealing || busy} label={dealing ? "Dealing…" : "Deal"} />
      <p className="text-center text-xs text-silver">
        Chips denominated in <Money usd={bet} short /> because subtlety is dead.
      </p>
    </div>
  );
}

export function CardTable(p: Props) {
  return (
    <GameShell {...p} title="High-Stakes Baccarat & Blackjack" subtitle="One hand, one dealer, zero skill required.">
      {(b) => <CardBody {...b} />}
    </GameShell>
  );
}