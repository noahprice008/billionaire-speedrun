import { useCallback, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Money } from "@/components/Money";
import { Particles } from "@/components/Particles";
import { betTiers, useEmpire } from "@/lib/store";
import { cn } from "@/lib/utils";

export type Settle = (won: boolean, multiplier: number, note?: string) => void;

export type GameBodyProps = { bet: number; settle: Settle; busy: boolean };

export function GameShell({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle: string;
  children: (props: GameBodyProps) => ReactNode;
}) {
  const { state, resolveGame } = useEmpire();
  const tiers = betTiers(state.balance);
  const [bet, setBet] = useState<number>(tiers[0]!);
  const [result, setResult] = useState<{ won: boolean; amount: number; note: string } | null>(null);

  const activeBet = Math.min(bet, Math.max(10_000, state.balance));

  const settle = useCallback<Settle>(
    (won, multiplier, note) => {
      const delta = won ? Math.round(activeBet * multiplier) : -activeBet;
      resolveGame(delta, won);
      setResult({
        won,
        amount: Math.abs(delta),
        note: note ?? (won ? "Obscene. Well done." : "The house needed a win. Just one."),
      });
    },
    [activeBet, resolveGame],
  );

  const close = (v: boolean) => {
    if (!v) setResult(null);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border bg-charcoal p-4 sm:max-w-lg">
        <DialogTitle className="font-display text-xl text-gradient-gold">{title}</DialogTitle>
        <p className="-mt-2 text-xs text-silver">{subtitle}</p>

        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs">
          <span className="text-silver">Balance</span>
          <Money usd={state.balance} className="font-display text-sm text-gold" />
        </div>

        <div>
          <div className="mb-2 text-[10px] tracking-widest text-silver uppercase">Bet size</div>
          <div className="flex flex-wrap gap-2">
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => setBet(t)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  activeBet === t
                    ? "border-gold bg-accent text-gold-bright"
                    : "border-border text-silver hover:text-platinum",
                )}
              >
                <Money usd={t} short />
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[220px]">
          {children({ bet: activeBet, settle, busy: !!result })}

          {result && (
            <div className="absolute inset-0 z-20 grid place-items-center rounded-xl bg-obsidian/92 p-4 text-center">
              {result.won && <Particles />}
              <div className="animate-win-pop">
                <div
                  className={cn(
                    "font-display text-3xl",
                    result.won ? "text-gradient-gold" : "text-silver",
                  )}
                >
                  {result.won ? "You won" : "House got lucky"}
                </div>
                <div className="mt-1 font-display text-4xl text-platinum">
                  {result.won ? "+" : "−"}
                  <Money usd={result.amount} short />
                </div>
                <p className="mt-2 max-w-xs text-sm text-silver">{result.note}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setResult(null)}
                    className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-obsidian"
                  >
                    Play again
                  </button>
                  <a
                    href="/vault"
                    className="rounded-full border border-gold/50 px-5 py-2 text-sm text-gold"
                  >
                    Cash out to Vault
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PlayButton({
  onClick,
  disabled,
  label = "Play",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full bg-gold py-3 font-semibold tracking-wide text-obsidian transition-transform active:scale-[0.98] disabled:opacity-40"
    >
      {label}
    </button>
  );
}