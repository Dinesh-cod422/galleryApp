"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "@/components/AppLink";
import { type Pin, type PinCardData } from "@/data/mock-pins";
import { getPinEntry } from "@/data/pin-editorial";
import { parsePromptSections, hasStructure } from "@/lib/promptStructure";
import PinCard from "@/components/PinCard";
import InstagramCredit from "@/components/InstagramCredit";
import Header from "@/components/Header";
import { useWishlist } from "@/context/WishlistContext";
import { getPinContent } from "@/lib/pinContent";

export default function PinDetailClient({ pin, relatedPins = [] }: { pin: Pin | null, relatedPins?: PinCardData[] }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

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
  const entry = getPinEntry(pin.id);
  const media = entry?.media;
  const editorial = entry?.editorial;

  // Presentation of the prompt's existing structure. Nothing is generated.
  const sections = parsePromptSections(pin.prompt);
  const structured = hasStructure(sections);

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
    // Truncated: the raw prompt runs to 5,395 chars on the longest pin. Not set
    // to content.summary — that string is near-identical across every pin and
    // would strengthen the duplicate-content signal rather than reduce it.
    "description": media
      ? media.alt
      : pin.prompt.length > 200 ? `${pin.prompt.slice(0, 197)}...` : pin.prompt,
    // Only advertise an image we actually host and render. `pin.imageUrl` from
    // the upstream data is shared across dozens of pins and 404s on ~36% of them,
    // so claiming it here would be misrepresentation with a broken link attached.
    ...(media ? { "contentUrl": media.src } : {}),
    // Organization, not Person: no individual is being credited here.
    "author": {
      "@type": "Organization",
      "name": "Moments Gallari"
    },
    "creator": {
      "@type": "Organization",
      "name": "Moments Gallari"
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

  // NOTE: FAQPage structured data was removed here. It marked up Q&As that a
  // template generated identically across all 111 pages. Google's structured-data
  // guidelines require marked-up content to be visible, original and genuinely
  // useful — emitting duplicated FAQ markup at that scale is a manual-action risk
  // on top of the low-value-content problem it was part of.

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white pb-32 sm:pb-20 selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      {/* Schema Markup for ImageObject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

        {/* Two columns only when there is an image to fill one. Without a render,
            reserving half the viewport for a placeholder leaves a large dead area
            beside the text and reads as a broken page. */}
        <div className={`flex flex-col ${media ? "lg:flex-row" : ""} gap-10 lg:gap-16 items-start w-full`}>

          {/* Hero: our own render. The Instagram embed is no longer the focal
              media — it appears further down as a credited citation. */}
          {media && (
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end shrink-0">
              <figure className="w-full max-w-[360px] sm:max-w-[420px] z-10">
                <Image
                  src={media.src}
                  alt={media.alt}
                  width={media.width}
                  height={media.height}
                  priority
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="w-full h-auto rounded-[2.5rem] shadow-2xl border border-black/10 dark:border-white/10"
                />
                <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {media.caption}
                  <span className="block mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Generated by us with {media.generatedWith}.
                  </span>
                </figcaption>
              </figure>
            </div>
          )}

          {/* Details Section */}
          <div className={`w-full ${media ? "lg:w-1/2" : "max-w-3xl"} flex flex-col justify-center animate-fade-in-up z-20 pt-2 lg:pt-8`} style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-6">


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

            {/* Standfirst — the first thing a reader gets in our own voice. */}
            {editorial && (
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                {editorial.standfirst}
              </p>
            )}

            {/* One compact line rather than a large empty placeholder box. */}
            {!media && (
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                We haven&apos;t published our own render of this prompt yet. The full
                prompt is below, and the original post is credited at the foot of
                the page.
              </p>
            )}

            <div className="w-full h-px bg-gradient-to-r from-black/10 dark:from-white/20 to-transparent mb-8" />

            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 dark:text-purple-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              AI Generation Prompt
            </h3>

            <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-[2rem] mb-10 border border-black/5 dark:border-white/10 shadow-xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-start relative group">
              {/* Shown in full. The prompt is what this site publishes, so
                  collapsing it behind a "Read Full Prompt" toggle hid the page's
                  actual content by default. */}
              <div className="w-full">
                {structured ? (
                  /* The prompt's own sections, rendered as sections. This is a
                     reformat of the author's text — no wording is added,
                     removed or summarised. */
                  <div className="space-y-5">
                    {sections.map((section, i) => (
                      <div key={i}>
                        {section.title && (
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1.5">
                            {section.title}
                          </h4>
                        )}
                        <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {section.lines.join("\n")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                    {pin.prompt}
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>

        {/* Editorial. Hand-written per pin in src/data/pin-editorial.ts — nothing
            on this page is generated from a template. A pin without an entry
            renders the notice below instead of filler. */}
        {editorial ? (
          <article className="mt-20 md:mt-28 pt-12 border-t border-black/10 dark:border-white/10 max-w-3xl">
            <section className="mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                What we got
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Tested on {editorial.testedOn}.
              </p>
              <ul className="space-y-6">
                {editorial.runs.map((run, i) => (
                  <li key={i}>
                    <h3 className="font-bold text-lg mb-1">{run.variant}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {run.outcome}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">
                How to adapt it
              </h2>
              <ul className="space-y-4">
                {editorial.adaptations.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-gray-600 dark:text-gray-300 leading-relaxed"
                  >
                    <span className="shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {editorial.modelNotes && (
              <section className="mb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-5">
                  Model notes
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {editorial.modelNotes}
                </p>
              </section>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-10 leading-relaxed">
              Note: when generating images based on a real person&apos;s photo, only
              use images you own or have explicit permission to use, and always
              respect others&apos; likeness and privacy.
            </p>
          </article>
        ) : (
          <div className="mt-20 md:mt-28 pt-12 border-t border-black/10 dark:border-white/10 max-w-3xl">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We haven&apos;t documented our own test runs for this prompt yet. When
              we do, this section will cover what the prompt produced, where it
              failed, and the specific edits that fixed it — the same treatment as
              our{" "}
              <Link href="/guides" className="underline underline-offset-4 font-semibold">
                prompt guides
              </Link>
              .
            </p>
          </div>
        )}

        {/* The original post, credited. */}
        <InstagramCredit embedUrl={pin.embedUrl} title={content.displayTitle} />

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

      {/* Fixed action buttons at the bottom of the screen */}
      <div className="fixed bottom-24 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-40 flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[2rem] border border-black/10 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
        <button
          onClick={copyPrompt}
          className="flex-1 min-w-0 sm:min-w-[220px] flex items-center justify-center gap-2 sm:gap-3 bg-gray-900 text-white dark:bg-white dark:text-black font-bold py-3.5 sm:py-4 px-4 sm:px-6 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-xl relative overflow-hidden group text-sm sm:text-base"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10">{copiedPrompt ? "Copied Prompt!" : "Copy Full Prompt"}</span>
        </button>

        <button
          onClick={shareLink}
          className="flex-1 min-w-0 sm:min-w-[220px] flex items-center justify-center gap-2 sm:gap-3 bg-white dark:bg-[#1a1a1a] text-black dark:text-white font-bold py-3.5 sm:py-4 px-4 sm:px-6 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-all border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 shadow-sm text-sm sm:text-base active:scale-[0.98]"
        >
          {copiedLink ? "Link Copied!" : "Share Link"}
        </button>
      </div>
    </main>
  );
}
