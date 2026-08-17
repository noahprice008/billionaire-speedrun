import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CurrencyCode } from "./currency";
import { dictionaries, type LangCode, type StringKey } from "./i18n";

export type OwnedItem = { id: string; name: string; image: string; price: number; category: string };

export type EmpireState = {
  balance: number;
  inventory: OwnedItem[];
  winStreak: number;
  gamesPlayed: number;
  biggestWin: number;
  currency: CurrencyCode;
  language: LangCode;
};

export const SEED_BALANCE = 250_000;

const initialState: EmpireState = {
  balance: SEED_BALANCE,
  inventory: [],
  winStreak: 0,
  gamesPlayed: 0,
  biggestWin: 0,
  currency: "USD",
  language: "en",
};

const STORAGE_KEY = "billionaire-speedrun-v1";

type Ctx = {
  state: EmpireState;
  netWorth: number;
  hydrated: boolean;
  t: (key: StringKey) => string;
  setCurrency: (c: CurrencyCode) => void;
  setLanguage: (l: LangCode) => void;
  resolveGame: (delta: number, won: boolean) => void;
  purchase: (item: OwnedItem) => boolean;
  reset: () => void;
};

const EmpireContext = createContext<Ctx | null>(null);

export function EmpireProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EmpireState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
    loaded.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked */
    }
  }, [state]);

  const resolveGame = useCallback((delta: number, won: boolean) => {
    setState((s) => ({
      ...s,
      balance: Math.max(0, s.balance + delta),
      gamesPlayed: s.gamesPlayed + 1,
      winStreak: won ? s.winStreak + 1 : 0,
      biggestWin: won ? Math.max(s.biggestWin, delta) : s.biggestWin,
    }));
  }, []);

  const purchase = useCallback((item: OwnedItem) => {
    let ok = false;
    setState((s) => {
      if (s.balance < item.price) return s;
      ok = true;
      return {
        ...s,
        balance: s.balance - item.price,
        inventory: [...s.inventory, { ...item, id: `${item.id}-${Date.now()}` }],
      };
    });
    return ok;
  }, []);

  const reset = useCallback(() => {
    setState((s) => ({ ...initialState, currency: s.currency, language: s.language }));
  }, []);

  const value = useMemo<Ctx>(() => {
    const dict = dictionaries[state.language] ?? dictionaries.en;
    return {
      state,
      hydrated,
      netWorth: state.balance + state.inventory.reduce((a, i) => a + i.price, 0),
      t: (key) => dict[key] ?? dictionaries.en[key],
      setCurrency: (currency) => setState((s) => ({ ...s, currency })),
      setLanguage: (language) => setState((s) => ({ ...s, language })),
      resolveGame,
      purchase,
      reset,
    };
  }, [state, hydrated, resolveGame, purchase, reset]);

  return <EmpireContext.Provider value={value}>{children}</EmpireContext.Provider>;
}

export function useEmpire() {
  const ctx = useContext(EmpireContext);
  if (!ctx) throw new Error("useEmpire must be used inside EmpireProvider");
  return ctx;
}

/** Bet tiers unlock as the fake fortune grows. */
export function betTiers(balance: number) {
  const base = [10_000, 50_000, 250_000, 1_000_000, 5_000_000, 25_000_000, 100_000_000];
  const unlocked = base.filter((b) => b <= Math.max(10_000, balance));
  return unlocked.length ? unlocked.slice(-4) : [10_000];
}