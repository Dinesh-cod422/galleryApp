import { MetadataRoute } from 'next';

// Crawlers that provide no search traffic but hit AI/prompt sites hardest.
// Blocking them cuts edge requests without affecting Google/Bing indexing.
const DISALLOWED_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'CCBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
  'FacebookBot',
  'meta-externalagent',
  'AhrefsBot',
  'SemrushBot',
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
