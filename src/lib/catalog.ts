export type VaultItem = {
  id: string;
  name: string;
  blurb: string;
  price: number;
  category: CategoryId;
  image: string;
  rare?: boolean;
  featured?: boolean;
};

export type CategoryId =
  | "couture"
  | "jewelry"
  | "cars"
  | "fragrance"
  | "estate"
  | "art"
  | "beauty";

export const CATEGORIES: { id: CategoryId; label: string; emoji: string }[] = [
  { id: "couture", label: "Haute Couture", emoji: "🧵" },
  { id: "jewelry", label: "Jewelry & Timepieces", emoji: "💎" },
  { id: "cars", label: "Supercars & Hypercars", emoji: "🏎️" },
  { id: "fragrance", label: "Artisanal Fragrance", emoji: "🫧" },
  { id: "beauty", label: "Make-Up & Beauty", emoji: "💄" },
  { id: "estate", label: "Real Estate & Extravagance", emoji: "🏝️" },
  { id: "art", label: "Fine Art", emoji: "🖼️" },
];

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const VAULT_ITEMS: VaultItem[] = [
  // Haute Couture
  { id: "c1", name: "Hand-Stitched Midnight Tuxedo", blurb: "Sewn by candlelight by someone who resents you.", price: 180_000, category: "couture", image: img("photo-1594938298603-c8148c4dae35") },
  { id: "c2", name: "One-Off Runway Gown", blurb: "Worn once, photographed 400 times, never again.", price: 950_000, category: "couture", image: img("photo-1490481651871-ab68de25d43d") },
  { id: "c3", name: "Unreleased Sneaker Drop (Pair 1 of 1)", blurb: "You will absolutely not walk in these.", price: 420_000, category: "couture", image: img("photo-1552346154-21d32810aba3") },
  { id: "c4", name: "Full-Length Vicuña Overcoat", blurb: "Warmer than your relationships.", price: 1_200_000, category: "couture", image: img("photo-1591047139829-d91aecb6caea") },
  // Jewelry
  { id: "j1", name: "Iced-Out Tourbillon Wristwatch", blurb: "Tells time. Mostly tells everyone about you.", price: 3_400_000, category: "jewelry", image: img("photo-1523170335258-f5ed11844a49") },
  { id: "j2", name: "88-Carat Colourless Diamond", blurb: "Legally a rock. Emotionally a personality.", price: 28_000_000, category: "jewelry", rare: true, image: img("photo-1515562141207-7a88fb7ce338") },
  { id: "j3", name: "Ceremonial Gold Crown", blurb: "No kingdom included. Sold as-is.", price: 12_000_000, category: "jewelry", image: img("photo-1589674781759-c21c37956a44") },
  { id: "j4", name: "Rope of Historic South Sea Pearls", blurb: "Previously owned by someone dramatic.", price: 4_800_000, category: "jewelry", image: img("photo-1611591437281-460bfbe1220a") },
  // Cars
  { id: "s1", name: "Carbon-Bodied Track Hypercar", blurb: "0–60 in the time it takes to regret it.", price: 6_500_000, category: "cars", image: img("photo-1503376780353-7e6692767b70") },
  { id: "s2", name: "Restored 1960s Racing Coupé", blurb: "Smells like petrol and inherited wealth.", price: 9_200_000, category: "cars", image: img("photo-1552519507-da3b142c6e3d") },
  { id: "s3", name: "Matching Fleet of Twelve", blurb: "One for each mood you're contractually allowed.", price: 42_000_000, category: "cars", rare: true, image: img("photo-1492144534655-ae79c964c9d7") },
  { id: "s4", name: "Chrome Roadster, Custom Order", blurb: "Reflective enough to avoid eye contact.", price: 2_100_000, category: "cars", image: img("photo-1544636331-e26879cd4d9b") },
  // Fragrance
  { id: "f1", name: "Oud Blend in a Solid Gold Flacon", blurb: "Two sprays and the room files a complaint.", price: 340_000, category: "fragrance", image: img("photo-1541643600914-78b084683601") },
  { id: "f2", name: "Diamond-Capped Signature Scent", blurb: "Bottled by a nose who charges by the sniff.", price: 1_750_000, category: "fragrance", image: img("photo-1592945403244-b3fbafd7f539") },
  { id: "f3", name: "Vintage Ambergris Extrait", blurb: "Sourced ethically-ish from the ocean.", price: 780_000, category: "fragrance", image: img("photo-1595425970377-c9703cf48b6d") },
  // Estate
  { id: "e1", name: "Private Island, Unnamed", blurb: "Name it after yourself. Everyone does.", price: 85_000_000, category: "estate", image: img("photo-1559128010-7c1ad6e1b6a5") },
  { id: "e2", name: "120m Mega-Yacht", blurb: "Has a smaller yacht inside it. Obviously.", price: 240_000_000, category: "estate", rare: true, image: img("photo-1567899378494-47b22a2ae96a") },
  { id: "e3", name: "Suborbital Flight Ticket", blurb: "Eleven minutes of weightless self-importance.", price: 55_000_000, category: "estate", image: img("photo-1517976487492-5750f3195933") },
  { id: "e4", name: "Majority Stake in a Sports Club", blurb: "The fans will love you for eleven days.", price: 1_400_000_000, category: "estate", rare: true, image: img("photo-1522778119026-d647f0596c20") },
  { id: "e5", name: "Alpine Glass Chalet", blurb: "Ski-in, ski-out, therapist-on-retainer.", price: 62_000_000, category: "estate", image: img("photo-1502672260266-1c1ef2d93688") },
  // Art
  { id: "a1", name: "Museum-Grade Oil Portrait", blurb: "She's judging you. She's always judging you.", price: 96_000_000, category: "art", image: img("photo-1577720580479-7d839d829c73") },
  { id: "a2", name: "Monumental Marble Sculpture", blurb: "Requires reinforcing your floors. Do it.", price: 34_000_000, category: "art", image: img("photo-1578321272176-b7bbc0679853") },
  { id: "a3", name: "Abstract Canvas, Very Large", blurb: "It's about capitalism, apparently.", price: 18_500_000, category: "art", image: img("photo-1541961017774-22349e4a1262") },
  { id: "a4", name: "Ancient Gilded Relic", blurb: "Provenance: complicated. Vibes: immaculate.", price: 210_000_000, category: "art", rare: true, image: img("photo-1580136579312-94651dfd596d") },
  // Make-Up & Beauty
  { id: "b1", name: "Diamond-Dust Highlighter", blurb: "Glow visible from low earth orbit.", price: 260_000, category: "beauty", image: img("photo-1596462502278-27bfdc403348") },
  { id: "b2", name: "24k Gold Leaf Facial Ritual", blurb: "Your face, but richer than you.", price: 890_000, category: "beauty", image: img("photo-1570172619644-dfd03ed5d881") },
  { id: "b3", name: "Couture Lipstick in a Carved Ruby Case", blurb: "One shade. It is called 'Rent'.", price: 1_150_000, category: "beauty", image: img("photo-1586495777744-4413f21062fa") },
  { id: "b4", name: "Bespoke Palette, Mixed to Your Aura", blurb: "A colourist flew in. She has opinions.", price: 640_000, category: "beauty", image: img("photo-1512496015851-a90fb38ba796") },
  { id: "b5", name: "Caviar Regeneration Serum, Lifetime Supply", blurb: "Ageing is for people with jobs.", price: 3_900_000, category: "beauty", image: img("photo-1620916566398-39f1143ab7be") },
  { id: "b6", name: "Private Glam Squad on Permanent Retainer", blurb: "They arrive before you wake up. Unsettling.", price: 14_000_000, category: "beauty", rare: true, image: img("photo-1522337360788-8b13dee7a37e") },

  // The Exclusive Collection — featured
  { id: "x1", name: "The Obsidian Key — Members-Only Everything", blurb: "One key. Every door. No explanation offered.", price: 500_000_000, category: "estate", rare: true, featured: true, image: img("photo-1613490493576-7fde63acd811") },
  { id: "x2", name: "Solitaire Necklace, Vault Release No. 001", blurb: "Kept behind three doors and one very tired guard.", price: 74_000_000, category: "jewelry", rare: true, featured: true, image: img("photo-1599643478518-a784e5dc4c8f") },
  { id: "x3", name: "The Midnight Elixir — Fragrance, One of One", blurb: "Composed once, then the formula was burned.", price: 9_500_000, category: "fragrance", rare: true, featured: true, image: img("photo-1547887538-e3a2f32cb1cc") },
  { id: "x4", name: "Atelier Couture Set, Beauty & Gown", blurb: "Arrives with a stylist and a small orchestra.", price: 31_000_000, category: "beauty", rare: true, featured: true, image: img("photo-1487412720507-e7ab37603c6f") },
];

export const FEATURED_ITEMS: VaultItem[] = VAULT_ITEMS.filter((i) => i.featured);