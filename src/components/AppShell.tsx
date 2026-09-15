import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Crown, Diamond, Dice5, Menu } from "lucide-react";
import { CountUpMoney } from "@/components/Money";
import { useEmpire } from "@/lib/store";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { LANGUAGES, type LangCode } from "@/lib/i18n";
import { AboutDialog } from "@/components/AboutDialog";
import { CartButton, CartSheet } from "@/components/CartSheet";
import { SiteFooter } from "@/components/SiteFooter";
import { AchievementToasts } from "@/components/AchievementToasts";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const TABS = [
  { to: "/", key: "casino", label: "Casino", Icon: Dice5 },
  { to: "/vault", key: "vault", label: "Vault", Icon: Diamond },
  { to: "/empire", key: "empire", label: "Empire", Icon: Crown },
] as const;

function Selects() {
  const { state, setCurrency, setLanguage } = useEmpire();
  const cls =
    "surface bg-transparent px-2 py-1 text-xs text-silver focus:outline-none focus:ring-1 focus:ring-gold";
  return (
    <>
      <select
        aria-label="Currency"
        className={cls}
        value={state.currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
      >
        {Object.keys(CURRENCIES).map((c) => (
          <option key={c} value={c} className="bg-charcoal">
            {c}
          </option>
        ))}
      </select>
      <select
        aria-label="Language"
        className={cls}
        value={state.language}
        onChange={(e) => setLanguage(e.target.value as LangCode)}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="bg-charcoal">
            {l.label}
          </option>
        ))}
      </select>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { netWorth, state } = useEmpire();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-obsidian text-platinum">
      <header className="sticky top-0 z-40 border-b border-border bg-charcoal/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src={logo}
              alt="Billionaire Speedrun logo"
              width={816}
              height={816}
              className="size-9 shrink-0 object-contain"
            />
            <span className="hidden font-display text-sm leading-tight font-semibold tracking-tight sm:block">
              Billionaire
              <br />
              <span className="text-gradient-lux">Speedrun</span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {TABS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm transition-colors",
                  pathname === to
                    ? "bg-accent text-gold-bright"
                    : "text-silver hover:text-platinum",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="text-right leading-none">
              <div className="text-[10px] tracking-widest text-silver uppercase">Net worth</div>
              <CountUpMoney
                usd={netWorth}
                short
                className="font-display text-lg font-semibold text-gradient-gold"
              />
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Selects />
            </div>
            <CartButton onClick={() => setCartOpen(true)} />
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full border border-border text-silver"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border px-4 py-3">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
              <div className="flex gap-2 sm:hidden">
                <Selects />
              </div>
              <button
                onClick={() => {
                  setAboutOpen(true);
                  setMenuOpen(false);
                }}
                className="surface px-3 py-1 text-xs text-gold"
              >
                About & FAQ
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-border bg-obsidian/60">
          <div className="mx-auto flex max-w-6xl items-baseline gap-2 px-4 py-1.5">
            <span className="text-[10px] tracking-widest text-silver uppercase">Balance</span>
            <CountUpMoney usd={state.balance} className="font-display text-sm text-gold" />
            <span className="ml-auto text-[10px] text-silver">Fictional currency · not real money</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-5 pb-28 md:pb-12">{children}</main>

      <SiteFooter onAbout={() => setAboutOpen(true)} />

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-charcoal/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-3">
          {TABS.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors",
                pathname === to ? "text-gold-bright" : "text-silver",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <AchievementToasts />
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}