import Header from "@/components/Header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, getGuide } from "@/data/guides";
import type { Metadata } from "next";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    return { title: "Guide Not Found" };
  }

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: `https://moment-galleri.vercel.app/guides/${guide.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const related = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.updated,
    dateModified: guide.updated,
    author: { "@type": "Organization", name: "Moments Gallari" },
    publisher: {
      "@type": "Organization",
      name: "Moments Gallari",
      logo: {
        "@type": "ImageObject",
        url: "https://moment-galleri.vercel.app/applogo.png",
      },
    },
    mainEntityOfPage: `https://moment-galleri.vercel.app/guides/${guide.slug}`,
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] dark:blur-[120px] animate-float-orb" />
      </div>

      <Header />

      <article className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-32 sm:pb-20 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-black dark:hover:text-white transition-colors">
            Guides
          </Link>
        </nav>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 mb-5">
          {guide.category}
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-5">
          {guide.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500 mb-10">
          <span>{guide.readingTime}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span>Updated {guide.updated}</span>
        </div>

        {guide.intro.map((para, i) => (
          <p
            key={i}
            className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-5 first:text-xl"
          >
            {para}
          </p>
        ))}

        <div className="w-full h-px bg-gradient-to-r from-black/10 dark:from-white/20 to-transparent my-10" />

        {guide.sections.map((section, i) => (
          <section key={i} className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-5">
              {section.heading}
            </h2>
            {section.body.map((para, j) => (
              <p key={j} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-base sm:text-lg">
                {para}
              </p>
            ))}
            {section.list && (
              <ul className="space-y-3 mt-5">
                {section.list.map((item, k) => (
                  <li key={k} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                    <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* CTA back to gallery */}
        <div className="mt-14 p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 text-center">
          <h3 className="text-xl font-extrabold mb-3">Ready to try these ideas?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Browse our free gallery of ready-to-use AI prompts and put this guide into practice.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-7 py-3 bg-gray-900 text-white dark:bg-white dark:text-black font-bold rounded-full hover:scale-105 transition-all shadow-lg"
          >
            Explore Prompts →
          </Link>
        </div>

        {/* Related guides */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-black/10 dark:border-white/10">
            <h2 className="text-2xl font-extrabold tracking-tight mb-6">Keep reading</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="group p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/30 transition-all"
                >
                  <h3 className="font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
                    {g.title}
                  </h3>
                  <span className="text-sm text-gray-400 dark:text-gray-500">{g.readingTime}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
