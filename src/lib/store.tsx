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
import {
  ACHIEVEMENTS,
  dailyBonusAmount,
  daysBetween,
  todayKey,
  type Achievement,
} from "./achievements";
import { dictionaries, type LangCode, type StringKey } from "./i18n";

export type OwnedItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  rare?: boolean;
};

export type CartLine = OwnedItem & { qty: number };

export type EmpireState = {
  balance: number;
  inventory: OwnedItem[];
  cart: CartLine[];
  winStreak: number;
  bestStreak: number;
  gamesPlayed: number;
  biggestWin: number;
  totalSpent: number;
  achievements: string[];
  bonusStreak: number;
  lastBonusDate: string | null;
  currency: CurrencyCode;
  language: LangCode;
  sound: boolean;
};

export const SEED_BALANCE = 10_000;

const initialState: EmpireState = {
  balance: SEED_BALANCE,
  inventory: [],
  cart: [],
  winStreak: 0,
  bestStreak: 0,
  gamesPlayed: 0,
  biggestWin: 0,
  totalSpent: 0,
  achievements: [],
  bonusStreak: 0,
  lastBonusDate: null,
  currency: "USD",
  language: "en",
  sound: true,
};

const STORAGE_KEY = "billionaire-speedrun-v2";

type Ctx = {
  state: EmpireState;
  netWorth: number;
  hydrated: boolean;
  cartTotal: number;
  cartCount: number;
  t: (key: StringKey) => string;
  unlocked: Achievement[];
  locked: Achievement[];
  pending: Achievement[];
  dismissAchievement: (id: string) => void;
  bonusReady: boolean;
  nextBonusAmount: number;
  claimDailyBonus: () => number;
  setCurrency: (c: CurrencyCode) => void;
  setLanguage: (l: LangCode) => void;
  setSound: (on: boolean) => void;
  resolveGame: (delta: number, won: boolean) => void;
  purchase: (item: OwnedItem) => boolean;
  addToCart: (item: OwnedItem) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  checkout: () => boolean;
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
      bestStreak: won ? Math.max(s.bestStreak, s.winStreak + 1) : s.bestStreak,
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
        totalSpent: s.totalSpent + item.price,
        inventory: [...s.inventory, { ...item, id: `${item.id}-${Date.now()}` }],
      };
    });
    return ok;
  }, []);

  const addToCart = useCallback((item: OwnedItem) => {
    setState((s) => {
      const existing = s.cart.find((l) => l.id === item.id);
      return {
        ...s,
        cart: existing
          ? s.cart.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
          : [...s.cart, { ...item, qty: 1 }],
      };
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((l) => l.id !== id) }));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setState((s) => ({
      ...s,
      cart: qty <= 0
        ? s.cart.filter((l) => l.id !== id)
        : s.cart.map((l) => (l.id === id ? { ...l, qty } : l)),
    }));
  }, []);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), []);

  const checkout = useCallback(() => {
    let ok = false;
    setState((s) => {
      const total = s.cart.reduce((a, l) => a + l.price * l.qty, 0);
      if (!s.cart.length || s.balance < total) return s;
      ok = true;
      const stamp = Date.now();
      const bought: OwnedItem[] = s.cart.flatMap((l, li) =>
        Array.from({ length: l.qty }, (_, k) => ({
          id: `${l.id}-${stamp}-${li}-${k}`,
          name: l.name,
          image: l.image,
          price: l.price,
          category: l.category,
          rare: l.rare,
        })),
      );
      return {
        ...s,
        balance: s.balance - total,
        totalSpent: s.totalSpent + total,
        inventory: [...s.inventory, ...bought],
        cart: [],
      };
    });
    return ok;
  }, []);

  const [pending, setPending] = useState<Achievement[]>([]);

  const dismissAchievement = useCallback(
    (id: string) => setPending((p) => p.filter((a) => a.id !== id)),
    [],
  );

  const claimDailyBonus = useCallback(() => {
    let amount = 0;
    setState((s) => {
      const today = todayKey();
      if (s.lastBonusDate === today) return s;
      const consecutive = s.lastBonusDate && daysBetween(s.lastBonusDate, today) === 1;
      const day = consecutive ? s.bonusStreak + 1 : 1;
      amount = dailyBonusAmount(day);
      return {
        ...s,
        balance: s.balance + amount,
        bonusStreak: day,
        lastBonusDate: today,
      };
    });
    return amount;
  }, []);

  const reset = useCallback(() => {
    setPending([]);
    setState((s) => ({ ...initialState, currency: s.currency, language: s.language, sound: s.sound }));
  }, []);

  const netWorth = state.balance + state.inventory.reduce((a, i) => a + i.price, 0);

  // Evaluate milestones after every state change and queue the new ones for a toast.
  useEffect(() => {
    if (!loaded.current) return;
    const metrics = {
      netWorth,
      balance: state.balance,
      gamesPlayed: state.gamesPlayed,
      winStreak: state.winStreak,
      bestStreak: state.bestStreak,
      biggestWin: state.biggestWin,
      itemsOwned: state.inventory.length,
      totalSpent: state.totalSpent,
      bonusStreak: state.bonusStreak,
      rareOwned: state.inventory.filter((i) => i.rare).length,
    };
    const fresh = ACHIEVEMENTS.filter(
      (a) => !state.achievements.includes(a.id) && a.test(metrics),
    );
    if (!fresh.length) return;
    setPending((p) => [...p, ...fresh]);
    setState((s) => ({
      ...s,
      achievements: [...s.achievements, ...fresh.map((a) => a.id)],
      balance: s.balance + fresh.reduce((a, x) => a + x.reward, 0),
    }));
  }, [state, netWorth]);

  const value = useMemo<Ctx>(() => {
    const dict = dictionaries[state.language] ?? dictionaries.en;
    return {
      state,
      hydrated,
      netWorth,
      unlocked: ACHIEVEMENTS.filter((a) => state.achievements.includes(a.id)),
      locked: ACHIEVEMENTS.filter((a) => !state.achievements.includes(a.id)),
      pending,
      dismissAchievement,
      bonusReady: state.lastBonusDate !== todayKey(),
      nextBonusAmount: dailyBonusAmount(
        state.lastBonusDate && daysBetween(state.lastBonusDate, todayKey()) === 1
          ? state.bonusStreak + 1
          : 1,
      ),
      claimDailyBonus,
      cartTotal: state.cart.reduce((a, l) => a + l.price * l.qty, 0),
      cartCount: state.cart.reduce((a, l) => a + l.qty, 0),
      t: (key) => dict[key] ?? dictionaries.en[key],
      setCurrency: (currency) => setState((s) => ({ ...s, currency })),
      setLanguage: (language) => setState((s) => ({ ...s, language })),
      setSound: (sound) => setState((s) => ({ ...s, sound })),
      resolveGame,
      purchase,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      checkout,
      reset,
    };
  }, [state, hydrated, netWorth, pending, dismissAchievement, claimDailyBonus, resolveGame, purchase, addToCart, removeFromCart, setQty, clearCart, checkout, reset]);

  return <EmpireContext.Provider value={value}>{children}</EmpireContext.Provider>;
}

export function useEmpire() {
  const ctx = useContext(EmpireContext);
  if (!ctx) throw new Error("useEmpire must be used inside EmpireProvider");
  return ctx;
}

/** Bet tiers unlock as the fake fortune grows. */
export function betTiers(balance: number) {
  const base = [1_000, 5_000, 10_000, 50_000, 250_000, 1_000_000, 5_000_000, 25_000_000, 100_000_000];
  const unlocked = base.filter((b) => b <= Math.max(1_000, balance));
  return unlocked.length ? unlocked.slice(-4) : [1_000];
}