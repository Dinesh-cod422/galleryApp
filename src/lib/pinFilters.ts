import type { Pin } from "@/data/mock-pins";

/**
 * The category chips, shared by the server component that computes counts and
 * the client component that renders them.
 *
 * This lives here rather than in CategoryFilter.tsx because that file is
 * `"use client"`: Next turns a client module's exports into client *references*,
 * so importing this array into a server component yielded a proxy rather than an
 * array and `countByCategory` failed at runtime with "b is not iterable".
 */
export const CATEGORIES = [
  "All",
  "New",
  "Popular",
  "Trending",
  "Women's",
  "Men's",
  "Love",
  "Baby",
  "Couple",
  "Cinematic",
  "Portrait",
  "Aesthetic",
  "Collage",
  "Fashion",
  "Anime",
  "Vintage",
  "Streetwear",
  "3D",
] as const;

/**
 * Filtering for /explore.
 *
 * The previous implementation matched a category against the pin's tags and, if
 * that failed, fell through to a regular expression over the raw prompt text —
 * `/\b(woman|women|female|girl|bride|saree|kurti|her|she|ladies|lady)\b/` for
 * "Women's", and a bare `text.includes(category)` for everything else.
 *
 * That made the counts meaningless. "Women's" returned 89 of 111 pins when only
 * 44 carry the tag, because almost any portrait prompt mentions "her" or "she"
 * somewhere in three thousand characters. A visitor filtering by a category got
 * a set that did not correspond to anything they could see.
 *
 * Filtering now uses the tags the author actually applied, plus Tstatus for the
 * three status chips. It returns fewer results, and every one of them belongs.
 */

/** Chips backed by `Tstatus` rather than by a tag. */
const STATUS_CATEGORIES = new Set(["new", "popular", "trending"]);

export function matchesCategory(pin: Pin, category: string): boolean {
  const wanted = category.trim().toLowerCase();
  if (!wanted || wanted === "all") return true;

  if (STATUS_CATEGORIES.has(wanted)) {
    return (pin.Tstatus ?? "").toLowerCase() === wanted;
  }

  return (pin.filter ?? []).some((tag) => tag.toLowerCase() === wanted);
}

/**
 * Free-text search over the title and tags — the two things a visitor can
 * actually see on a card, so a hit is always explicable.
 *
 * Deliberately not searching raw prompt bodies: a query like "studio" matched
 * any prompt mentioning the word anywhere in several thousand characters of
 * camera notes, which produced large result sets with no visible reason for
 * inclusion.
 */
export function matchesQuery(pin: Pin, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  if (pin.title?.toLowerCase().includes(q)) return true;
  return (pin.filter ?? []).some((tag) => tag.toLowerCase().includes(q));
}

export function filterPins(pins: Pin[], query: string, category: string): Pin[] {
  return pins.filter(
    (pin) => matchesQuery(pin, query) && matchesCategory(pin, category)
  );
}

/**
 * How many pins each category holds, for the counts shown on the chips.
 * Computed from the same predicate the filter uses, so a chip can never
 * advertise a number the filtered page does not deliver.
 */
export function countByCategory(
  pins: Pin[],
  categories: readonly string[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const category of categories) {
    counts[category] =
      category.toLowerCase() === "all"
        ? pins.length
        : pins.filter((pin) => matchesCategory(pin, category)).length;
  }
  return counts;
}
