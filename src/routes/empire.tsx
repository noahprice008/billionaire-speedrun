import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CountUpMoney, Money } from "@/components/Money";
import { useEmpire } from "@/lib/store";

export const Route = createFileRoute("/empire")({
  head: () => ({
    meta: [
      { title: "My Empire — Billionaire Speedrun" },
      {
        name: "description",
        content:
          "Your fictional net worth, your imaginary possessions and your entirely made-up win streak, all in one dashboard.",
      },
      { property: "og:title", content: "My Empire — Billionaire Speedrun" },
      {
        property: "og:description",
        content: "Track a net worth that does not exist. Reset it whenever you like.",
      },
    ],
  }),
  component: EmpirePage,
});

function EmpirePage() {
  const { state, netWorth, reset } = useEmpire();
  const [confirming, setConfirming] = useState(false);

  return (
    <AppShell>
      <section className="surface p-6 text-center">
        <div className="text-[10px] tracking-[0.3em] text-silver uppercase">Total net worth</div>
        <CountUpMoney
          usd={netWorth}
          className="mt-2 block font-display text-4xl text-gradient-gold sm:text-5xl"
        />
        <p className="mt-2 text-xs text-silver">Entirely fictional. Gloriously so.</p>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Win streak" value={`${state.winStreak} 🔥`} />
        <Stat label="Games played" value={String(state.gamesPlayed)} />
        <Stat
          label="Biggest single win"
          value={<Money usd={state.biggestWin} short />}
        />
        <Stat label="Items owned" value={String(state.inventory.length)} />
      </div>

      <h2 className="mt-8 font-display text-2xl">Your possessions</h2>
      {state.inventory.length === 0 ? (
        <p className="surface mt-3 p-6 text-center text-sm text-silver">
          Your empire is embarrassingly empty. Go win something.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {state.inventory.map((item) => (
            <div key={item.id} className="surface overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover opacity-90"
              />
              <div className="p-3">
                <div className="text-xs leading-snug text-platinum">{item.name}</div>
                <Money usd={item.price} short className="mt-1 block text-[11px] text-gold" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="surface mt-8 flex flex-wrap items-center gap-3 p-4">
        <div className="text-sm text-silver">
          Had enough? Wipe the fake fortune and every fake possession.
        </div>
        {confirming ? (
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                reset();
                setConfirming(false);
              }}
              className="rounded-full bg-destructive px-4 py-2 text-xs text-platinum"
            >
              Yes, burn it down
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="rounded-full border border-border px-4 py-2 text-xs text-silver"
            >
              Keep my empire
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="ml-auto rounded-full border border-gold/50 px-4 py-2 text-xs text-gold"
          >
            Reset my empire
          </button>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="surface p-4">
      <div className="text-[10px] tracking-widest text-silver uppercase">{label}</div>
      <div className="mt-1 font-display text-xl text-platinum">{value}</div>
    </div>
  );
}