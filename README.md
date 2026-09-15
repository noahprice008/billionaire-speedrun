# Billionaire Speedrun

Project Overview

Build Billionaire Speedrun, a free, no-signup, mobile-first "dopamine site" — a novelty simulator, NOT a real gambling or payment app. Users start with a fake seed balance, play rigged (player-favored) casino-style mini-games to rapidly inflate a fictional net worth, then blow that fake fortune on an absurdly opulent virtual luxury catalog. Nothing is ever real: no accounts, no real money, no real purchases, no cash-out. All state (balance, inventory, win streak) persists only in the browser (localStorage) — no backend/auth required.

Tone: playful, over-the-top, tongue-in-cheek "eat the rich" fantasy — not a slick real-money casino. Copy should wink at the absurdity (e.g. "Your rider — I mean, your private jet — has landed").

Include a visible disclaimer/FAQ block (footer + About modal) stating clearly: this is a free novelty simulator, all currency is fictional, no real wagers, no real purchases, nothing to withdraw, not affiliated with any real casino or luxury brand.

Tech & Structure

React + Tailwind + shadcn/ui components, single-page app with client-side routing.

Mobile-first responsive design (build and test the 375–414px viewport first, then scale up).

Global state (React context or Zustand): balance, netWorth, inventory[], winStreak, currency, language.

All game outcomes resolved client-side with weighted RNG (see win-rate table below) — no server needed.

Persist state to localStorage; provide a visible "Reset my empire" action.

Color System (use as Tailwind theme tokens / CSS variables)

Token Hex Usage --bg-obsidian #0B0B0F app background --bg-charcoal #17171D cards, modals, nav bar --gold-primary #C9A356 primary CTAs, active states, price tags --gold-bright #E8C468 hover/glow states, win animations, confetti --emerald-deep #0F3D3E felt-table accents, secondary buttons, game backgrounds --platinum #F5F3EE primary text on dark backgrounds --silver-muted #9B9AA3 secondary text, labels, disabled states --ruby-rare #7A1F2B rare/limited-item badges only — use sparingly

Design direction: dark, low-saturation, "private members' club" — not a loud slot-floor. One warm gold accent color does the heavy lifting. Generous negative space, subtle gold hairline borders (1px, low opacity) on cards instead of heavy drop shadows.

Typography: a high-contrast display serif (e.g. "Playfair Display" or "Fraunces") for headlines, net-worth ticker, and big numbers; a clean geometric sans (e.g. "Inter" or "Manrope") for UI chrome, buttons, and body text.

Motion: animated count-up on balance changes, coin/chip particle burst + screen glow on wins, smooth slot-reel easing (ease-out with slight overshoot), confetti burst on Vault purchases. Keep all animations GPU-cheap (CSS transforms/opacity) for mobile performance.

Navigation

Mobile: bottom tab bar, 3 tabs — Casino 🎰 / Vault 💎 / Empire 👑 — plus a top bar with logo, live net-worth ticker (abbreviated, e.g. "$4.2M"), currency selector, language selector, hamburger for About/FAQ.

Desktop: same tabs move to a top horizontal nav; layout widens to a 2–3 column grid for the Vault.

Sticky top bar always shows current fake balance.

Section 1: High-Roller Casino

Organize games into three tiers, shown as labeled sections/carousels on the Casino tab:

Easy Money (no casino knowledge required — onboarding tier)

Diamond Scratch Cards — tap-to-reveal 3 panels, instant win reveal, celebratory animation.

Golden Wheel of Fortune — one-tap spin, large colored segments with multiplier labels, physics-eased spin-to-stop.

Double-or-Nothing Coin Flip — pick heads/tails on a spinning gold coin, single tap.

Mystery Vault Boxes — choose 1 of 4 vault doors, all doors pay out (varying amounts), door-opening animation.

Signature Spectacle Games (the app's centerpiece, most visual polish)

High-Roller Slots — custom 3-reel slot, diamond/supercar/private-jet symbols, cascading multiplier wins, big reel-spin animation.

VIP Horse Racing — pick a thoroughbred, animated rapid-finish race (6–10 seconds), light "commentary" text overlay.

Underground Crypto/Meme Coin Trading — pick a fake meme coin, watch an animated price chart spike over ~3 seconds, cash out at the top.

High-Roller Classics (for players who already know casino games)

Private Club Roulette — single-zero wheel, standard bets plus a boosted "All-In" button.

High-Stakes Baccarat & Blackjack — simplified single-hand version, $100k-denominated chips, dealer bust animation.

Win-rate tuning: weight all RNG outcomes to 80–90% player win probability, with occasional bigger multiplier jackpots (rare, ~5% chance) to keep it exciting. Bet denominations start at $10,000 and offer quick-select chips up to $1M+; winnings scale exponentially as net worth grows (unlock bigger bet tiers as balance increases).

Each game screen: current balance, bet-size selector (chip buttons), big primary "Play"/"Spin"/"Bet" CTA in gold, win/lose result overlay with animation, "Play Again" and "Cash Out to Vault" shortcuts.

Section 2: The Luxury Vault

A filterable, swipeable card grid (single column on mobile, swipeable category chips at top):

Haute Couture — runway pieces, custom tailored suits, exclusive sneaker drops

Jewelry & Timepieces — iced-out watches, rare diamonds, crowns, historic gemstones

Supercars & Hypercars — hypercars, vintage rare cars, custom fleets, track cars

Artisanal Fragrance — custom-blended colognes in gold/diamond flacons

Real Estate & Extravagance — private islands, mega-yachts, space flight tickets, sports teams

Fine Art — museum-grade paintings and sculpture

Each item card: image, name, flavor description (one punchy line), price in selected currency, "Add to Empire" button (disabled/greyed if balance insufficient, with a playful "Win more first 💰" nudge). Purchase triggers a confetti burst, balance deduction, and adds the item to the Empire inventory.

Images: use free-license stock photography only (Pexels, Unsplash, Wikimedia Commons) — no copyrighted brand photography, no real logos. Favor generic-but-luxurious imagery (unbranded supercars, generic diamond jewelry, generic yachts/islands, generic fine art) to avoid implying real-brand endorsement.

Section 3: My Empire (dashboard)

Big animated net-worth counter at top.

Grid/list of owned Vault items (image + name).

Win streak, total games played, biggest single win — light "stats" flavor, not a real profile.

"Reset my empire" button (clears localStorage, confirms first).

Currency & Language

Default currency: USD. Selector in top bar with: USD, EUR, GBP, CHF, AED, CNY, JPY, HKD, SGD, KRW. Convert displayed prices using a static/fixed rate table baked into the app (no live API needed — this is cosmetic, not real commerce).

Language selector (UI string translation) for: English, Mandarin Chinese, Spanish, Arabic, French, Russian, Portuguese, Japanese, Korean, Hindi. Structure all UI copy through a simple i18n string table so translations can be dropped in; ship English complete and stub the others with the same keys.

Note in the About/FAQ: "Prices and exchange rates are for entertainment only and are not real-time."

Footer / Disclaimer FAQ (mirror this tone)

"Is this a real casino or payment app?" → No. Fictional currency only, nothing to deposit, wager, or withdraw.

"Can I actually buy any of these items?" → No. The Vault is a fantasy catalog; nothing ships.

"Do I need an account?" → No signup. Your empire lives in your browser only.

"Is this affiliated with any real casino, brand, or luxury house?" → No.

Build Priority

Global shell: nav, state store, currency/language switch, color/typography system.

Easy Money games (fastest to build, validates the win/animation/state loop).

Signature Spectacle games (Slots, Horse Racing, Meme Coin).

High-Roller Classics (Roulette, Baccarat/Blackjack).

Luxury Vault catalog + purchase flow.

Empire dashboard + footer/FAQ + polish pass on mobile.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4b434be4-c7b5-434b-a7ab-7fa04462cb2d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
