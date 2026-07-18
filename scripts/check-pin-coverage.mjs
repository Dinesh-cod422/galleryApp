#!/usr/bin/env node
/**
 * Reports which pins are ready to publish.
 *
 * A pin is READY when it has (a) a self-hosted render that exists on disk and
 * (b) hand-written editorial with no unresolved [PLACEHOLDER] markers.
 *
 * THIS SCRIPT WARNS. IT MUST NEVER GATE THE BUILD.
 * `getPins()` reads a remote GitHub URL this repo does not control. Any
 * build-time assertion over that data means one upstream edit — or one GitHub
 * outage — leaves the site permanently undeployable. Run it manually, or in CI
 * as an informational step, never as a failing check.
 *
 *   node scripts/check-pin-coverage.mjs            # against the live corpus
 *   node scripts/check-pin-coverage.mjs --local    # against public/pins.json
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_URL =
  "https://raw.githubusercontent.com/Dinesh-cod422/jsonFiles/main/dataofMomentsGalleryApp";

async function loadPins() {
  if (process.argv.includes("--local")) {
    return JSON.parse(readFileSync(join(root, "public/pins.json"), "utf8"));
  }
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Upstream fetch failed: ${res.status}`);
  return res.json();
}

/**
 * Parse the entry ids out of pin-editorial.ts without importing TypeScript.
 * Crude on purpose — this is a reporting tool, not a build dependency.
 */
function loadEntries() {
  const src = readFileSync(join(root, "src/data/pin-editorial.ts"), "utf8");
  const start = src.indexOf("PIN_ENTRIES: Record<string, PinEntry> = {");
  if (start === -1) return new Map();

  const entries = new Map();
  const body = src.slice(start);
  // Match each top-level `"id": {` and capture until the matching brace depth.
  const idRe = /^  "([^"]+)":\s*\{/gm;
  let m;
  while ((m = idRe.exec(body))) {
    const id = m[1];
    let depth = 0;
    let i = body.indexOf("{", m.index);
    const from = i;
    for (; i < body.length; i++) {
      if (body[i] === "{") depth++;
      else if (body[i] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    const chunk = body.slice(from, i + 1);
    entries.set(id, {
      hasMedia: /\bmedia:\s*\{/.test(chunk),
      hasEditorial: /\beditorial:\s*\{/.test(chunk),
      hasPlaceholder: /\[[A-Z][^\]]*\]|\[Replace/.test(chunk),
      src: (chunk.match(/src:\s*"([^"]+)"/) || [])[1],
    });
  }
  return entries;
}

const pins = await loadPins();
const entries = loadEntries();

const ready = [];
const drafting = [];
const untouched = [];

for (const pin of pins) {
  const e = entries.get(String(pin.id));
  if (!e) {
    untouched.push(pin.id);
    continue;
  }
  const imageOnDisk = e.src ? existsSync(join(root, "public", e.src)) : false;
  const problems = [];
  if (!e.hasMedia) problems.push("no media");
  else if (!imageOnDisk) problems.push(`image missing on disk (${e.src})`);
  if (!e.hasEditorial) problems.push("no editorial");
  if (e.hasPlaceholder) problems.push("unresolved [PLACEHOLDER]");

  if (problems.length === 0) ready.push(pin.id);
  else drafting.push(`${pin.id}: ${problems.join(", ")}`);
}

const total = pins.length;
console.log(`\nPin coverage — ${total} pins in the corpus\n`);
console.log(`  READY TO PUBLISH   ${ready.length}`);
console.log(`  IN PROGRESS        ${drafting.length}`);
console.log(`  NOT STARTED        ${untouched.length}\n`);

if (drafting.length) {
  console.log("In progress:");
  drafting.forEach((d) => console.log(`  - ${d}`));
  console.log("");
}

if (ready.length === 0) {
  console.log("No pin is publishable yet. Every pin page currently renders the");
  console.log("prompt plus a 'not yet documented' notice, which is honest but thin.");
  console.log("Do not reapply to AdSense in this state.\n");
} else if (ready.length < 15) {
  console.log(`Only ${ready.length} pin(s) fully documented. The audit's judgement —`);
  console.log("not a Google rule — is that ~20-30 real pages is a defensible corpus.\n");
}

// Always exit 0. See the header comment.
process.exit(0);
