import { FAQ } from "@/lib/i18n";

export function SiteFooter({ onAbout }: { onAbout: () => void }) {
  return (
    <footer className="mt-10 border-t border-border bg-charcoal/60 px-4 pt-8 pb-28 md:pb-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h2 className="font-display text-lg text-gold">The small print (it's important)</h2>
          <p className="mt-2 max-w-2xl text-sm text-silver">
            Billionaire Speedrun is a free novelty simulator. All currency is fictional. There are no
            real wagers, no real purchases and nothing to withdraw. Not affiliated with any real
            casino, brand or luxury house. Prices and exchange rates are for entertainment only and
            are not real-time.
          </p>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {FAQ.slice(0, 4).map((f) => (
            <div key={f.q} className="surface p-4">
              <dt className="text-sm font-semibold text-platinum">{f.q}</dt>
              <dd className="mt-1 text-sm text-silver">{f.a}</dd>
            </div>
          ))}
        </dl>
        <button onClick={onAbout} className="text-xs text-gold underline underline-offset-4">
          Read the full About & FAQ
        </button>
      </div>
    </footer>
  );
}