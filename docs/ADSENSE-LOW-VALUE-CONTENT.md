# AdSense "Low value content" — Diagnosis and Remediation

**Site:** moment-galleri.vercel.app
**AdSense status:** Needs attention → *Low value content*
**ads.txt:** Authorized (`ca-pub-7320845599419472`)
**Date of audit:** 11 July 2026

---

## 1. Verdict

The site is not a gallery of your own work. It is a wrapper around **other people's Instagram
posts**. Every visual element a visitor sees — the homepage grid, the explore grid, the "more like
this" rail, and the hero of every pin page — is a third-party Instagram `<iframe>` with the caption
and account header cropped out of view. Your own images are never rendered anywhere; they exist only
in `og:image` and JSON-LD metadata, and six of them return HTTP 404. The only publisher-written text
on a pin page is an AI generation prompt plus four blocks of prose that are **82% identical across
all pages** because a generator stamps them out.

On top of that, a single line in the root layout puts `<link rel="canonical" href="https://moment-galleri.vercel.app">`
on **every** page, which tells Google that all 82 pin pages are duplicates of the homepage.

That combination is a precise, almost line-by-line match for what Google's Publisher Policies
prohibit. The `vercel.app` domain is **not** the cause, and AI-generated content is **not** the
cause. The cause is that there is almost no publisher content on the site, and what little exists is
machine-stamped and misattributed.

---

## 2. What the flag actually means

Three different Google documents get conflated in every forum thread on this topic. They are
distinct, and only two of them apply to you.

### 2.1 Google Publisher Policies — "Inventory value" (this is the one)

> "The content you provide should be of value to the user and **be the focal point** for users
> visiting your site or app."
> — [Google Publisher Policies, Inventory value](https://support.google.com/publisherpolicies/answer/11112688)

The same policy family prohibits Google-served ads on screens "without publisher-content or with
low-value content", on dead-end screens, and — critically for this site:

> "We do not allow Google-served ads on screens **with embedded or copied content from others
> without additional commentary, curation, or otherwise adding value to that content.**"
> — [Google Publisher Policies](https://support.google.com/adsense/answer/10502938)

### 2.2 AdSense Program Policies — non-content pages

> "Placed on pages published specifically for the purpose of showing ads."
> "Placed on **any non-content-based page**."
> — [AdSense Program Policies](https://support.google.com/adsense/answer/48182)

Note the second bullet has no intent requirement. A page can violate it without anyone meaning to.

Google's own AdSense blog applies this directly to *application* rejections:

> "Sites that contain **mostly images**, videos or Flash animations may not be approved… sites that
> consist only of **a site template and very little content** may not be approved."
> — [How to address insufficient content](https://blog.google/products/adsense/how-to-address-insufficient-content/)

And the approval-status wording itself:

> "Your site was found to have too little text." / "We believe that there isn't enough original,
> rich content that would be of value to users."
> — [AdSense Help 81904](https://support.google.com/adsense/answer/81904)

### 2.3 Search spam policies — "scaled content abuse" (adjacent, not identical)

> "Scaled content abuse is when many pages are generated for the primary purpose of manipulating
> search rankings and not helping users… creating large amounts of unoriginal content that provides
> little to no value to users, **no matter how it's created**."
> — [Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

This reaches AdSense only by incorporation-by-reference, and it governs ad *serving* on a live
account rather than the approval review that emitted your status string. It is a strong analogy for
your situation, not a direct quotation of the rule you failed. **Do not let anyone tell you the "Low
value content" flag *is* a scaled-content-abuse finding** — it isn't, and chasing that will send you
after the wrong fixes.

---

## 3. What is NOT the problem

Three widely believed things are wasting people's time. All three are false here.

### 3.1 The `vercel.app` subdomain is not the cause

`vercel.app` is on the [Public Suffix List](https://publicsuffix.org/list/), and Google explicitly
lists "subdomains on platforms that are already part of the public suffix list" as addable AdSense
sites ([answer/12170421](https://support.google.com/adsense/answer/12170421)). AdSense defines
ownership as *technical control* — "you must have access to the HTML source code of your site" —
not registrar ownership.

**The decisive proof is your own dashboard:** ads.txt reads **Authorized**. That means ownership
verification already *passed* and the site progressed to content review. "Low value content" is a
verdict on your content, not your domain.

Buy a custom domain anyway (~$10/yr) — it removes an untestable variable and every fallback ad
network (Mediavine, Raptive, Ezoic) hard-requires one. But it is **not** a policy requirement and it
will **not** fix this rejection on its own.

### 3.2 AI-generated content is not banned

Google has no ban on AI content on either the Search or the publisher surface. The Publisher
Policies mention AI zero times. Google renamed the policy from "spammy auto-generated content" to
"scaled content abuse" in March 2024 *specifically* to decouple it from generation method. Content
is judged on value, "no matter how it's created"
([gen-AI guidance](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)).

Your AI images are fine. The problem is that you don't *show* them.

### 3.3 There is no minimum word count, page count, or site age

Google publishes no such number anywhere. A scan of the official approval troubleshooter
([10118721](https://support.google.com/adsense/troubleshooter/10118721)) returns zero hits for "low
value", zero numeric thresholds, and no About/Contact/Privacy requirement. Every "30 posts / 800
words / 6 months old" rule you will read in forums is folklore.

**Every number in this document is engineering judgement, not a Google requirement.** They are
labelled as such.

---

## 4. Critical operational fact: production does not use `public/pins.json`

Before any content fix, understand where the content actually lives.

| | Source | Pins |
|---|---|---|
| **Development** | `public/pins.json` | 37 |
| **Production (live site)** | `https://raw.githubusercontent.com/Dinesh-cod422/jsonFiles/main/dataofMomentsGalleryApp` | **82** |

`src/data/mock-pins.ts:22-41`:

```ts
export async function getPins(): Promise<Pin[]> {
  if (process.env.NODE_ENV === "development") {
    return localPins as Pin[];          // public/pins.json — 37 pins
  }
  const res = await fetch(DATA_URL, {   // GitHub raw JSON — 82 pins
    next: { revalidate: 300 },
  });
  return await res.json();
}
```

**Editing `public/pins.json` changes nothing on the live site.** Every content fix below must be
applied to the JSON in the `Dinesh-cod422/jsonFiles` repository, or the two sources must be
consolidated. This is the single most common way a remediation effort silently accomplishes nothing.

Measured against the live 82-pin corpus:

- 82 / 82 pins have a fabricated `author`
- 82 / 82 pins have a `randomuser.me` avatar
- 82 / 82 pins have an Instagram `embedUrl`
- **13 distinct `imageUrl` values across 82 pins** — and none of them are ever displayed

---

## 5. The defects

Ordered by severity. Each is verified against the live site, not inferred.

---

### 🔴 D1 — The site's visible content is other people's Instagram posts

**Policy:** Publisher Policies, Inventory value — "embedded or copied content from others without
additional commentary, curation, or otherwise adding value to that content."

**Where it lives:**

`src/components/PinCard.tsx:46-54` — every card in every grid (home, explore, related):

```tsx
<div className="w-full relative h-[250px] sm:h-[450px] overflow-hidden pointer-events-none ...">
  <iframe
    src={getInstagramEmbedUrl(pin.embedUrl)}
    className="w-[110%] max-w-none border-0 absolute left-[-5%] ..."
    style={{ height: '600px', top: '-60px' }}
    scrolling="no"
    loading="lazy"
  />
</div>
```

`src/components/PinDetailClient.tsx:155-162` — the hero of every pin detail page:

```tsx
<div className="w-full max-w-[360px] sm:max-w-[420px] aspect-[4/5] ... overflow-hidden ...">
  <iframe
    src={getInstagramEmbedUrl(pin.embedUrl)}
    className="w-full h-full border-0 absolute inset-0 scale-[1.15] ..."
    scrolling="no"
  />
</div>
```

`src/components/PinCard.tsx:13-19` — the attribution is deliberately suppressed:

```ts
export function getInstagramEmbedUrl(url: string) {
  if (!url) return '';
  if (url.includes('/embed')) return url;
  const baseUrl = url.split('?')[0];
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}embed/?autoplay=0&hidecaption=true`;   // ← caption hidden
}
```

**Why it triggers the flag:** `hidecaption=true` removes Instagram's caption. The container is
`overflow-hidden` at 250–450px tall while the iframe is forced to `height: 600px` with `top: -60px`
— which crops off the Instagram header carrying the original poster's username. The result is a
third-party post, stripped of the attribution that would identify it as third-party, presented as
the site's own content. That is precisely the conduct the "replicated content" clause names, and
the cropping makes it look intentional.

**Evidence (live production, `curl https://moment-galleri.vercel.app/pin/39`):** the page contains
Instagram iframes and exactly **one** `<img>` tag — `/applogo.png`, the site logo.

---

### 🔴 D2 — Your own images are never displayed, and six of them 404

**Policy:** Inventory value (focal point); Misrepresentative content (advertising media you do not show).

**Where it lives:** `pin.imageUrl` appears in exactly four places in the codebase, and **none of them
renders it to a human**:

| File | Line | Use |
|---|---|---|
| `src/app/pin/[id]/page.tsx` | 52 | `og:image` meta tag |
| `src/components/PinDetailClient.tsx` | 83 | JSON-LD `contentUrl` |
| `src/app/api/upload-pin/route.ts` | 160 | written into the data |
| `src/data/mock-pins.ts` | 6 | type definition |

**Why it triggers the flag:** the site advertises an image to crawlers and social scrapers that no
visitor ever sees. Worse, the advertised file frequently does not exist.

**Evidence (live production):**

```
GET https://moment-galleri.vercel.app/pin/39
  → <meta property="og:image" content="https://moment-galleri.vercel.app/pins/9.webp">
GET https://moment-galleri.vercel.app/pins/9.webp
  → HTTP 404
```

Six pins in the local corpus reference images that do not exist on disk: `/pins/9.webp`,
`/pins/8.webp` (×2), `/pins/8.png`, `/pins/7.png`, `/pins/6.png`. Only `1.webp`–`5.webp` exist.

And the images that *do* exist are recycled — **10 distinct files serve all 37 local pins** (13
across the live 82). Ten different pins claim `/pins/1.webp` as their output. So even if you started
rendering `imageUrl` tomorrow, you would be showing an image that is *not* the output of that pin's
prompt — trading one misrepresentation for another.

---

### 🔴 D3 — Every pin page's "editorial content" is machine-stamped

**Policy:** Inventory value (focal point); "only a site template and very little content"; adjacent
to scaled content abuse.

**Where it lives:** [`src/lib/pinContent.ts`](../src/lib/pinContent.ts) — the whole file. It
generates the *About this prompt*, *How to use*, *Recommended tools*, *Tips*, and *FAQ* sections for
every pin from a fixed skeleton. `src/lib/pinContent.ts:182-195`:

```ts
const overview: string[] = [
  `${display} is a curated AI image prompt${tagList ? ` in the ${tagList.toLowerCase()} space` : ""}. It captures a specific, repeatable aesthetic so you can recreate the same polished look without starting from a blank page. Below you'll find the full prompt along with a short guide on how to adapt it for your own images.`,
  `Great results with AI art come down to the wording of the prompt — the lighting, the camera language, the composition and the small descriptive details all steer the final image. This page breaks the prompt down and shows you how to use it, which tools suit it best, and how to tweak it so the output feels like your own.`,
];
```

The second paragraph contains no interpolation at all — it is **byte-identical on all 82 pages**.

Rendered by `src/components/PinDetailClient.tsx:256-342` under the heading "Editorial Content —
unique, useful guidance for every prompt". It is not unique.

**Why it triggers the flag:** this is the "site template and very little content" case, stated
almost verbatim in Google's own blog post. A reviewer opening three pin pages sees the same prose
three times.

**Evidence:** static analysis of every template literal in `pinContent.ts`: **1,237 characters are
constant** (identical on every page) against **269 characters interpolated**. That is **82%
duplicate prose**, before counting the shared section headings and the FAQ answers, two of which are
fully constant.

The file's own docstring claims the opposite — "so that every page reads differently instead of
repeating a single boilerplate block". That claim is false, and it is the reason this defect has
gone unnoticed.

---

### 🔴 D4 — The raw AI prompt is the primary publisher text

**Policy:** Inventory value — content "should be of value to the user and be the focal point".

**Where it lives:** `src/components/PinDetailClient.tsx:210-234`. The prompt is given its own
heading ("AI Generation Prompt"), rendered as the dominant text block, with a *Read Full Prompt*
expander and a *Copy Full Prompt* call-to-action as the page's primary button.

It is also the `description` in the JSON-LD (`PinDetailClient.tsx:82`) and the basis of the meta
description (`src/app/pin/[id]/page.tsx:31-37`).

**Why it triggers the flag:** the prompt is a machine instruction, not writing for a reader. Many of
these prompts also appear to be pasted from the Instagram captions of the very posts being embedded
(see `update_pins.js` for examples with intact Tamil caption text and Instagram formatting), which
makes the page's main text *copied* as well as machine-oriented.

**Evidence:** on a rendered pin page the prompt runs to several hundred words; the surrounding
publisher prose is ~57 words of unique text (the rest being the shared template from D3).

---

### 🔴 D5 — Fabricated humans are asserted as the creators, in machine-readable form

**Policy:** Misrepresentative content → Misleading representation — content that "misrepresents,
misstates, or **conceals information about the publisher, the content creator**, the purpose of the
content, or the content itself."
([10502938](https://support.google.com/adsense/answer/10502938), [11185754](https://support.google.com/publisherpolicies/answer/11185754))

> ⚠️ **This is an applied reading, not an enumerated rule.** Google does not list fake bylines or
> stock avatars as examples of misrepresentation (its only examples concern impersonating Google
> products and misusing logos). This is *additional, independent* exposure — it is almost certainly
> **not** what produced the "Low value content" string, but it could earn you a *second* rejection
> after you fix the content problem.

**Where it lives:**

`src/components/PinDetailClient.tsx:84-91` — the strongest form: structured data telling Google that
a named `Person` created the work.

```tsx
"author": {
  "@type": "Person",
  "name": pin.author        // "ArtisticSoul", "QuoteArt", … — none of these people exist
},
"creator": {
  "@type": "Person",
  "name": pin.author
},
```

`src/app/pin/[id]/page.tsx:37` — the fake name is pushed into the search-results snippet:

```ts
description: `${content.displayTitle} — ${content.summary} Prompt curated by ${pin.author}.`,
```

`src/app/api/upload-pin/route.ts:147` — the site **manufactures a new fake identity on every
upload**:

```ts
const generatedAvatarUrl = `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`;
```

`next.config.ts:12-15` — and whitelists the stock-avatar host so the fakes can render:

```ts
{
  protocol: "https",
  hostname: "randomuser.me",
},
```

**Evidence:** 82 / 82 live pins carry a fabricated `author`; 82 / 82 carry a `randomuser.me` avatar.

---

### 🔴 D6 — Every page tells Google it is a duplicate of the homepage

**Policy:** none — this is a pure technical defect. But it is arguably the most damaging item in
this document, and it is a five-minute fix.

**Where it lives:** `src/app/layout.tsx:50-52`:

```ts
metadataBase: new URL("https://moment-galleri.vercel.app"),
alternates: {
  canonical: "/",
},
```

In the Next.js App Router, metadata fields are **shallow-merged from layout into pages**. A page
that does not declare its own `alternates` inherits the layout's. Only
`src/app/guides/page.tsx` and `src/app/guides/[slug]/page.tsx` override it. **Every pin page, and
every static page, therefore emits `canonical: "/"`.**

**Why it matters:** a canonical tag is a directive to Google saying "this page is a duplicate; index
the canonical instead." You are instructing Google to discard all 82 pin pages and treat them as the
homepage. The indexable inventory of the site collapses to the homepage, the guides, and a handful
of static pages — which is a nearly perfect description of "not enough original, rich content."

**Evidence (live production):**

```
$ curl -sL https://moment-galleri.vercel.app/pin/39 | grep canonical
<link rel="canonical" href="https://moment-galleri.vercel.app"/>
```

---

### 🟠 D7 — robots.txt and sitemap.xml contradict each other

**Where it lives:**

`src/app/robots.ts:27` disallows `/wishlist`:

```ts
const PRIVATE_PATHS = ['/api/', '/upload', '/wishlist'];
```

`src/app/sitemap.ts:44` submits `/wishlist` to Google anyway:

```ts
{ url: `${baseUrl}/wishlist`, changeFrequency: 'weekly' as const, priority: 0.4 },
```

**Why it matters:** submitting a URL you have blocked is a self-contradicting signal and produces
"Indexed, though blocked by robots.txt" / "Blocked by robots.txt" errors in Search Console. It is a
small sloppiness signal on a site being manually reviewed for quality.

---

### 🟠 D8 — Utility pages are non-content pages carrying ad code

**Policy:** AdSense Program Policies — "Placed on any non-content-based page." Inventory value bars
ads on dead-end screens and screens "used for alerts, navigation or other behavioral purposes."

**Where it lives:** the AdSense script is loaded globally in `src/app/layout.tsx:114`, so it is
present on:

- `/upload` (`src/app/upload/page.tsx`) — an admin submission form. No publisher content at all.
- `/wishlist` (`src/app/wishlist/page.tsx`) — an empty-by-default, client-state-only screen. A
  textbook dead-end.
- `/explore` (`src/app/explore/page.tsx`) — a bare grid of Instagram iframes and filter chips, with
  essentially no publisher prose. It is navigation, not content.

`robots.ts` disallows crawling of `/upload` and `/wishlist`, but **`Disallow` is not `noindex`** —
it prevents crawling, not indexing, and it does nothing about the ad code being served on those
screens to real users.

---

### 🟠 D9 — There is very little editorial content on the site, full stop

**Policy:** AdSense Help 81904 — "not enough original, rich content that would be of value to users."

**Evidence:** the entire site's genuine, human-written, non-templated prose is the guides section:
approximately **2,200 words across 5 guides** (~440 words each), against **82 pin pages** carrying
~57 words of unique text apiece. `/about` (`src/app/about/page.tsx`, 49 lines) is a boilerplate
shell that names no real person or organisation.

> **Engineering judgement, not a Google rule:** for publisher prose to plausibly be the "focal
> point" of a pin page, it needs to be the largest thing on the page — realistically a few hundred
> words of real writing per pin. Google publishes no number. This is my estimate of what it takes,
> not a threshold you can point at.

---

### 🟡 D10 — "Premium Resource" badge

`src/components/PinDetailClient.tsx:167-170` labels every page "PREMIUM RESOURCE". The content is
free, templated, and built on someone else's embed. It is a small credibility contradiction on a
page a human reviewer is reading sceptically. Remove it.

---

## 6. The fixes

### FIX 1 — Remove the global canonical (5 minutes, do this first)

**`src/app/layout.tsx`** — delete the `alternates` block from the root metadata export (lines 50-52):

```ts
// DELETE these three lines:
  alternates: {
    canonical: "/",
  },
```

With no `alternates` in the layout, Next emits no canonical tag and Google self-canonicalises each
URL, which is correct. Then add explicit canonicals to the pages that should have them.

**`src/app/pin/[id]/page.tsx`** — inside the returned object of `generateMetadata` (after line 37):

```ts
  return {
    title: `${content.displayTitle} | AI Prompt Design`,
    description: `${content.displayTitle} — ${content.summary}`,
    alternates: { canonical: `/pin/${pin.id}` },
    // …existing keywords / openGraph / twitter
  };
```

Add the same one-liner to `about`, `contact`, `explore`, `privacy`, `terms` and `disclaimer` page
metadata (`alternates: { canonical: '/about' }` and so on).

**Acceptance:** `curl -sL https://moment-galleri.vercel.app/pin/39 | grep canonical` returns
`href=".../pin/39"`, not the bare domain.

---

### FIX 2 — Stop presenting third-party embeds as your content

This is the blocker with real work behind it, and **no code change alone can solve it.** The site
currently has nothing of its own to show. You must produce **one real render per pin** — actually
run the prompt, save the output, and host it yourself.

Once you have real renders, change the data model so a pin *cannot* be published without one.

**`src/data/mock-pins.ts`** — replace the `Pin` interface and add a publishability gate:

```ts
import localPins from "../../public/pins.json";

/** Our own render of the prompt — the only thing allowed to be a page's focal media. */
export interface PinMedia {
  /** Root-relative path under /public, e.g. "/pins/renders/39-heritage-courtyard.webp". */
  src: string;
  width: number;
  height: number;
  /** Hand-written description of what is in the frame. Never the prompt text. */
  alt: string;
  /** Hand-written: what to look at, or where the model struggled. */
  caption: string;
  /** The model that actually produced this render, e.g. "Midjourney v7". */
  generatedWith: string;
}

export interface Pin {
  id: string;
  /** Original Instagram post. Reference and attribution only — never the focal media. */
  embedUrl?: string;
  /** Our own render. A pin without one is not publishable. */
  media: PinMedia;
  title: string;
  prompt: string;
  editorial: PinEditorial;   // see FIX 3
  filter?: string[];
  Tstatus?: string;
  TrendingPosition?: number;
}

function isPublishable(pin: Pin): boolean {
  const m = pin?.media;
  return Boolean(
    m?.src?.startsWith("/pins/renders/") &&
      m.width > 0 && m.height > 0 &&
      m.alt?.trim() && m.caption?.trim() && m.generatedWith?.trim()
  );
}
```

⚠️ **Do not ship `isPublishable` until the data actually carries `media`.** If you add this filter
while the JSON still uses `imageUrl`, `getPins()` returns an empty array and the site renders **zero
pins** — strictly worse than today. Migrate the data first, then turn on the gate.

**`src/components/PinCard.tsx`** — render your own image, not an iframe:

```tsx
import Image from "next/image";

<Link href={`/pin/${pin.id}`} prefetch={false} className="block relative rounded-[2rem] overflow-hidden …">
  <Image
    src={pin.media.src}
    alt={pin.media.alt}
    width={pin.media.width}
    height={pin.media.height}
    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  />
</Link>
```

**Where the Instagram embed belongs:** demoted to a clearly-labelled attribution block *below* your
own content, with your commentary around it, and **without** `hidecaption=true` or the cropping. If
you cannot say something original about the embedded post, remove the embed entirely — that is the
safer choice, and it is what the "additional commentary, curation, or otherwise adding value" clause
is asking for.

**`src/components/PinCard.tsx:13-19`** — if you keep embeds anywhere, stop hiding attribution:

```ts
export function getInstagramEmbedUrl(url: string) {
  if (!url) return '';
  if (url.includes('/embed')) return url;
  const baseUrl = url.split('?')[0];
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}embed/`;   // caption and account header visible
}
```

**Acceptance:** view-source on any pin page shows an `<img>`/`<picture>` of your own render as the
hero. `curl` of the `og:image` returns HTTP 200. No `hidecaption=true` anywhere. Every pin's render
is a distinct file.

---

### FIX 3 — Delete the prose generator; write the pages

**Delete `src/lib/pinContent.ts` entirely.** Do not refactor it, do not "improve the templates" —
a generator that stamps prose from a skeleton is the exact defect. Replace it with hand-written
fields carried in the data.

**Add to `src/data/mock-pins.ts`:**

```ts
/** Hand-written, per pin. No generator produces any of this. */
export interface PinEditorial {
  /** 2-4 paragraphs: what the image shows, why it was made, what to notice. */
  body: string[];
  /** What actually happened when you ran it — failures included. */
  notes: string;
  /** Optional: what you changed between attempts and why. */
  iterations?: string;
}
```

**Worked example — pin 39, "Cinematic Heritage Courtyard Portrait"** (this is the standard to hit;
write one of these per pin):

```json
{
  "id": "39",
  "title": "Cinematic Heritage Courtyard Portrait",
  "media": {
    "src": "/pins/renders/39-heritage-courtyard.webp",
    "width": 896,
    "height": 1152,
    "alt": "A woman in a maroon silk saree standing beside a carved stone pillar in a temple courtyard, lit from the left by low golden sunlight.",
    "caption": "Look at the shadow under the pillar's carving — that hard edge is what sells the low sun angle. It took four attempts to stop the model flattening it.",
    "generatedWith": "Midjourney v7"
  },
  "editorial": {
    "body": [
      "This prompt is trying to do one specific thing: put a hard, low, directional light into a space that AI generators habitually render with soft ambient fill. Heritage courtyards are full of carved stone, and carved stone only reads as three-dimensional when the light rakes across it. Get the light wrong and the whole image goes flat and plasticky, which is the failure mode most 'golden hour' prompts fall into.",
      "The saree is doing structural work here, not just decoration. A deep maroon with gold zari gives the model two high-contrast materials to separate — matte silk that absorbs light and metallic thread that throws it back. That contrast is what keeps the subject from dissolving into a warm-toned background, which is the second common failure of golden-hour prompts.",
      "If you are adapting this, the two lines worth keeping verbatim are the ones naming the light direction and the time of day. Everything else — the outfit, the architecture, the pose — you can swap freely. The moment you soften the light description, the image loses the thing that makes it work."
    ],
    "notes": "First two attempts put the sun behind the subject, which blew out the pillar entirely and lost all the carving detail. Moving the light description to explicitly say 'raking across the pillar from camera-left' fixed it. The model still struggles with the zari thread — it tends to render it as flat yellow rather than metallic, and no amount of prompt wording fully fixed that. I accepted it.",
    "iterations": "v1: sun behind subject, pillar blown out. v2: 'side light' — too vague, model averaged it back to soft fill. v3: explicit 'raking light from camera-left' — worked. v4: added 'hard shadow' to strengthen it, which pushed contrast too far and crushed the shadow side; reverted."
  }
}
```

Note what makes this pass and the generated text fail: it says what *happened*, what *failed*, and
what the author *decided*. No generator can produce that, which is exactly why it counts as
publisher content.

**Then render it** in `PinDetailClient.tsx`, replacing the `getPinContent(pin)` sections
(lines 256-342), and demote the prompt to a secondary, collapsed block *below* the editorial:

```tsx
<article className="mt-16 max-w-3xl">
  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-5">About this image</h2>
  {pin.editorial.body.map((para, i) => (
    <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-base sm:text-lg">
      {para}
    </p>
  ))}

  <h2 className="text-2xl font-extrabold tracking-tight mt-12 mb-4">What happened when I ran it</h2>
  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{pin.editorial.notes}</p>

  <details className="mt-12 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-black/5 dark:border-white/10 p-6">
    <summary className="font-bold cursor-pointer">The prompt used ({pin.media.generatedWith})</summary>
    <pre className="mt-4 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400 font-mono">
      {pin.prompt}
    </pre>
  </details>
</article>
```

**Acceptance:** open three pin pages side by side. No sentence appears on more than one of them.
`grep -r "pinContent" src/` returns nothing.

**Effort — be realistic.** This is the expensive item: 82 pins × (one real render + ~300 words of
honest writing). At 20 minutes per pin that is roughly 27 hours of human work. **You do not have to
do all 82.** Publishing 15–20 genuinely good pins and deleting or `noindex`-ing the rest is a far
stronger application than 82 thin ones — and it is much faster. Quality of inventory is what is
being judged, not quantity.

---

### FIX 4 — Remove the fabricated identities

**Data (in the `Dinesh-cod422/jsonFiles` repo, not just `public/pins.json`):** delete the `author`
and `avatarUrl` fields from all 82 pins.

**`src/components/PinDetailClient.tsx:78-100`** — the JSON-LD must name the real publisher:

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "name": pin.title,
  "description": pin.media.alt,          // human description, not the prompt
  "contentUrl": `https://moment-galleri.vercel.app${pin.media.src}`,
  "creditText": "Generated and curated by <YOUR REAL NAME>",
  "creator": {
    "@type": "Person",
    "name": "<YOUR REAL NAME>"           // a real, traceable person
  },
  "publisher": {
    "@type": "Organization",
    "name": "Moments Gallari",
    "logo": {
      "@type": "ImageObject",
      "url": "https://moment-galleri.vercel.app/applogo.png"
    }
  }
};
```

**`src/app/pin/[id]/page.tsx:37`** — drop the fake byline from the meta description:

```ts
description: `${content.displayTitle} — ${content.summary}`,
```

**`src/app/api/upload-pin/route.ts:~140-160`** — delete the avatar/author synthesis entirely. The
upload route must never invent a person. If you need attribution, attribute it to the real site
owner.

**`next.config.ts:12-15`** — remove the `randomuser.me` remote pattern. Nothing should be able to
load a stock avatar again.

**Disclose the AI, don't hide it.** Google does not require disclosure, but nothing penalises it,
and it directly defuses this exposure. A line like *"Generated with Midjourney v7, curated and
written by <name>"* on each pin converts your biggest liability into a trust signal.

**Acceptance:** `grep -ri "randomuser\|avatarUrl\|pin.author" src/ public/` returns nothing. No
`"@type": "Person"` in the JSON-LD names anyone who does not exist.

---

### FIX 5 — Fix the crawl surface

**`src/app/sitemap.ts:44`** — remove `/wishlist` from the sitemap (it is disallowed in robots.txt):

```ts
// DELETE this line:
{ url: `${baseUrl}/wishlist`, changeFrequency: 'weekly' as const, priority: 0.4 },
```

**`src/app/upload/page.tsx` and `src/app/wishlist/page.tsx`** — add a real `noindex`, because
`Disallow` is not `noindex`:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

(If these are client components, move the metadata into a colocated `layout.tsx` for the route.)

**Suppress the ad script on non-content pages.** The AdSense script currently loads globally from
`src/app/layout.tsx:114`, including on `/upload` and `/wishlist` — the exact "non-content-based
page" case. Move it out of the root layout into the routes that actually carry content
(`/`, `/pin/[id]`, `/guides/*`, `/explore` once it has real curation), or gate it on pathname.

**Acceptance:** `/upload` and `/wishlist` return `<meta name="robots" content="noindex">` and carry
no `adsbygoogle` script. `sitemap.xml` contains no URL that `robots.txt` disallows.

---

### FIX 6 — Give `/explore` and `/about` a reason to exist

**`/explore`** is currently a bare grid — navigation, not content. Either give each category real
curated commentary (a paragraph on what the category is, why these pins are in it, what to look for)
or `noindex` it and let the pin pages and guides carry the site.

**`/about`** should name a real person, say who runs this, why, and what the images are. A real About
page is worth far more than a boilerplate one. (Note: an About page is **not** an official AdSense
requirement — this is community-reported best practice.)

---

## 7. Order of work

1. **FIX 1 — remove the global canonical.** Five minutes, no content work, unblocks Google indexing
   anything at all. Do it today.
2. **Decide the corpus.** Pick the 15–20 pins you will actually stand behind. Delete or `noindex`
   the rest. This decision makes every later step 4× cheaper.
3. **FIX 4 — strip the fabricated identities.** Pure deletion, no writing required.
4. **FIX 5 — fix the crawl surface.** Mechanical.
5. **Produce one real render per surviving pin** (FIX 2). Host them yourself under
   `/pins/renders/`.
6. **Write the editorial for each surviving pin** (FIX 3). This is the long pole.
7. **Migrate the data** in the `Dinesh-cod422/jsonFiles` repo to the new shape — *then* turn on the
   `isPublishable` gate.
8. **FIX 6** — explore and about.
9. Deploy. Submit the sitemap in Search Console. **Wait until Google has actually re-crawled the
   fixed pages** — check Search Console's URL Inspection on three or four pin pages and confirm the
   new content is what Google sees.
10. *Only then* request re-review.

> **Do not request re-review until steps 1-9 are done and Google has re-crawled.** A reviewer
> landing on a page that still shows a cropped Instagram iframe and a canonical pointing at the
> homepage will reject again, and repeat rejections are the single most common outcome of rushing
> this.

---

## 8. Honest uncertainties

What follows is what I do **not** know. Treat anyone who states these confidently with suspicion.

- **The re-review timeline and retry limit are undocumented.** The "~2 weeks, unlimited
  re-applications" figure repeated in forums has no primary source. Google's official approval
  troubleshooter contains no re-review timeline at all.
- **There are no verified before/after case studies** for a site of this exact shape (AI-image
  gallery, prompt-as-body-text). Every fix in this document is derived from **policy text**, not from
  measured approval outcomes.
- **The effective words-per-page threshold is genuinely unknown.** My "a few hundred words per pin"
  and "15-20 pins" figures are engineering judgement about what it takes for prose to *be* the focal
  point. Google publishes no number and I am not going to invent one.
- **D5 (fabricated bylines) is an applied reading**, not an enumerated Google rule, and it is
  probably not what caused your current flag. Fix it anyway — it is cheap, and it is exposure.
- **Whether AdSense internally discounts free platform subdomains** cannot be disproven from
  outside. The official docs contain no such rule and your site demonstrably passed ownership
  verification, but the community signal is loud enough that buying a domain is worth the $10
  regardless.

**Policy-grounded** (quoted above, verified against live Google pages on 11 July 2026): D1, D2, D3,
D4, D8. **Applied reading:** D5. **Pure technical defect, no policy involved:** D6, D7.
**Engineering judgement:** all effort estimates, the 15-20 pin recommendation, and every word count.

---

## Appendix — recovering the abandoned automated fix attempt

An automated pass during this audit partially rewrote several source files before being cut off. Its
changes were **broken** (the `isPublishable` gate was added before the data was migrated, so
`getPins()` returned zero pins) and have been stashed rather than deleted:

```bash
git stash list          # stash@{0}: WIP: unauthorized subagent edits …
git stash show -p stash@{0}   # inspect before doing anything with it
```

Some of its ideas were sound — an `InstagramSource` attribution component, an `exploreContent` data
module, a `validate-pin-media.mjs` check script. Treat it as a sketch to read, not a patch to apply.
Do not `git stash pop` it onto a clean tree and deploy.
