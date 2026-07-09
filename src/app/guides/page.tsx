import Header from "@/components/Header";
import Link from "@/components/AppLink";
import { guides } from "@/data/guides";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Guides & Tutorials",
  description:
    "Learn how to write better AI image prompts. Free, in-depth guides on prompt structure, the best AI image generators, negative prompts, cinematic lighting and responsible AI use.",
  keywords: [
    "ai image prompt guide",
    "how to write ai prompts",
    "midjourney tutorial",
    "stable diffusion guide",
    "ai art tutorials",
  ],
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Prompt Guides & Tutorials",
    description:
      "In-depth guides on writing AI image prompts, choosing tools, and creating better AI art.",
    url: "https://moment-galleri.vercel.app/guides",
    hasPart: guides.map((g) => ({
      "@type": "Article",
      headline: g.title,
      description: g.description,
      url: `https://moment-galleri.vercel.app/guides/${g.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[100px] dark:blur-[150px] animate-float-orb" />
        <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[80px] dark:blur-[120px] animate-float-orb" style={{ animationDelay: "2s" }} />
      </div>

      <Header />

      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-6 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Guides &amp; Tutorials
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">
          Practical, in-depth articles on writing better AI image prompts — from the fundamentals of
          prompt structure to choosing the right tool, mastering lighting, and using AI responsibly.
        </p>
      </div>

      <div className="relative z-10 px-4 sm:px-6 pb-32 sm:pb-20 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col bg-white dark:bg-[#0a0a0a] rounded-3xl border border-black/5 dark:border-white/10 p-7 hover:border-black/20 dark:hover:border-white/30 hover:-translate-y-1 transition-all shadow-sm"
            >
              <span className="inline-block w-max px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 mb-4">
                {guide.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {guide.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 flex-1">
                {guide.description}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
                <span>{guide.readingTime}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:underline">
                  Read guide →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
