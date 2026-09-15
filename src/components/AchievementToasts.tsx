import { useEffect } from "react";
import { Money } from "@/components/Money";
import { Particles } from "@/components/Particles";
import { useEmpire } from "@/lib/store";

/** Floating milestone banners; auto-dismiss after a few seconds. */
export function AchievementToasts() {
  const { pending, dismissAchievement } = useEmpire();
  const current = pending[0];

  useEffect(() => {
    if (!current) return;
    const id = setTimeout(() => dismissAchievement(current.id), 5000);
    return () => clearTimeout(id);
  }, [current, dismissAchievement]);

  if (!current) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-50 flex justify-center px-4">
      <button
        onClick={() => dismissAchievement(current.id)}
        className="pointer-events-auto relative flex max-w-sm items-center gap-3 overflow-hidden rounded-2xl border border-gold/50 bg-charcoal/95 px-4 py-3 text-left shadow-[0_0_40px_-10px_rgba(232,196,104,0.6)] backdrop-blur animate-win-pop"
      >
        <Particles />
        <span className="text-2xl">{current.emoji}</span>
        <span className="min-w-0">
          <span className="block text-[10px] tracking-widest text-silver uppercase">
            Milestone unlocked
          </span>
          <span className="block font-display text-base text-gradient-gold">{current.name}</span>
          <span className="block text-xs text-silver">{current.desc}</span>
          <span className="mt-0.5 block text-xs text-gold">
            +<Money usd={current.reward} short /> bonus chips
          </span>
        </span>
      </button>
    </div>
  );
}
