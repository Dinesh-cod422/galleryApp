import PinCard from "@/components/PinCard";
import { getPins } from "@/data/mock-pins";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Aesthetic AI Prompts Library",
  description: "Search and filter through the complete catalog of cinematic inspirations, image styles, and Midjourney/Stable Diffusion prompt configurations.",
  keywords: ["ai prompt database", "midjourney catalog", "explore aesthetic prompts", "stable diffusion prompts"],
};

export default async function ExplorePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category.toLowerCase() : '';

  let pins = await getPins();

  // Apply Search Query Filter
  if (q) {
    pins = pins.filter(pin =>
      pin.title.toLowerCase().includes(q) ||
      pin.prompt.toLowerCase().includes(q) ||
      pin.author.toLowerCase().includes(q)
    );
  }

  // Apply Category Filter
  if (category && category !== 'all') {
    pins = pins.filter(pin => {
      // Check exact filter matches from pins.json first
      if (pin.filter && pin.filter.some(f => f.toLowerCase() === category.toLowerCase())) {
        return true;
      }
      
      // Smart fallback for specific categories
      const text = (pin.title + ' ' + pin.prompt).toLowerCase();
      
      if (category === "women's") {
        return /\b(woman|women|female|girl|bride|saree|kurti|her|she|ladies|lady)\b/.test(text);
      }
      
      if (category === "men's") {
        return /\b(man|men|male|boy|groom|he|his|him|guy|mens)\b/.test(text);
      }
      
      if (category === "love") {
        return /\b(love|romantic|heart|valentine|romance|affection)\b/.test(text);
      }
      
      if (category === "baby") {
        return /\b(baby|infant|toddler|child|kid|newborn)\b/.test(text);
      }
      
      if (category === "couple") {
        return /\b(couple|husband|wife|wedding|together|partner)\b/.test(text);
      }
      
      // Generic fallback
      return text.includes(category) || pin.author.toLowerCase().includes(category);
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      {/* Background ambient glow - Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[100px] dark:blur-[150px] animate-float-orb" />
        <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[80px] dark:blur-[120px] animate-float-orb" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[100px] dark:blur-[150px] animate-float-orb" style={{ animationDelay: '4s' }} />
      </div>

      <Header />

      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 max-w-[2200px] mx-auto">
        <h1 className="text-3xl font-bold mb-4">Explore Gallery</h1>
        <CategoryFilter />
      </div>

      {/* Masonry Grid Layout */}
      <div className="relative z-10 px-4 sm:px-6 pt-4 pb-32 sm:pb-24 max-w-[2200px] mx-auto min-h-screen">
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-6 lg:gap-8 mx-auto space-y-3 sm:space-y-6">
          {pins.map((pin, index) => (
            <div key={pin.id} className="animate-fade-in-up" style={{ animationDelay: `${(index % 10) * 100 + 100}ms` }}>
              <PinCard pin={pin} showTrendingTag={true} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
