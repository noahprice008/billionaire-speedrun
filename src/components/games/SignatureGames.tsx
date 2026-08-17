import { useEffect, useRef, useState } from "react";
import { GameShell, PlayButton, type GameBodyProps } from "./GameShell";
import { pick, randInt, rollOutcome } from "@/lib/rng";
import { Money } from "@/components/Money";
import { cn } from "@/lib/utils";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

/* ---------------- High-Roller Slots ---------------- */

const SYMBOLS = ["💎", "🏎️", "🛩️", "👑", "🥂", "🪙"];

function SlotsBody({ bet, settle, busy }: GameBodyProps) {
  const [reels, setReels] = useState(["💎", "🏎️", "🛩️"]);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning || busy) return;
    const o = rollOutcome();
    setSpinning(true);
    const iv = setInterval(() => setReels([pick(SYMBOLS), pick(SYMBOLS), pick(SYMBOLS)]), 80);
    setTimeout(() => {
      clearInterval(iv);
      const s = pick(SYMBOLS);
      setReels(o.won ? [s, s, s] : [s, s, pick(SYMBOLS.filter((x) => x !== s))]);
      setSpinning(false);
      settle(
        o.won,
        o.multiplier,
        o.jackpot ? "CASCADING JACKPOT. The machine is now legally your dependant." : undefined,
      );
    }, 1900);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-gold/30 bg-emerald-deep/30 p-3">
        {reels.map((r, i) => (
          <div
            key={i}
            className="grid aspect-square place-items-center rounded-lg bg-obsidian text-5xl"
            style={{
              transition: "transform 300ms cubic-bezier(0.15,1.3,0.4,1)",
              transform: spinning ? "translateY(-6px) scale(1.04)" : "none",
            }}
          >
            {r}
          </div>
        ))}
      </div>
      <PlayButton onClick={spin} disabled={spinning || busy} label={spinning ? "Reels rolling…" : "Spin"} />
      <p className="text-center text-xs text-silver">
        Three of a kind pays big. Staking <Money usd={bet} short />.
      </p>
    </div>
  );
}

export function Slots(p: Props) {
  return (
    <GameShell {...p} title="High-Roller Slots" subtitle="Diamonds, supercars, jets. No fruit. Ever.">
      {(b) => <SlotsBody {...b} />}
    </GameShell>
  );
}

/* ---------------- VIP Horse Racing ---------------- */

const HORSES = [
  { name: "Liquidity Event", emoji: "🐎" },
  { name: "Tax Efficient", emoji: "🐴" },
  { name: "Second Yacht", emoji: "🦄" },
  { name: "Offshore Breeze", emoji: "🐎" },
];

function RaceBody({ bet, settle, busy }: GameBodyProps) {
  const [progress, setProgress] = useState([0, 0, 0, 0]);
  const [racing, setRacing] = useState(false);
  const [commentary, setCommentary] = useState("Pick your thoroughbred.");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const race = (choice: number) => {
    if (racing || busy) return;
    const o = rollOutcome();
    setRacing(true);
    setProgress([0, 0, 0, 0]);
    const winner = o.won ? choice : (choice + randInt(1, 3)) % 4;
    const lines = [
      "They're off — and one of them is already showing off.",
      "Down the back straight, hooves and hedge funds flying.",
      "Into the final furlong, this is getting theatrical!",
    ];
    lines.forEach((l, i) => {
      timers.current.push(window.setTimeout(() => setCommentary(l), 900 + i * 1900));
    });

    const iv = window.setInterval(() => {
      setProgress((p) =>
        p.map((v, i) => Math.min(100, v + Math.random() * (i === winner ? 3.2 : 2.4))),
      );
    }, 90);

    timers.current.push(
      window.setTimeout(() => {
        clearInterval(iv);
        setProgress((p) => p.map((v, i) => (i === winner ? 100 : Math.min(v, 94))));
        setRacing(false);
        setCommentary(`${HORSES[winner]!.name} takes it by a nostril.`);
        settle(o.won, o.jackpot ? o.multiplier : Math.max(1.6, o.multiplier), o.jackpot
          ? "A 40-to-1 outsider. The stewards are simply baffled."
          : undefined);
      }, 6600),
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-xl border border-gold/25 bg-emerald-deep/30 p-3">
        {HORSES.map((h, i) => (
          <div key={h.name} className="relative h-8 overflow-hidden rounded bg-obsidian/60">
            <div
              className="absolute top-1 text-xl will-change-transform"
              style={{
                transform: `translateX(${progress[i]! * 0.85}%)`,
                transition: "transform 120ms linear",
              }}
            >
              {h.emoji}
            </div>
            <span className="absolute right-2 top-1.5 text-[10px] text-silver">{h.name}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gold">{commentary}</p>
      <div className="grid grid-cols-2 gap-2">
        {HORSES.map((h, i) => (
          <button
            key={h.name}
            onClick={() => race(i)}
            disabled={racing || busy}
            className={cn(
              "rounded-full border border-gold/50 py-2 text-xs text-gold disabled:opacity-40",
            )}
          >
            Back {h.name}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-silver">
        Staking <Money usd={bet} short /> per race.
      </p>
    </div>
  );
}

export function HorseRacing(p: Props) {
  return (
    <GameShell {...p} title="VIP Horse Racing" subtitle="Six seconds of hooves and inherited money.">
      {(b) => <RaceBody {...b} />}
    </GameShell>
  );
}

/* ---------------- Meme Coin Trading ---------------- */

const COINS = ["$JETFUEL", "$CAVIAR", "$OLIGARCH", "$MOONBRIE", "$YACHTINU"];

function CoinBody({ bet, settle, busy }: GameBodyProps) {
  const [coin, setCoin] = useState(COINS[0]!);
  const [series, setSeries] = useState<number[]>([50]);
  const [live, setLive] = useState(false);
  const peak = useRef(1);
  const outcome = useRef(rollOutcome());

  const buy = () => {
    if (live || busy) return;
    outcome.current = rollOutcome();
    peak.current = 1;
    setSeries([50]);
    setLive(true);
    let step = 0;
    const iv = window.setInterval(() => {
      step += 1;
      setSeries((s) => {
        const last = s[s.length - 1]!;
        const drift = outcome.current.won ? 4.5 : 1.2;
        const next = Math.max(4, Math.min(96, last + (Math.random() - 0.35) * 8 + drift));
        peak.current = Math.max(peak.current, next / 50);
        return [...s, next];
      });
      if (step > 34) {
        clearInterval(iv);
        setLive(false);
      }
    }, 90);
  };

  const cashOut = () => {
    if (!live) return;
    setLive(false);
    const o = outcome.current;
    settle(
      o.won,
      o.jackpot ? o.multiplier : Math.max(1.3, peak.current * 1.6),
      o.jackpot
        ? `${coin} went vertical. Somebody's cousin is now a thought leader.`
        : o.won
          ? "Sold the top. Purely skill, obviously."
          : "Rugged. It happens to roughly everyone.",
    );
  };

  const path = series
    .map((v, i) => `${(i / Math.max(1, series.length - 1)) * 100},${100 - v}`)
    .join(" ");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {COINS.map((c) => (
          <button
            key={c}
            onClick={() => !live && setCoin(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px]",
              coin === c ? "border-gold bg-accent text-gold-bright" : "border-border text-silver",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-gold/25 bg-emerald-deep/20 p-2">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
          <polyline points={path} fill="none" stroke="#E8C468" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      {live ? (
        <PlayButton onClick={cashOut} label="Cash out now" />
      ) : (
        <PlayButton onClick={buy} disabled={busy} label={`Ape into ${coin}`} />
      )}
      <p className="text-center text-xs text-silver">
        Position size <Money usd={bet} short />. Not financial advice. Not finance.
      </p>
    </div>
  );
}

export function MemeCoin(p: Props) {
  return (
    <GameShell {...p} title="Underground Meme Coin Desk" subtitle="Buy the chart, sell the vibe.">
      {(b) => <CoinBody {...b} />}
    </GameShell>
  );
}