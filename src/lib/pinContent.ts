import { type Pin } from "@/data/mock-pins";

/**
 * Title normalisation for pin pages.
 *
 * THIS FILE USED TO GENERATE THE PAGE BODY. IT NO LONGER DOES, ON PURPOSE.
 *
 * It previously produced the overview, how-to steps, recommended tools, tips and
 * FAQ for all 111 pin pages by interpolating a fixed skeleton. Measured across
 * the live corpus that yielded 10 structural variants for 111 pages, 22 sentences
 * that were byte-identical on every page, and a mean shared-editorial fraction of
 * 82.8% — while the file's own docstring claimed "every page reads differently".
 *
 * That is the fact pattern Google's scaled-content-abuse policy describes, and it
 * is the most likely single cause of the repeated "Low value content" rejections.
 * Editorial is now hand-written per pin in `src/data/pin-editorial.ts`.
 *
 * Do not reintroduce body-copy generation here. If a section can be generated it
 * will be, and the site ends up back where it started.
 */

export interface PinContent {
  /** A clean, human-readable title, safe for <h1>, <title> and JSON-LD `name`. */
  displayTitle: string;
}

const GENERIC_TITLES = new Set(["", "untitled", "ai prompt", "new masterpiece"]);

/** Longest title we will emit. Beyond this we cut at a word boundary. */
const MAX_TITLE_LENGTH = 70;

/**
 * Clean up a raw upstream title.
 *
 * The upstream data has 67 distinct titles across 111 pins: 69 end in a literal
 * "...", 22 share the same truncated prefix, and one is a 381-character raw
 * prompt dump. Mid-word truncation reads as machine-generated, so we trim it.
 *
 * This is damage limitation, not a fix — the real repair is writing unique
 * titles upstream. Deliberately NOT falling back to a tag-derived name
 * ("Aesthetic Cinematic Prompt"): simulated over the live corpus that *reduces*
 * distinct titles from 67 to 55 and raises collisions from 51 to 60, because the
 * tag vocabulary is only six words wide.
 */
/** Convert an ALL-CAPS heading to sentence-friendly title case. */
function titleCase(value: string): string {
  const minor = new Set(["a", "an", "the", "of", "in", "on", "at", "for", "and", "or", "with"]);
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => {
      if (i > 0 && minor.has(word)) return word;
      // Capitalise the first *letter*, not charAt(0) — otherwise a word like
      // "(exact" keeps its lowercase e because the bracket is position zero.
      return word.replace(/[a-z]/, (c) => c.toUpperCase());
    })
    .join(" ");
}

/**
 * Some prompts open with the author's own `TITLE: ...` declaration. That is a
 * real, hand-written title and is far better than the stored one, because 74 of
 * the 111 stored titles are just the prompt's opening words truncated at 25
 * characters — not titles at all.
 *
 * Using it is presentation of existing authored data, not generation.
 */
function authoredTitle(pin: Pin): string | null {
  const match = pin.prompt?.match(/^TITLE:\s*([^\n]+)/im);
  if (!match) return null;

  const value = match[1].trim().replace(/[(\[{]$/, "").trim();
  if (value.length < 8 || value.length > MAX_TITLE_LENGTH) return null;

  // Only re-case if it was shouted; leave mixed-case titles as written.
  return value === value.toUpperCase() ? titleCase(value) : value;
}

/** True when the stored title is merely the prompt's opening words. */
function isPromptPrefix(title: string, prompt: string): boolean {
  const head = title.slice(0, Math.min(20, title.length)).toLowerCase();
  return head.length >= 8 && prompt.trim().toLowerCase().startsWith(head);
}

function buildDisplayTitle(pin: Pin): string {
  let raw = (pin.title || "").trim();

  // Drop trailing ellipsis (both the literal "..." and the single-char "…").
  raw = raw.replace(/\s*(\.{3}|…)\s*$/, "").trim();

  // When the stored title is just a truncated prompt prefix, prefer the
  // author's own TITLE: line if the prompt declares one.
  if (!raw || isPromptPrefix(raw, pin.prompt ?? "")) {
    const authored = authoredTitle(pin);
    if (authored) return authored;
  }

  if (!raw || GENERIC_TITLES.has(raw.toLowerCase())) {
    return "Untitled AI Image Prompt";
  }

  if (raw.length <= MAX_TITLE_LENGTH) return raw;

  // Cut at the last word boundary that fits, so we never split a word.
  const clipped = raw.slice(0, MAX_TITLE_LENGTH);
  const lastSpace = clipped.lastIndexOf(" ");
  return (lastSpace > 20 ? clipped.slice(0, lastSpace) : clipped).trim();
}

export function getPinContent(pin: Pin): PinContent {
  return { displayTitle: buildDisplayTitle(pin) };
}
