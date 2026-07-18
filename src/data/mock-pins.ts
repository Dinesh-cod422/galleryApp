import localPins from "../../public/pins.json";
import { promptExcerpt } from "@/lib/promptStructure";

export interface Pin {
  id: string;
  embedUrl: string;
  imageUrl: string;
  title: string;
  prompt: string;
  /**
   * Legacy fields. Every value that ever existed here was fabricated — invented
   * handles paired with randomuser.me stock avatars — which is a Publisher
   * Policies "Misrepresentation" exposure. They are optional so the upstream JSON
   * can drop them without breaking the build, and nothing renders them any more.
   * Remove from the type once the upstream data is clean.
   */
  author?: string;
  avatarUrl?: string;
  filter?: string[];
  Tstatus?: string;
  TrendingPosition?: number;
}

/**
 * The card-sized projection of a Pin.
 *
 * Grids render every pin, and 85% of the corpus payload is prompt text (277KB of
 * 326KB). Serialising whole Pin objects into a grid therefore ships several
 * hundred KB of prompt bodies that no card displays. Cards receive this instead,
 * which is ~52KB for the entire 111-pin corpus.
 */
export interface PinCardData {
  id: string;
  title: string;
  filter?: string[];
  Tstatus?: string;
  TrendingPosition?: number;
  embedUrl?: string;
  imageUrl?: string;
  /** Short excerpt computed on the server, so the full prompt stays behind. */
  excerpt?: string;
  /**
   * Legacy field. Wishlist entries saved before this split stored the whole Pin,
   * so a card may still arrive with a full prompt and no excerpt.
   */
  prompt?: string;
}

// NOTE: Once you upload your pins.json to GitHub, replace this URL with the Raw GitHub URL!
// For example: "https://raw.githubusercontent.com/username/repo/main/pins.json"
const DATA_URL =
  process.env.NEXT_PUBLIC_DATA_URL ||
  "https://raw.githubusercontent.com/Dinesh-cod422/jsonFiles/main/dataofMomentsGalleryApp";

/** Project a Pin down to what a card actually renders. */
export function toCardData(pin: Pin): PinCardData {
  return {
    id: pin.id,
    title: pin.title,
    filter: pin.filter,
    Tstatus: pin.Tstatus,
    TrendingPosition: pin.TrendingPosition,
    embedUrl: pin.embedUrl,
    imageUrl: pin.imageUrl,
    excerpt: promptExcerpt(pin.prompt, 220),
  };
}

export async function getPins(): Promise<Pin[]> {
  if (process.env.NODE_ENV === "development") {
    return localPins as Pin[];
  }

  try {
    const res = await fetch(DATA_URL, {
      next: { revalidate: 300 }, // Re-fetch data every 5 minutes so new uploads appear quickly
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch pins: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching pins:", error);
    return [];
  }
}
