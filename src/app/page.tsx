import PinCard from "@/components/PinCard";
import { getPins } from "@/data/mock-pins";
import Header from "@/components/Header";

export default async function Home() {
  const pins = await getPins();
  
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      {/* Background ambient glow - Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[100px] dark:blur-[150px] animate-float-orb" />
        <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[80px] dark:blur-[120px] animate-float-orb" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[100px] dark:blur-[150px] animate-float-orb" style={{ animationDelay: '4s' }} />
      </div>

      <Header />

      {/* Masonry Grid Layout */}
      <div className="relative z-10 px-4 sm:px-6 pt-32 pb-24 max-w-[2200px] mx-auto min-h-screen">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 sm:gap-8 mx-auto">
          {pins.map((pin, index) => (
            <div key={pin.id} className="animate-fade-in-up" style={{ animationDelay: `${(index % 10) * 100 + 100}ms` }}>
              <PinCard pin={pin} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
