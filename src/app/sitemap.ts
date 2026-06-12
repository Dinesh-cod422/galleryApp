import { MetadataRoute } from 'next';
import { getPins, type Pin } from '@/data/mock-pins';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://moment-galleri.vercel.app';

  // Fetch all dynamic pins to include them in the sitemap
  let pins: Pin[] = [];
  try {
    pins = await getPins();
  } catch (error) {
    console.error('Error loading pins for sitemap:', error);
  }

  // Create sitemap entries for dynamic pins
  const pinUrls = pins.map((pin) => ({
    url: `${baseUrl}/pin/${pin.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Static route entries
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];

  return [...routes, ...pinUrls];
}
