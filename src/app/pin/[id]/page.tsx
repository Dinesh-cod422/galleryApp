import { getPins } from "@/data/mock-pins";
import PinDetailClient from "@/components/PinDetailClient";
import type { Metadata } from "next";

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

  // Create a clean summary from the prompt
  const cleanDescription = pin.prompt.length > 155
    ? `${pin.prompt.slice(0, 152)}...`
    : pin.prompt;

  return {
    title: `${pin.title} | AI Prompt Design`,
    description: `Aesthetic Prompt: "${cleanDescription}" by ${pin.author}. Get high-quality custom AI image generator prompt setups.`,
    keywords: [
      pin.title.toLowerCase(),
      ...(pin.filter || []).map(f => f.toLowerCase()),
      "moments gallari",
      "ai art design",
      "prompt setup",
      "copy ai prompt"
    ],
    openGraph: {
      title: `${pin.title} - Moments Gallari`,
      description: `Copy prompt: "${cleanDescription}"`,
      type: "article",
      images: [
        {
          url: pin.imageUrl,
          width: 800,
          height: 1000,
          alt: pin.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pin.title} - Moments Gallari`,
      description: `Copy prompt: "${cleanDescription}"`,
    }
  };
}

export default async function PinDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const pins = await getPins();
  const pin = pins.find(p => p.id === resolvedParams.id) || null;

  return <PinDetailClient pin={pin} />;
}
