import { MetadataRoute } from 'next';
import { getPins, type Pin } from '@/data/mock-pins';
import { guides } from '@/data/guides';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://moment-galleri.vercel.app';

  // Stable, hand-bumped date. Using `new Date()` here would stamp every URL as
  // "modified just now" on each ISR regeneration, making crawlers recrawl the
  // entire site continuously. Bump this when content meaningfully changes.
  const now = new Date('2026-07-09');

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
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Guide article entries
  const guideUrls = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Static route entries
  const routes = [
    { url: baseUrl, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/explore`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/guides`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/wishlist`, changeFrequency: 'weekly' as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: 'yearly' as const, priority: 0.3 },
  ].map((route) => ({ ...route, lastModified: now }));

  return [...routes, ...guideUrls, ...pinUrls];
}
