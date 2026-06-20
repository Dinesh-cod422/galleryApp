import PinCard from "@/components/PinCard";
import { getPins } from "@/data/mock-pins";
import Header from "@/components/Header";
import Link from "next/link";

export default async function Home() {
  const allPins = await getPins();
  
  // Filter by Trending, Popular, and New, and sort by TrendingPosition (ascending)
  let trendingPins = allPins
    .filter(pin => pin.Tstatus === "Trending" || pin.Tstatus === "Popular" || pin.Tstatus === "New")
    .sort((a, b) => (a.TrendingPosition ?? 999) - (b.TrendingPosition ?? 999));
  
  // Fallback just in case GitHub pins.json doesn't have Tstatus yet
  if (trendingPins.length === 0) {
    trendingPins = allPins.slice(0, 8);
  } else {
    trendingPins = trendingPins.slice(0, 8);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Moments Gallari",
    "alternateName": ["Moment Galleri", "Moments Gallery"],
    "url": "https://moment-galleri.vercel.app",
    "description": "Explore a curated collection of beautiful, high-quality AI prompts and custom design ideas. Copy premium prompts for Midjourney, Stable Diffusion, and more.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://moment-galleri.vercel.app/explore?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      {/* Schema Markup for WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Background ambient glow - Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[100px] dark:blur-[150px] animate-float-orb" />
        <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[80px] dark:blur-[120px] animate-float-orb" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[100px] dark:blur-[150px] animate-float-orb" style={{ animationDelay: '4s' }} />
      </div>

      <Header />

      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-4 max-w-[2200px] mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">Trending Designs</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">A curated selection of the most popular aesthetic prompts.</p>
      </div>

      {/* Masonry Grid Layout */}
      <div className="relative z-10 px-4 sm:px-6 pt-8 pb-28 sm:pb-12 max-w-[2200px] mx-auto">
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-6 lg:gap-8 mx-auto space-y-3 sm:space-y-6">
          {trendingPins.map((pin, index) => (
            <div key={pin.id} className="animate-fade-in-up" style={{ animationDelay: `${(index % 10) * 100 + 100}ms` }}>
              <PinCard pin={pin} showTrendingTag={true} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16 mb-8">
          <Link href="/explore" className="px-8 py-4 bg-gray-900 text-white dark:bg-white dark:text-black font-bold rounded-full hover:scale-105 transition-all shadow-xl text-lg flex items-center gap-3">
            Explore All Designs
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        {/* SEO & Context Block for AdSense / Search Engines */}
        <section className="mt-24 mb-12 max-w-4xl mx-auto bg-white/50 dark:bg-gray-900/30 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-4">What is Moments Gallari?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            Moments Gallari is your ultimate destination for high-quality, professional AI image generation prompts. In the rapidly evolving world of artificial intelligence, achieving the perfect aesthetic often requires the perfect words. We meticulously curate the most stunning, cinematic, and photorealistic AI designs across the web and provide you with the exact text prompts used to create them.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Whether you are using Midjourney, Stable Diffusion, DALL-E, or any other advanced AI image generator, our gallery is designed to be your primary source of inspiration. Simply explore our categories, copy the provided premium prompts, and use them to jumpstart your own creative workflow. Discover the secrets behind viral Instagram aesthetics, luxury photography styles, and breathtaking digital art right here.
          </p>
        </section>
      </div>
    </main>
  );
}
