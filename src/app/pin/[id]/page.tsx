import { getPins } from "@/data/mock-pins";
import PinDetailClient from "@/components/PinDetailClient";
import { getPinContent } from "@/lib/pinContent";
import { getPinEntry } from "@/data/pin-editorial";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Pre-render every known pin at build time so navigations and prefetches are
// served from the CDN instead of invoking a server render per request.
// dynamicParams keeps newly uploaded pins working: they render on first hit.
export const dynamicParams = true;

export async function generateStaticParams() {
  const pins = await getPins();
  return pins.map((pin) => ({ id: pin.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const pins = await getPins();
  const pin = pins.find(p => p.id === resolvedParams.id);
  
  if (!pin) {
    return {
      title: "Design Not Found - Moments Gallari",
      description: "This design could not be found.",
    };
  }

  const content = getPinContent(pin);
  const entry = getPinEntry(pin.id);

  // Prefer our own writing for the description. The previous value was built from
  // a generated `summary` that was near-identical on all 111 pages, which is
  // exactly the duplicate signal we are trying to remove. Falling back to a
  // prompt excerpt is weaker but at least varies per pin.
  const description = entry?.editorial?.standfirst
    ? entry.editorial.standfirst.slice(0, 155)
    : pin.prompt.length > 155
      ? `${pin.prompt.slice(0, 152)}...`
      : pin.prompt;

  const cleanDescription = pin.prompt.length > 155
    ? `${pin.prompt.slice(0, 152)}...`
    : pin.prompt;

  return {
    title: `${content.displayTitle} | AI Prompt Design`,
    description,
    alternates: { canonical: `/pin/${pin.id}` },
    keywords: [
      content.displayTitle.toLowerCase(),
      ...(pin.filter || []).map(f => f.toLowerCase()),
      "moments gallari",
      "ai art design",
      "prompt setup",
      "copy ai prompt"
    ],
    openGraph: {
      title: `${content.displayTitle} - Moments Gallari`,
      description: `Copy prompt: "${cleanDescription}"`,
      type: "article",
      // Only advertise an image we actually host. `pin.imageUrl` 404s on roughly
      // 36% of the corpus and is shared across dozens of pins, so declaring it
      // hands crawlers and social scrapers a broken or misleading preview.
      ...(entry?.media
        ? {
            images: [
              {
                url: entry.media.src,
                width: entry.media.width,
                height: entry.media.height,
                alt: entry.media.alt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.displayTitle} - Moments Gallari`,
      description: `Copy prompt: "${cleanDescription}"`,
    }
  };
}

export default async function PinDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const pins = await getPins();

  // getPins() returns [] when the upstream GitHub fetch fails. Without this guard
  // a transient outage would make notFound() fire for every pin and cache a 404
  // for the whole catalogue. Throwing yields a 500, which is retried, not cached.
  if (pins.length === 0) {
    throw new Error("Pin catalogue is unavailable; refusing to serve a 404.");
  }

  const pin = pins.find(p => p.id === resolvedParams.id);

  // Unknown ids previously rendered HTTP 200 with an empty shell — a soft 404.
  if (!pin) {
    notFound();
  }

  // 1. Try finding pins with overlapping filters
  let relatedPins = pins
    .filter(p => p.id !== pin.id && p.filter?.some(f => pin.filter?.includes(f)))
    .slice(0, 12);

  // 2. If we don't have enough related pins, fill with random or trending pins
  if (relatedPins.length < 12) {
    const remaining = pins
      .filter(p => p.id !== pin.id && !relatedPins.some(rp => rp.id === p.id))
      .slice(0, 12 - relatedPins.length);
    relatedPins = [...relatedPins, ...remaining];
  }

  return <PinDetailClient pin={pin} relatedPins={relatedPins} />;
}
