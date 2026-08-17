import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Money } from "@/components/Money";
import { Particles } from "@/components/Particles";
import { CATEGORIES, FEATURED_ITEMS, VAULT_ITEMS, type CategoryId, type VaultItem } from "@/lib/catalog";
import { useEmpire } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "The Luxury Vault — Billionaire Speedrun" },
      {
        name: "description",
        content:
          "Blow your fictional fortune on hypercars, private islands and museum-grade art. A free novelty catalog — nothing is real, nothing ships.",
      },
      { property: "og:title", content: "The Luxury Vault — Billionaire Speedrun" },
      {
        property: "og:description",
        content: "Spend imaginary billions on absurdly opulent imaginary things.",
      },
    ],
  }),
  component: VaultPage,
});

function VaultPage() {
  const { state, purchase } = useEmpire();
  const [filter, setFilter] = useState<CategoryId | "all">("all");
  const [burst, setBurst] = useState<string | null>(null);

  const items = useMemo(
    () =>
      (filter === "all" ? VAULT_ITEMS : VAULT_ITEMS.filter((i) => i.category === filter)).filter(
        (i) => !i.featured,
      ),
    [filter],
  );

  const buy = (item: VaultItem) => {
    const ok = purchase({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      category: item.category,
    });
    if (ok) {
      setBurst(item.id);
      setTimeout(() => setBurst(null), 1000);
    }
  };

  return (
    <AppShell>
      <h1 className="font-display text-4xl tracking-tight">
        The <span className="text-gradient-lux">Luxury Vault</span>
      </h1>
      <p className="mt-1 max-w-xl text-sm text-silver">
        A fantasy catalog. Nothing ships, nothing is real, everything is tax-free.
      </p>

      <section className="surface-lux mt-6 p-5">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-2xl text-gradient-lux">The Exclusive Collection</h2>
          <span className="rounded-full border border-orchid/50 px-2 py-0.5 text-[10px] tracking-widest text-orchid uppercase">
            Featured
          </span>
        </div>
        <p className="mt-1 text-xs text-silver">
          Four pieces released once, entirely imaginary, absurdly expensive.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_ITEMS.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              burst={burst === item.id}
              affordable={state.balance >= item.price}
              onBuy={() => buy(item)}
            />
          ))}
        </div>
      </section>

      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2">
        <Chip active={filter === "all"} onClick={() => setFilter("all")} label="All" />
        {CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            active={filter === c.id}
            onClick={() => setFilter(c.id)}
            label={`${c.emoji} ${c.label}`}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            burst={burst === item.id}
            affordable={state.balance >= item.price}
            onBuy={() => buy(item)}
          />
        ))}
      </div>
    </AppShell>
  );
}

function ItemCard({
  item,
  burst,
  affordable,
  onBuy,
}: {
  item: VaultItem;
  burst: boolean;
  affordable: boolean;
  onBuy: () => void;
}) {
  return (
    <article
      className={cn(
        "relative overflow-hidden",
        item.featured ? "surface-lux glow-orchid" : "surface",
      )}
    >
      {burst && <Particles kind="confetti" count={30} />}
      <div className="relative aspect-[4/3] overflow-hidden bg-obsidian">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="size-full object-cover opacity-90"
        />
        {item.featured ? (
          <span className="absolute top-2 left-2 rounded-full bg-orchid px-2 py-0.5 text-[10px] tracking-wider text-obsidian uppercase">
            Exclusive
          </span>
        ) : (
          item.rare && (
            <span className="absolute top-2 left-2 rounded-full bg-ruby px-2 py-0.5 text-[10px] tracking-wider text-platinum uppercase">
              Rare
            </span>
          )
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-display text-lg leading-snug">{item.name}</h3>
        <p className="text-xs text-silver">{item.blurb}</p>
        <div className="flex items-center justify-between gap-2 pt-1">
          <Money usd={item.price} className="font-display text-base text-gold" />
          <button
            disabled={!affordable}
            onClick={onBuy}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
              affordable
                ? "bg-gold text-obsidian hover:bg-gold-bright"
                : "cursor-not-allowed border border-border text-silver",
            )}
          >
            {affordable ? "Add to Empire" : "Win more first 💰"}
          </button>
        </div>
      </div>
    </article>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors",
        active ? "border-gold bg-accent text-gold-bright" : "border-border text-silver",
      )}
    >
      {label}
    </button>
  );
}