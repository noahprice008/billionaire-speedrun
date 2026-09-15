import { useState } from "react";
import { Gift, Flame } from "lucide-react";
import { Money } from "@/components/Money";
import { Particles } from "@/components/Particles";
import { useEmpire } from "@/lib/store";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

const DAYS = [1, 2, 3, 4, 5, 6, 7];

/** Daily fake-chip drop with a consecutive-day multiplier. */
export function DailyBonus() {
  const { state, hydrated, bonusReady, nextBonusAmount, claimDailyBonus } = useEmpire();
  const [claimed, setClaimed] = useState<number | null>(null);

  if (!hydrated) return null;

  const dayIndex = bonusReady ? state.bonusStreak + 1 : state.bonusStreak;

  return (
    <section className="surface relative overflow-hidden p-4 sm:p-5">
      {claimed !== null && <Particles />}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/50 bg-accent">
          <Gift className="size-6 text-gold-bright" />
        </div>
        <div className="min-w-0 flex-1 basis-[60%] sm:basis-auto">
          <h2 className="font-display text-xl text-gradient-gold">Daily chip drop</h2>
          <p className="text-xs text-silver">
            {bonusReady ? (
              <>
                Free chips waiting: <Money usd={nextBonusAmount} short className="text-gold" />
                {state.bonusStreak > 0 && " · keep the streak alive for a bigger drop"}
              </>
            ) : (
              <>
                Claimed today. Come back tomorrow for{" "}
                <Money usd={nextBonusAmount} short className="text-gold" />.
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-silver">
          <Flame className={cn("size-4", state.bonusStreak > 0 ? "text-gold" : "text-silver")} />
          {state.bonusStreak} day{state.bonusStreak === 1 ? "" : "s"}
        </div>
        <button
          disabled={!bonusReady}
          onClick={() => {
            const amount = claimDailyBonus();
            if (amount > 0) {
              playSound("cash", state.sound);
              setClaimed(amount);
              setTimeout(() => setClaimed(null), 2500);
            }
          }}
          className="ml-auto rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-obsidian transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          {bonusReady ? "Claim chips" : "Claimed"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {DAYS.map((d) => (
          <div
            key={d}
            className={cn(
              "rounded-lg border px-1 py-2 text-center text-[10px]",
              d <= dayIndex ? "border-gold/60 bg-accent text-gold-bright" : "border-border text-silver",
            )}
          >
            Day {d}
          </div>
        ))}
      </div>

      {claimed !== null && (
        <p className="mt-3 text-center font-display text-lg text-gradient-gold">
          +<Money usd={claimed} short /> in fictional chips
        </p>
      )}
    </section>
  );
}
