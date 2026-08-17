export type CurrencyCode =
  | "USD" | "EUR" | "GBP" | "CHF" | "AED" | "CNY" | "JPY" | "HKD" | "SGD" | "KRW";

export const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: "$", rate: 1, label: "US Dollar" },
  EUR: { symbol: "€", rate: 0.92, label: "Euro" },
  GBP: { symbol: "£", rate: 0.79, label: "British Pound" },
  CHF: { symbol: "CHF ", rate: 0.88, label: "Swiss Franc" },
  AED: { symbol: "AED ", rate: 3.67, label: "UAE Dirham" },
  CNY: { symbol: "¥", rate: 7.24, label: "Chinese Yuan" },
  JPY: { symbol: "¥", rate: 151, label: "Japanese Yen" },
  HKD: { symbol: "HK$", rate: 7.82, label: "Hong Kong Dollar" },
  SGD: { symbol: "S$", rate: 1.34, label: "Singapore Dollar" },
  KRW: { symbol: "₩", rate: 1340, label: "Korean Won" },
};

export function convert(usd: number, code: CurrencyCode) {
  return usd * CURRENCIES[code].rate;
}

export function abbreviate(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1e12) return (n / 1e12).toFixed(2).replace(/\.00$/, "") + "T";
  if (abs >= 1e9) return (n / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
  if (abs >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return Math.round(n).toString();
}

export function formatMoney(usd: number, code: CurrencyCode, opts?: { short?: boolean }) {
  const value = convert(usd, code);
  const { symbol } = CURRENCIES[code];
  if (opts?.short) return `${symbol}${abbreviate(value)}`;
  return `${symbol}${Math.round(value).toLocaleString("en-US")}`;
}