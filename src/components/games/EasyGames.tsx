import { useState } from "react";
import { GameShell, PlayButton, type GameBodyProps } from "./GameShell";
import { rollOutcome, pick } from "@/lib/rng";
import { Money } from "@/components/Money";
import { cn } from "@/lib/utils";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

/* ---------------- Diamond Scratch Cards ---------------- */

function ScratchBody({ bet, settle, busy }: GameBodyProps) {
  const [panels, setPanels] = useState<(string | null)[]>([null, null, null]);
  const [outcome, setOutcome] = useState(() => rollOutcome());

  const symbols = outcome.won ? ["💎", "💎", "💎"] : ["💎", "💎", "🥀"];
  const faces = outcome.jackpot ? ["👑", "👑", "👑"] : symbols;

  const reveal = (i: number) => {
    if (busy || panels[i]) return;
    const next = [...panels];
    next[i] = faces[i]!;
    setPanels(next);
    if (next.every(Boolean)) {
      setTimeout(() => {
        settle(
          outcome.won,
          outcome.multiplier,
          outcome.jackpot ? "Three crowns. The card is now a collector's item." : undefined,
        );
        setPanels([null, null, null]);
        setOutcome(rollOutcome());
      }, 550);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {panels.map((p, i) => (
          <button
            key={i}
            onClick={() => reveal(i)}
            className={cn(
              "grid aspect-square place-items-center rounded-xl border text-4xl transition-transform active:scale-95",
              p
                ? "animate-win-pop border-gold bg-accent"
                : "border-border bg-emerald-deep/40 text-silver",
            )}
          >
            {p ?? "✦"}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-silver">
        Tap all three panels. Staking <Money usd={bet} short />.
      </p>
    </div>
  );
}

export function ScratchCards(p: Props) {
  return (
    <GameShell
      {...p}
      title="Diamond Scratch Cards"
      subtitle="Tap three panels. The odds are, frankly, insulting to the house."
    >
      {(b) => <ScratchBody {...b} />}
    </GameShell>
  );
}

/* ---------------- Golden Wheel ---------------- */

const SEGMENTS = [1.5, 2, 0, 3, 1.8, 25, 2.5, 4];

function WheelBody({ bet, settle, busy }: GameBodyProps) {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning || busy) return;
    const o = rollOutcome();
    const target = o.won ? (o.jackpot ? 5 : pick([0, 1, 3, 4, 6, 7])) : 2;
    const seg = 360 / SEGMENTS.length;
    const final = 360 * 5 + (360 - target * seg - seg / 2);
    setSpinning(true);
    setAngle((a) => a + final);
    setTimeout(() => {
      setSpinning(false);
      settle(o.won, o.jackpot ? 25 : o.multiplier, o.jackpot ? "The 25× wedge. Nobody hits that." : undefined);
    }, 3400);
  };

  return (
    <div className="space-y-5">
      <div className="relative mx-auto size-56">
        <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 text-2xl text-gold">▼</div>
        <div
          className="size-56 rounded-full border-4 border-gold/60"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: "transform 3.3s cubic-bezier(0.15, 0.9, 0.2, 1.02)",
            background: `conic-gradient(${SEGMENTS.map((s, i) => {
              const c = s === 0 ? "#0F3D3E" : s >= 10 ? "#7A1F2B" : i % 2 ? "#C9A356" : "#17171D";
              const seg = 100 / SEGMENTS.length;
              return `${c} ${i * seg}% ${(i + 1) * seg}%`;
            }).join(",")})`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="grid size-16 place-items-center rounded-full border border-gold/50 bg-charcoal font-display text-xs text-gold">
            SPIN
          </div>
        </div>
      </div>
      <PlayButton onClick={spin} disabled={spinning || busy} label={spinning ? "Spinning…" : "Spin"} />
      <p className="text-center text-xs text-silver">
        Wedges pay 1.5× to 25×. Staking <Money usd={bet} short />.
      </p>
    </div>
  );
}

export function GoldenWheel(p: Props) {
  return (
    <GameShell {...p} title="Golden Wheel of Fortune" subtitle="One tap. Physics does the rest.">
      {(b) => <WheelBody {...b} />}
    </GameShell>
  );
}

/* ---------------- Coin Flip ---------------- */

function CoinBody({ bet, settle, busy }: GameBodyProps) {
  const [flipping, setFlipping] = useState(false);
  const [face, setFace] = useState<"H" | "T">("H");

  const flip = (choice: "H" | "T") => {
    if (flipping || busy) return;
    const o = rollOutcome(0.87);
    setFlipping(true);
    setTimeout(() => {
      setFace(o.won ? choice : choice === "H" ? "T" : "H");
      setFlipping(false);
      settle(o.won, o.jackpot ? 8 : 2, o.jackpot ? "Landed on its edge. Paying 8× out of respect." : undefined);
    }, 1300);
  };

  return (
    <div className="space-y-5">
      <div className="grid place-items-center py-4">
        <div
          className="grid size-28 place-items-center rounded-full border-4 border-gold bg-gradient-to-b from-gold-bright to-gold font-display text-3xl text-obsidian"
          style={{
            transition: "transform 1.2s cubic-bezier(0.2,0.8,0.2,1)",
            transform: flipping ? "rotateY(1800deg) scale(1.1)" : "rotateY(0deg)",
          }}
        >
          {face === "H" ? "♛" : "♞"}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => flip("H")}
          disabled={flipping || busy}
          className="rounded-full bg-gold py-3 font-semibold text-obsidian disabled:opacity-40"
        >
          Heads ♛
        </button>
        <button
          onClick={() => flip("T")}
          disabled={flipping || busy}
          className="rounded-full border border-gold/50 py-3 font-semibold text-gold disabled:opacity-40"
        >
          Tails ♞
        </button>
      </div>
      <p className="text-center text-xs text-silver">
        Double or nothing on <Money usd={bet} short />.
      </p>
    </div>
  );
}

export function CoinFlip(p: Props) {
  return (
    <GameShell {...p} title="Double-or-Nothing Coin Flip" subtitle="A gold coin with suspiciously good manners.">
      {(b) => <CoinBody {...b} />}
    </GameShell>
  );
}

/* ---------------- Mystery Vault Boxes ---------------- */

function BoxesBody({ bet, settle, busy }: GameBodyProps) {
  const [opened, setOpened] = useState<number | null>(null);

  const openDoor = (i: number) => {
    if (opened !== null || busy) return;
    setOpened(i);
    const o = rollOutcome(1); // every door pays, some more than others
    setTimeout(() => {
      settle(true, o.jackpot ? o.multiplier : Math.max(1.1, o.multiplier * 0.8), o.jackpot
        ? "Door was full of bullion. Genuinely unfair."
        : "Every door pays here. That's the whole gimmick.");
      setOpened(null);
    }, 900);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => openDoor(i)}
            className={cn(
              "grid aspect-[3/4] place-items-center rounded-lg border text-3xl transition-all duration-500",
              opened === i
                ? "border-gold bg-accent [transform:rotateY(35deg)]"
                : "border-border bg-emerald-deep/40",
            )}
          >
            {opened === i ? "💰" : "🚪"}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-silver">
        Pick a door. All four pay. Staking <Money usd={bet} short />.
      </p>
    </div>
  );
}

export function VaultBoxes(p: Props) {
  return (
    <GameShell {...p} title="Mystery Vault Boxes" subtitle="Four doors. Zero disappointment. Suspicious.">
      {(b) => <BoxesBody {...b} />}
    </GameShell>
  );
}