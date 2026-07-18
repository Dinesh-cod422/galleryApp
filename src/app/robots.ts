import { MetadataRoute } from 'next';

// Aggressive commercial scrapers with no referral value. Deliberately NOT
// blocking AI answer engines (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot,
// Applebot-Extended) or SEO tools (Ahrefs, Semrush) any more:
//
//  - The content here is a public Instagram feed republished by its own author,
//    so there is nothing being protected by blocking them.
//  - AI answer engines are the fastest-growing referral channel for exactly this
//    kind of "what was the prompt" query.
//  - Blocking Ahrefs and Semrush mostly blinds us to our own backlink profile;
//    it does not stop competitors from seeing it.
const DISALLOWED_BOTS = [
  'Bytespider',
  'MJ12bot',
  'DotBot',
  'PetalBot',
  'DataForSeoBot',
  'Scrapy',
];

// Routes with no search value — crawling them only burns requests.
const PRIVATE_PATHS = ['/api/', '/upload', '/wishlist'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      ...DISALLOWED_BOTS.map((userAgent) => ({
        userAgent,
        disallow: '/',
      })),
    ],
    sitemap: 'https://moment-galleri.vercel.app/sitemap.xml',
  };
}
