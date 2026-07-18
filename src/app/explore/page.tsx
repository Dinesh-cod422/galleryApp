import PinCard from "@/components/PinCard";
import { getPins } from "@/data/mock-pins";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import Link from "@/components/AppLink";
import { filterPins, countByCategory, CATEGORIES } from "@/lib/pinFilters";
import type { Metadata } from "next";

/** Cards shown per page. The unpaginated grid rendered all 111 at once. */
const PAGE_SIZE = 24;

export const metadata: Metadata = {
  title: "Explore Aesthetic AI Prompts Library",
  description: "Search and filter through the complete catalog of cinematic inspirations, image styles, and Midjourney/Stable Diffusion prompt configurations.",
  keywords: ["ai prompt database", "midjourney catalog", "explore aesthetic prompts", "stable diffusion prompts"],
  alternates: { canonical: "/explore" },
};

export default async function ExplorePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category.toLowerCase() : '';

  const allPins = await getPins();

  // Strict tag/status matching — see src/lib/pinFilters.ts for why the old
  // regex fallbacks were removed.
  const pins = filterPins(allPins, q, category);
  const categoryCounts = countByCategory(allPins, CATEGORIES);

  // Paginate AFTER filtering, and clamp the index so ?page=999 or ?page=-1
  // lands on a real page instead of rendering an empty grid.
  const totalPages = Math.max(1, Math.ceil(pins.length / PAGE_SIZE));
  const requestedPage = Number.parseInt(
    typeof searchParams.page === "string" ? searchParams.page : "1",
    10
  );
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const visiblePins = pins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const buildPageHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/explore?${qs}` : "/explore";
  };

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
        <CategoryFilter counts={categoryCounts} />
      </div>

      {/* Masonry Grid Layout */}
      <div className="relative z-10 px-4 sm:px-6 pt-4 pb-32 sm:pb-24 max-w-[2200px] mx-auto min-h-screen">
        {pins.length === 0 ? (
          /* The grid used to render unconditionally, so a query with no matches
             produced a blank region with no message and no way back — the "All"
             chip clears `category` but preserves `q`, so the chips alone cannot
             recover from a zero-result search. */
          <div className="max-w-xl py-16">
            <h2 className="text-2xl font-extrabold tracking-tight mb-3">
              No prompts matched that search
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {q ? (
                <>Nothing here matches <strong>&ldquo;{q}&rdquo;</strong>. Try a shorter or more general word — the search looks at titles and prompt text.</>
              ) : (
                <>There are no prompts in this category yet.</>
              )}
            </p>
            <Link
              href="/explore"
              className="inline-block px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-black font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-6 lg:gap-8 mx-auto space-y-3 sm:space-y-6">
              {visiblePins.map((pin, index) => (
                <div key={pin.id} className="animate-fade-in-up" style={{ animationDelay: `${(index % 10) * 100 + 100}ms` }}>
                  <PinCard pin={pin} showTrendingTag={true} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="flex items-center justify-center gap-3 mt-16"
              >
                {page > 1 && (
                  <Link
                    href={buildPageHref(page - 1)}
                    className="px-5 py-3 rounded-full border border-black/10 dark:border-white/20 font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={buildPageHref(page + 1)}
                    className="px-5 py-3 rounded-full border border-black/10 dark:border-white/20 font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}
