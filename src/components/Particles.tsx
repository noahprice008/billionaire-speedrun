import { useMemo } from "react";

/** Cheap CSS-transform particle burst used for wins and purchases. */
export function Particles({ count = 24, kind = "coin" }: { count?: number; kind?: "coin" | "confetti" }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random();
        const dist = 90 + Math.random() * 140;
        return {
          i,
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist}px`,
          delay: `${Math.random() * 120}ms`,
          size: 6 + Math.random() * 8,
        };
      }),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden">
      {bits.map((b) => (
        <span
          key={b.i}
          className={
            kind === "coin"
              ? "absolute rounded-full bg-gold-bright"
              : "absolute rounded-[2px] bg-gold"
          }
          style={{
            width: b.size,
            height: kind === "coin" ? b.size : b.size * 1.8,
            animation: `particle-fly 900ms cubic-bezier(0.15,0.7,0.3,1) ${b.delay} forwards`,
            ["--dx" as string]: b.dx,
            ["--dy" as string]: b.dy,
          }}
        />
      ))}
    </div>
  );
}