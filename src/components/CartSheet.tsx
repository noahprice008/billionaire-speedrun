import { useState } from "react";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { Money } from "@/components/Money";
import { Particles } from "@/components/Particles";
import { useEmpire } from "@/lib/store";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

export function CartButton({ onClick }: { onClick: () => void }) {
  const { cartCount } = useEmpire();
  return (
    <button
      aria-label="Shopping basket"
      onClick={onClick}
      className="relative grid size-9 place-items-center rounded-full border border-gold/40 text-gold"
    >
      <ShoppingBag className="size-4" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 grid min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-obsidian">
          {cartCount}
        </span>
      )}
    </button>
  );
}

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, cartTotal, setQty, removeFromCart, clearCart, checkout } = useEmpire();
  const [done, setDone] = useState(false);
  const affordable = state.balance >= cartTotal && state.cart.length > 0;

  if (!open) return null;

  const pay = () => {
    if (checkout()) {
      playSound("cash", state.sound);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close basket" onClick={onClose} className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-gold/25 bg-charcoal shadow-2xl">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <h2 className="font-display text-xl text-gradient-gold">Your Basket</h2>
          <button onClick={onClose} aria-label="Close" className="ml-auto text-silver hover:text-platinum">
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {done && <Particles kind="confetti" count={40} />}
          {state.cart.length === 0 ? (
            <p className="mt-10 text-center text-sm text-silver">
              Empty. Tragic. Go add something ludicrous.
            </p>
          ) : (
            <ul className="space-y-3">
              {state.cart.map((line) => (
                <li key={line.id} className="surface flex gap-3 overflow-hidden p-2">
                  <img src={line.image} alt={line.name} loading="lazy" className="size-16 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-platinum">{line.name}</div>
                    <Money usd={line.price * line.qty} short className="text-xs text-gold" />
                    <div className="mt-1 flex items-center gap-2">
                      <button onClick={() => setQty(line.id, line.qty - 1)} className="size-6 rounded-full border border-border text-xs text-silver">−</button>
                      <span className="w-4 text-center text-xs text-platinum">{line.qty}</span>
                      <button onClick={() => setQty(line.id, line.qty + 1)} className="size-6 rounded-full border border-border text-xs text-silver">+</button>
                      <button onClick={() => removeFromCart(line.id)} aria-label="Remove" className="ml-auto text-silver hover:text-ruby">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="space-y-3 border-t border-border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-silver">Balance</span>
            <Money usd={state.balance} short className="font-display text-gold" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest text-silver uppercase">Total</span>
            <Money usd={cartTotal} className="font-display text-2xl text-gradient-gold" />
          </div>
          <button
            onClick={pay}
            disabled={!affordable}
            className={cn(
              "w-full rounded-full py-3 text-sm font-bold tracking-wide transition-colors",
              affordable ? "bg-gold text-obsidian hover:bg-gold-bright" : "cursor-not-allowed border border-border text-silver",
            )}
          >
            {done
              ? "Purchased 🎉"
              : state.cart.length === 0
                ? "Nothing to check out"
                : affordable
                  ? "Checkout with fake money"
                  : "Win more first 💰"}
          </button>
          {state.cart.length > 0 && (
            <button onClick={clearCart} className="w-full text-center text-[11px] text-silver hover:text-platinum">
              Empty basket
            </button>
          )}
          <p className="text-center text-[10px] text-silver">
            Fictional checkout. No payment, no shipping, nothing is real.
          </p>
        </footer>
      </aside>
    </div>
  );
}
