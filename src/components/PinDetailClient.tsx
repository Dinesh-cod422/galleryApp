"use client";

import { useState, useEffect } from "react";
import Link from "@/components/AppLink";
import { type Pin } from "@/data/mock-pins";
import PinCard, { getInstagramEmbedUrl } from "@/components/PinCard";
import Header from "@/components/Header";
import { useWishlist } from "@/context/WishlistContext";
import { getPinContent } from "@/lib/pinContent";

export default function PinDetailClient({ pin, relatedPins = [] }: { pin: Pin | null, relatedPins?: Pin[] }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!pin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#000000] text-black dark:text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Image Not Found</h1>
          <Link href="/" className="inline-block text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors border border-black/10 dark:border-white/10 rounded-full px-6 py-2 hover:bg-black/5 dark:hover:bg-white/5">
            Return to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const isLiked = mounted ? isInWishlist(pin.id) : false;
  const content = getPinContent(pin);

  const shareLink = async () => {
    const shareData = {
      title: pin?.title || "Moments Gallari",
      text: "Check out this beautiful AI prompt setup!",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Ignore AbortError when the user cancels the share dialog
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing", err);
        }
      }
    } else {
      // Fallback to copy link if sharing is not supported
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) {
        console.error("Failed to copy link", err);
      }
    }
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(pin.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error("Failed to copy prompt", err);
    }
  };

  // Structured Data (JSON-LD) for Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": content.displayTitle,
    "description": pin.prompt,
    "contentUrl": pin.imageUrl,
    "author": {
      "@type": "Person",
      "name": pin.author
    },
    "creator": {
      "@type": "Person",
      "name": pin.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Moments Gallari",
      "logo": {
        "@type": "ImageObject",
        "url": "https://moment-galleri.vercel.app/icon.png"
      }
    }
  };

  // FAQ structured data — gives search engines rich, unique Q&A content per page.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white pb-32 sm:pb-20 selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      {/* Schema Markup for ImageObject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Schema Markup for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Ambient floating orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] dark:blur-[120px] animate-float-orb" />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] dark:blur-[150px] animate-float-orb" style={{ animationDelay: '3s' }} />
      </div>

      <Header />

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto pt-6 sm:pt-24 md:pt-28 px-4 sm:px-6 relative z-10">

        {/* Back navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all group mb-8">
          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-black/10 dark:group-hover:bg-white/10 group-hover:-translate-x-1 transition-all border border-black/5 dark:border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </div>
          <span className="font-semibold tracking-wide text-sm">Back to Gallery</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start w-full">

          {/* Reel Section */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end shrink-0">
            <div className="w-full max-w-[360px] sm:max-w-[420px] aspect-[4/5] bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-black/10 dark:border-white/10 flex-shrink-0 z-10">
              <iframe
                src={getInstagramEmbedUrl(pin.embedUrl)}
                className="w-full h-full border-0 absolute inset-0 scale-[1.15] opacity-95 group-hover:opacity-100 transition-opacity duration-500"
                style={{ transformOrigin: 'center center' }}
                scrolling="no"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center animate-fade-in-up z-20 pt-2 lg:pt-8" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="inline-block px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 w-max text-xs font-bold tracking-widest text-gray-600 dark:text-gray-300 uppercase shadow-sm">
                Premium Resource
              </div>

              {/* Add to Wishlist Button */}
              {mounted && (
                <button
                  onClick={() => isLiked ? removeFromWishlist(pin.id) : addToWishlist(pin)}
                  className={`flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-full border transition-all shadow-sm ${isLiked
                    ? 'bg-red-50 text-red-500 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-black/20 dark:bg-black dark:text-gray-300 dark:border-white/10 dark:hover:border-white/30'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isLiked ? "animate-pulse" : ""}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {isLiked ? 'Saved' : 'Save'}
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight">
              {content.displayTitle}
            </h1>

            {/* Tag chips */}
            {pin.filter && pin.filter.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {pin.filter.map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?category=${encodeURIComponent(tag.toLowerCase())}`}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/30 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="w-full h-px bg-gradient-to-r from-black/10 dark:from-white/20 to-transparent mb-8" />

            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 dark:text-purple-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              AI Generation Prompt
            </h3>

            <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-[2rem] mb-10 border border-black/5 dark:border-white/10 shadow-xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-start relative group">
              <div className={`text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed font-serif italic whitespace-pre-wrap transition-all duration-500 ${!isPromptExpanded ? "line-clamp-6" : ""}`}>
                &quot;{pin.prompt}&quot;
              </div>

              {/* Fade out effect when collapsed */}
              {!isPromptExpanded && (
                <div className="absolute bottom-16 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />
              )}

              <button
                onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                className="mt-6 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all flex items-center gap-2 z-10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-5 py-2.5 rounded-full border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:scale-105"
              >
                {isPromptExpanded ? "Show Less" : "Read Full Prompt"}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-500 ${isPromptExpanded ? "rotate-180" : ""}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                onClick={copyPrompt}
                className="flex-1 min-w-0 sm:min-w-[200px] flex items-center justify-center gap-2 sm:gap-3 bg-gray-900 text-white dark:bg-white dark:text-black font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-full hover:scale-105 transition-all shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] relative overflow-hidden group text-sm sm:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10">{copiedPrompt ? "Copied Prompt!" : "Copy Full Prompt"}</span>
              </button>

              <button
                onClick={shareLink}
                className="flex-1 min-w-0 sm:min-w-[200px] flex items-center justify-center gap-2 sm:gap-3 bg-white dark:bg-[#1a1a1a] text-black dark:text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-all border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 shadow-sm text-sm sm:text-base"
              >
                {copiedLink ? "Link Copied!" : "Share Link"}
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Content — unique, useful guidance for every prompt */}
        <article className="mt-20 md:mt-28 pt-12 border-t border-black/10 dark:border-white/10 max-w-3xl">
          {/* Overview */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-5">
              About this prompt
            </h2>
            {content.overview.map((para, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-base sm:text-lg">
                {para}
              </p>
            ))}
          </section>

          {/* How to use */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">
              How to use this prompt
            </h2>
            <ol className="space-y-5">
              {content.howToSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white dark:bg-white dark:text-black font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Recommended tools + Tips */}
          <div className="grid sm:grid-cols-2 gap-10 mb-14">
            <section>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-5">
                Recommended AI tools
              </h2>
              <ul className="space-y-3">
                {content.recommendedTools.map((tool, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                    <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-5">
                Tips for the best results
              </h2>
              <ul className="space-y-3">
                {content.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                    <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* FAQ */}
          <section className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {content.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#0a0a0a] p-5 sm:p-6 rounded-2xl border border-black/5 dark:border-white/10"
                >
                  <h3 className="font-bold text-base sm:text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-8 leading-relaxed">
            Note: When generating images based on a real person&apos;s photo, only use images you own or
            have explicit permission to use, and always respect others&apos; likeness and privacy.
          </p>
        </article>

        {/* Related Pins Section */}
        {relatedPins && relatedPins.length > 0 && (
          <div className="mt-20 md:mt-32 pt-10 border-t border-black/10 dark:border-white/10 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">More Like This</h2>
            </div>
            
            <div className="columns-2 sm:columns-2 lg:columns-3 gap-3 sm:gap-6 lg:gap-8 space-y-3 sm:space-y-6 lg:space-y-8">
              {relatedPins.map((relatedPin) => (
                <PinCard key={relatedPin.id} pin={relatedPin} />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
