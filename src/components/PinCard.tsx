"use client";

import Image from "next/image";
import Link from "@/components/AppLink";
import type { Pin } from "@/data/mock-pins";
import { getPinEntry } from "@/data/pin-editorial";
import { promptExcerpt } from "@/lib/promptStructure";
import { getInstagramEmbedUrl } from "@/components/InstagramCredit";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useEffect } from "react";

interface PinCardProps {
  pin: Pin;
  showTrendingTag?: boolean;
}

/**
 * A quiet tint per primary tag, so a grid of prompt cards has visual rhythm
 * instead of reading as one flat block. Purely decorative — it encodes nothing
 * a visitor needs, and the tag is also shown as text.
 */
const ACCENTS: Record<string, { from: string; to: string }> = {
  cinematic: { from: "from-purple-500/10", to: "to-indigo-500/5" },
  aesthetic: { from: "from-pink-500/10", to: "to-rose-500/5" },
  portrait: { from: "from-amber-500/10", to: "to-orange-500/5" },
  fashion: { from: "from-fuchsia-500/10", to: "to-purple-500/5" },
  love: { from: "from-rose-500/10", to: "to-pink-500/5" },
  couple: { from: "from-red-500/10", to: "to-rose-500/5" },
  anime: { from: "from-sky-500/10", to: "to-cyan-500/5" },
  "3d": { from: "from-teal-500/10", to: "to-emerald-500/5" },
  artistic: { from: "from-violet-500/10", to: "to-purple-500/5" },
};

const DEFAULT_ACCENT = { from: "from-gray-500/10", to: "to-gray-500/5" };

function accentFor(tag?: string) {
  return (tag && ACCENTS[tag.toLowerCase()]) || DEFAULT_ACCENT;
}

// Re-exported for backwards compatibility. The canonical definition — and the
// explanation of why the caption is no longer hidden — lives in InstagramCredit.
export { getInstagramEmbedUrl };

export default function PinCard({ pin, showTrendingTag = false }: PinCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLiked = mounted ? isInWishlist(pin.id) : false;
  const media = getPinEntry(pin.id)?.media;
  const excerpt = promptExcerpt(pin.prompt, 220);
  const accent = accentFor(pin.filter?.[0]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      removeFromWishlist(pin.id);
    } else {
      addToWishlist(pin);
    }
  };

  return (
    <div className="mb-6 sm:mb-8 break-inside-avoid relative group">
      <Link
        href={`/pin/${pin.id}`}
        prefetch={false}
        className="block relative rounded-[2rem] overflow-hidden bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 shadow-xl dark:shadow-2xl hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:border-black/10 dark:hover:border-white/20 hover:-translate-y-2 transition-all duration-700 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
      >
        {media ? (
          /* Our own render, once the pin has one. */
          <Image
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          /* No render yet, so the card presents the prompt itself — which is
             what this site actually publishes. Previously it embedded the
             Instagram post: uncropped that produced a grid of mismatched iframe
             heights, and cropped it concealed the fact that the media was a
             third-party frame. A prompt card avoids both and tells the visitor
             what they are about to open. The embed still appears, credited, on
             the pin page. */
          <div
            aria-hidden="true"
            /* Extra top padding when a status badge is overlaid, otherwise the
               absolutely-positioned pill sits on top of the first line of the
               prompt excerpt. */
            className={`relative px-5 pb-5 bg-gradient-to-br ${accent.from} ${accent.to} ${
              showTrendingTag && pin.Tstatus ? "pt-16" : "pt-6"
            }`}
          >
            <p className="font-mono text-[11px] leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-6 whitespace-pre-wrap">
              {excerpt}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Full prompt
            </span>
          </div>
        )}

        {/* Text-bearing card: the grid was previously 111 wordless tiles a visitor
            could not tell apart before clicking. */}
        <div className="p-4">
          <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2 text-gray-900 dark:text-white">
            {pin.title}
          </h3>
          {pin.filter && pin.filter.length > 0 && (
            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400">
              {pin.filter.slice(0, 2).map((t) => `#${t}`).join("  ")}
            </p>
          )}
        </div>
      </Link>

      {/* Status Tag Overlay */}
      {showTrendingTag && pin.Tstatus && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          {pin.Tstatus === 'Trending' && (
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-[10px] sm:text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-white/20 backdrop-blur-md flex items-center gap-1.5 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
                <path d="M17.5 19c-2.4 0-4.5-1.5-5.5-3.5-1 2-3.1 3.5-5.5 3.5-3.6 0-6.5-2.9-6.5-6.5 0-4.6 6.5-11 12-12.5 5.5 1.5 12 7.9 12 12.5 0 3.6-2.9 6.5-6.5 6.5zM12 4.2c-4 1.5-9 6.6-9 8.3 0 2.2 1.8 4 4 4 1.5 0 2.9-1.1 3.5-2.5h3c.6 1.4 2 2.5 3.5 2.5 2.2 0 4-1.8 4-4 0-1.7-5-6.8-9-8.3z"></path>
                <path fill="currentColor" d="M12 10.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z"></path>
              </svg>
              {pin.TrendingPosition ? `#${pin.TrendingPosition} Trending` : 'Trending'}
            </div>
          )}
          {pin.Tstatus === 'Popular' && (
            <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white text-[10px] sm:text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-white/20 backdrop-blur-md flex items-center gap-1.5 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
              </svg>
              Popular
            </div>
          )}
          {pin.Tstatus === 'New' && (
            <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white text-[10px] sm:text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-white/20 backdrop-blur-md flex items-center gap-1.5 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
                <path d="M12 2l2.4 7.6 7.6 2.4-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"></path>
              </svg>
              New
            </div>
          )}
        </div>
      )}

      {/* Wishlist Button Overlay. `opacity-0 group-hover` alone made this
          invisible to keyboard users — focus-visible restores it (WCAG 2.4.7). */}
      {mounted && (
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 z-20 p-3 rounded-full backdrop-blur-md transition-all duration-300 scale-90 sm:scale-100 shadow-lg border ${isLiked
            ? 'bg-red-500/90 text-white border-red-400'
            : 'bg-white/80 dark:bg-black/50 text-gray-600 dark:text-white border-white/20 dark:border-white/10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:scale-110 hover:bg-white dark:hover:bg-black/80'
            }`}
          aria-label={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isLiked ? "animate-pulse" : ""}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
