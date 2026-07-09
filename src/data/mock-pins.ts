import localPins from "../../public/pins.json";

export interface Pin {
  id: string;
  embedUrl: string;
  imageUrl: string;
  title: string;
  prompt: string;
  author: string;
  avatarUrl: string;
  filter?: string[];
  Tstatus?: string;
  TrendingPosition?: number;
}

// NOTE: Once you upload your pins.json to GitHub, replace this URL with the Raw GitHub URL!
// For example: "https://raw.githubusercontent.com/username/repo/main/pins.json"
const DATA_URL =
  process.env.NEXT_PUBLIC_DATA_URL ||
  "https://raw.githubusercontent.com/Dinesh-cod422/jsonFiles/main/dataofMomentsGalleryApp";

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
