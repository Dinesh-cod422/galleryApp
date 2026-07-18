/**
 * Parses the structure that already exists inside a prompt so it can be rendered
 * as readable sections instead of one undifferentiated wall of text.
 *
 * This is PRESENTATION ONLY. It reformats text the author already wrote and
 * invents nothing — no summaries, no generated commentary, no added claims. If a
 * prompt has no structure, it is returned as a single unlabelled block and
 * rendered exactly as before.
 *
 * Two layouts appear in the corpus (63 of 111 prompts use one of them):
 *
 *   1. Divider blocks      ━━━━━━━━━━
 *                          FACE REFERENCE RULE
 *                          ━━━━━━━━━━
 *
 *   2. Bare capital headers   FACE & BEAUTY
 *                             Natural South Indian facial features
 */

export interface PromptSection {
  /** Section heading, or null for the opening text before any heading. */
  title: string | null;
  /** The section's lines, with bullet glyphs preserved as written. */
  lines: string[];
}

/** A line made only of box-drawing characters, used as a visual divider. */
const DIVIDER = /^[━─—=_*-]{4,}$/;

/**
 * A standalone heading: all-caps words, optionally with & / - and a trailing
 * colon. Deliberately requires >=4 chars and rejects lines ending in sentence
 * punctuation so that shouted prompt text ("ULTRA REALISTIC, 8K.") is not
 * mistaken for a heading.
 */
const HEADING = /^[A-Z][A-Z0-9 &/'-]{3,}:?$/;

/**
 * Headings beyond these limits are almost certainly a shouted title or a
 * sentence in caps rather than a section label. The longest genuine labels in
 * the corpus are around 20 characters ("QUALITY REQUIREMENTS",
 * "CAMERA / COMPOSITION", "FACE ACCURACY BOOST"), so 30 leaves headroom while
 * still rejecting lines like "EXTREMELY ULTRA-REALISTIC 8K CINEMATIC COUPLE
 * PORTRAIT", which is the prompt's title and belongs in the opening text.
 */
const MAX_HEADING_WORDS = 4;
const MAX_HEADING_CHARS = 30;

function isHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!HEADING.test(trimmed)) return false;
  if (trimmed.length > MAX_HEADING_CHARS) return false;
  if (trimmed.split(/\s+/).length > MAX_HEADING_WORDS) return false;
  return true;
}

export function parsePromptSections(prompt: string): PromptSection[] {
  if (!prompt?.trim()) return [];

  const raw = prompt.replace(/\r\n/g, "\n").split("\n");
  const sections: PromptSection[] = [];
  let current: PromptSection = { title: null, lines: [] };

  for (let i = 0; i < raw.length; i++) {
    const line = raw[i];
    const trimmed = line.trim();

    if (DIVIDER.test(trimmed)) {
      // A divider immediately followed by a heading introduces a section; the
      // closing divider after that heading is consumed by the same branch on a
      // later iteration, so it never reaches the output.
      continue;
    }

    if (isHeading(trimmed)) {
      // Close the previous section only if it actually holds something, so a
      // heading pair does not emit an empty block.
      if (current.title !== null || current.lines.length > 0) {
        sections.push(current);
      }
      current = { title: trimmed.replace(/:$/, ""), lines: [] };
      continue;
    }

    if (trimmed) current.lines.push(trimmed);
  }

  if (current.title !== null || current.lines.length > 0) {
    sections.push(current);
  }

  // A single unlabelled section means the prompt has no structure worth showing.
  // Return it as-is rather than pretending otherwise.
  return sections.filter((s) => s.title !== null || s.lines.length > 0);
}

/** True when parsing found real headings, i.e. sectioned rendering is worthwhile. */
export function hasStructure(sections: PromptSection[]): boolean {
  return sections.filter((s) => s.title !== null).length >= 2;
}

/**
 * A short plain-text excerpt for cards, taken from the prompt's opening prose.
 * Skips headings and bullet glyphs so the excerpt reads as a sentence.
 */
export function promptExcerpt(prompt: string, maxLength = 150): string {
  if (!prompt) return "";
  const firstProse = prompt
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !DIVIDER.test(l) && !isHeading(l) && !/^[•\-*]/.test(l));

  if (!firstProse) return "";
  if (firstProse.length <= maxLength) return firstProse;

  const clipped = firstProse.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 40 ? clipped.slice(0, lastSpace) : clipped).trim()}…`;
}
