/**
 * Hand-written editorial content, one entry per pin, keyed by pin id.
 *
 * WHY THIS LIVES IN THE REPO AND NOT IN THE UPSTREAM JSON
 * ------------------------------------------------------
 * Pin metadata (prompt, tags, embed URL) comes from the `Dinesh-cod422/jsonFiles`
 * repo at request time. Editorial does not, deliberately:
 *
 *   - It is prose. It belongs in version control, in a diff, next to the code
 *     that renders it — not in a hand-edited remote JSON blob.
 *   - A missing or malformed entry here is a type error at build time. The same
 *     mistake in the remote JSON is a production incident.
 *   - It cannot be generated. That is the entire point. The previous system
 *     stamped this content out of a template in `pinContent.ts`, producing prose
 *     that was 82.8% byte-identical across 111 pages. Google's scaled-content
 *     policy covers content "created at scale... whether automation, humans, or a
 *     combination" — the remedy is not a better template, it is real writing.
 *
 * THE TEST FOR EVERY PARAGRAPH BELOW
 * ----------------------------------
 * If a sentence would still be true after copy-pasting it onto a different pin,
 * delete it. Generic prompt advice belongs in /guides, not here. What belongs
 * here is what happened when YOU ran THIS prompt: what worked, what broke, what
 * you changed, and what you gave up on.
 *
 * A pin with no entry here still renders — it just shows the prompt and a clear
 * "not yet documented" state. Run `node scripts/check-pin-coverage.mjs` to see
 * which pins are incomplete and which still contain [PLACEHOLDER] markers.
 */

/** Our own render of the prompt. The only thing allowed to be a page's focal media. */
export interface PinMedia {
  /** Root-relative path under /public, e.g. "/pins/renders/39-heritage-courtyard.webp". */
  src: string;
  width: number;
  height: number;
  /** What is actually in the frame, described for someone who cannot see it. Never the prompt text. */
  alt: string;
  /** What to look at, or where the model struggled. One or two sentences. */
  caption: string;
  /** The model that produced this exact render, e.g. "Midjourney v7". */
  generatedWith: string;
}

/** A single documented generation attempt. */
export interface PinRun {
  /** What you changed, or "unmodified" for a baseline run. */
  variant: string;
  /** What came out. Include the failures — they are the most valuable part. */
  outcome: string;
}

export interface PinEditorial {
  /**
   * 50-80 words. What this prompt is trying to do and whether it succeeds.
   * Shown directly under the image, above the prompt.
   */
  standfirst: string;
  /** The model + settings the runs below were done on. */
  testedOn: string;
  /** What you actually got. 2-4 entries, at least one of which is a failure. */
  runs: PinRun[];
  /** Specific, tested edits: exact text to swap, and what it changes. */
  adaptations: string[];
  /** Optional: per-model quirks worth knowing before you paste this anywhere. */
  modelNotes?: string;
}

export interface PinEntry {
  media?: PinMedia;
  editorial?: PinEditorial;
}

/**
 * The registry. Add an entry as you finish documenting each pin.
 *
 * IT STARTS EMPTY, DELIBERATELY. A worked template lives in the comment at the
 * bottom of this file rather than as a live entry, because a live entry with
 * placeholder values is not inert: its `media.src` would be emitted as `og:image`
 * and as JSON-LD `contentUrl` pointing at a file that does not exist — recreating
 * the exact broken-image-metadata defect this rewrite exists to remove.
 *
 * Copy the template, fill in every field with real results, and only then paste
 * it here. `npm run check:pins` reports what is ready and what still has
 * unresolved [PLACEHOLDER] markers.
 */
export const PIN_ENTRIES: Record<string, PinEntry> = {};

/** Editorial for a pin, or undefined if it has not been documented yet. */
export function getPinEntry(id: string): PinEntry | undefined {
  return PIN_ENTRIES[id];
}

/**
 * True when a pin has both a self-hosted render and finished editorial with no
 * unresolved [PLACEHOLDER] markers.
 *
 * Deliberately NOT used to filter `getPins()`. Gating the corpus on this would
 * mean an incomplete entry silently removes a live page, and a bad regex here
 * would empty the whole site. It drives presentation and the coverage report
 * only — see scripts/check-pin-coverage.mjs.
 */
export function isFullyDocumented(id: string): boolean {
  const entry = PIN_ENTRIES[id];
  if (!entry?.media || !entry.editorial) return false;
  return !JSON.stringify(entry).includes("[");
}

/* ---------------------------------------------------------------------------
 * WORKED TEMPLATE — copy this, fill it in, paste it into PIN_ENTRIES above.
 *
 * The example below is pin 39 ("Cinematic Heritage Courtyard Portrait"), whose
 * real record has a 1,953-character structured prompt and an `imageUrl` of
 * /pins/9.webp — which 404s. So step one for that pin is literally: generate the
 * image, save it under public/pins/renders/, and measure its dimensions.
 *
 * Note the level of specificity. "Mostly good results" is worthless; "4 of 6
 * seeds usable, the other 2 fused the hand into the pillar" is the kind of
 * sentence no template can produce, which is exactly why it counts as publisher
 * content. Include at least one failure and one thing you gave up on.
 *
 *   "39": {
 *     media: {
 *       src: "/pins/renders/39-heritage-courtyard.webp",
 *       width: 896,
 *       height: 1152,
 *       alt: "A woman in a maroon silk saree with gold zari embroidery stands beside a carved sandstone pillar in a heritage courtyard, lit from the left by low golden sunlight, with bougainvillea and a lit oil lamp behind her.",
 *       caption: "<what should the reader notice in YOUR render?>",
 *       generatedWith: "<model + version that produced this exact file>",
 *     },
 *     editorial: {
 *       standfirst: "<50-80 words: what this prompt is trying to do, and whether it succeeds>",
 *       testedOn: "<model + version> at <settings>, <date>",
 *       runs: [
 *         { variant: "Unmodified, 6 seeds", outcome: "<what held up, what broke, with counts>" },
 *         { variant: "<the change that fixed the main failure>", outcome: "<did it work? by how much?>" },
 *         { variant: "<a change that did NOT work>", outcome: "<document the dead end>" },
 *       ],
 *       adaptations: [
 *         "<exact text to swap, and what it changes>",
 *         "<a second concrete swap>",
 *       ],
 *       modelNotes: "<optional: inert tokens, where hands/fabric/skin break down per model>",
 *     },
 *   },
 * ------------------------------------------------------------------------- */
