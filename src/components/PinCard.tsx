"use client";

import Link from "next/link";
import type { Pin } from "@/data/mock-pins";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useEffect } from "react";

interface PinCardProps {
  pin: Pin;
  showTrendingTag?: boolean;
}

export function getInstagramEmbedUrl(url: string) {
  if (!url) return '';
  if (url.includes('/embed')) return url;
  const baseUrl = url.split('?')[0];
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}embed/?autoplay=0&hidecaption=true`;
}

export default function PinCard({ pin, showTrendingTag = false }: PinCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLiked = mounted ? isInWishlist(pin.id) : false;

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
      <Link href={`/pin/${pin.id}`} prefetch={false} className="block relative rounded-[2rem] overflow-hidden cursor-zoom-in bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 shadow-xl dark:shadow-2xl hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:border-black/10 dark:hover:border-white/20 hover:-translate-y-2 transition-all duration-700 ease-out">

        {/* Subtle inner noise/glow texture overlay */}
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black/5 dark:from-white/10 via-transparent to-transparent transition-opacity duration-700 pointer-events-none" />

        <div className="w-full relative h-[250px] sm:h-[450px] overflow-hidden pointer-events-none bg-gray-100 dark:bg-black z-0">
          <iframe
            src={getInstagramEmbedUrl(pin.embedUrl)}
            className="w-[110%] max-w-none border-0 absolute left-[-5%] transition-transform duration-1000 group-hover:scale-[1.05] opacity-90 group-hover:opacity-100 pointer-events-none"
            style={{ height: '600px', top: '-60px' }}
            scrolling="no"
            loading="lazy"
          />
        </div>
        {/* Transparent overlay to capture clicks for Next.js Link navigation */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

      {/* Wishlist Button Overlay */}
      {mounted && (
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 z-20 p-3 rounded-full backdrop-blur-md transition-all duration-300 scale-90 sm:scale-100 shadow-lg border ${isLiked
            ? 'bg-red-500/90 text-white border-red-400'
            : 'bg-white/80 dark:bg-black/50 text-gray-500 dark:text-white border-white/20 dark:border-white/10 opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-white dark:hover:bg-black/80'
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
