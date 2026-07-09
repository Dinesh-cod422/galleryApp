import { getPins } from "@/data/mock-pins";
import PinDetailClient from "@/components/PinDetailClient";
import { getPinContent } from "@/lib/pinContent";
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

  // Create a clean summary from the prompt
  const cleanDescription = pin.prompt.length > 155
    ? `${pin.prompt.slice(0, 152)}...`
    : pin.prompt;

  return {
    title: `${content.displayTitle} | AI Prompt Design`,
    description: `${content.displayTitle} — ${content.summary} Prompt curated by ${pin.author}.`,
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
      images: [
        {
          url: pin.imageUrl,
          width: 800,
          height: 1000,
          alt: content.displayTitle,
        }
      ],
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
  const pin = pins.find(p => p.id === resolvedParams.id) || null;

  // Find related pins
  let relatedPins: typeof pins = [];
  if (pin) {
    // 1. Try finding pins with overlapping filters
    relatedPins = pins
      .filter(p => p.id !== pin.id && p.filter?.some(f => pin.filter?.includes(f)))
      .slice(0, 12);
    
    // 2. If we don't have enough related pins, fill with random or trending pins
    if (relatedPins.length < 12) {
      const remaining = pins
        .filter(p => p.id !== pin.id && !relatedPins.some(rp => rp.id === p.id))
        .slice(0, 12 - relatedPins.length);
      relatedPins = [...relatedPins, ...remaining];
    }
  }

  return <PinDetailClient pin={pin} relatedPins={relatedPins} />;
}
