import { useEffect, useRef, useState } from "react";
import { formatMoney } from "@/lib/currency";
import { useEmpire } from "@/lib/store";

export function Money({ usd, short, className }: { usd: number; short?: boolean; className?: string }) {
  const { state } = useEmpire();
  return <span className={className}>{formatMoney(usd, state.currency, { short })}</span>;
}

/** Animated count-up between value changes (GPU-cheap: text only). */
export function CountUpMoney({
  usd,
  short,
  className,
  duration = 700,
}: {
  usd: number;
  short?: boolean;
  className?: string;
  duration?: number;
}) {
  const { state } = useEmpire();
  const [display, setDisplay] = useState(usd);
  const from = useRef(usd);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const b = usd;
    if (a === b) return;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(a + (b - a) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      from.current = usd;
    };
  }, [usd, duration]);

  return <span className={className}>{formatMoney(display, state.currency, { short })}</span>;
}