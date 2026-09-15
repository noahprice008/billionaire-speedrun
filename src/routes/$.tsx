import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Lost in the vault — Billionaire Speedrun" },
      {
        name: "description",
        content:
          "This page doesn't exist in the empire. Head back to the casino floor and keep stacking fictional chips.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Lost in the vault — Billionaire Speedrun" },
      {
        property: "og:description",
        content: "This page doesn't exist in the empire. Back to the casino floor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl text-[var(--gold-bright,#E8C468)] sm:text-7xl">404</p>
      <h1 className="font-display mt-4 text-2xl text-foreground sm:text-3xl">
        This wing of the estate doesn't exist
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        Even billionaires take a wrong turn. Your fictional fortune is safe — it lives in your
        browser, untouched.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Back to the casino
        </Link>
        <Link
          to="/vault"
          className="inline-flex items-center justify-center rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10"
        >
          Browse the Vault
        </Link>
      </div>
    </div>
  );
}
