"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { getPins, type Pin } from "@/data/mock-pins";
import { getInstagramEmbedUrl } from "@/components/PinCard";
import Header from "@/components/Header";
import { useWishlist } from "@/context/WishlistContext";

export default function PinDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [pin, setPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getPins().then(pins => {
      setPin(pins.find(p => p.id === resolvedParams.id) || null);
      setLoading(false);
    });
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#000000] text-black dark:text-white">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 dark:bg-white/20 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-300 dark:bg-white/20 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-300 dark:bg-white/20 rounded col-span-2"></div>
                <div className="h-2 bg-gray-300 dark:bg-white/20 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-gray-300 dark:bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
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

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white pb-20 selection:bg-black/10 dark:selection:bg-white/30 relative transition-colors duration-300">
      {/* Ambient floating orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] dark:blur-[120px] animate-float-orb" />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] dark:blur-[150px] animate-float-orb" style={{ animationDelay: '3s' }} />
      </div>

      <Header />

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto pt-28 px-4 sm:px-6 relative z-10">

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

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Reel Section */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="w-full max-w-[400px] h-[500px] bg-white dark:bg-[#111] rounded-[2rem] overflow-hidden shadow-xl dark:shadow-2xl relative border border-black/5 dark:border-white/10 group lg:sticky top-28">
              <iframe
                src={getInstagramEmbedUrl(pin.embedUrl)}
                className="w-[120%] max-w-none border-0 absolute left-[-5%] opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                style={{ height: '850px', top: '-80px' }}
                scrolling="no"
                allowtransparency="true"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 flex flex-col justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-block px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 w-max text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                Premium Resource
              </div>

              {/* Add to Wishlist Button */}
              {mounted && (
                <button
                  onClick={() => isLiked ? removeFromWishlist(pin.id) : addToWishlist(pin)}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full border transition-all ${isLiked
                    ? 'bg-red-50 text-red-500 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-black/20 dark:bg-black dark:text-gray-400 dark:border-white/10 dark:hover:border-white/30'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLiked ? "animate-pulse" : ""}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {isLiked ? 'Saved' : 'Save'}
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              {pin.title}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <img src={pin.avatarUrl} alt={pin.author} className="w-12 h-12 rounded-full border-2 border-white dark:border-white/20 shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
              <div>
                <p className="font-medium text-lg tracking-wide">{pin.author}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Verified Creator</p>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-black/10 dark:from-white/20 to-transparent mb-8" />

            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 dark:text-purple-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              AI Generation Prompt
            </h3>

            <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-[2rem] mb-10 border border-black/5 dark:border-white/10 shadow-xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-start relative group">
              <div className={`text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed font-serif italic whitespace-pre-wrap transition-all duration-500 ${!isPromptExpanded ? "line-clamp-6" : ""}`}>
                "{pin.prompt}"
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
                className="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-gray-900 text-white dark:bg-white dark:text-black font-bold py-4 px-6 rounded-full hover:scale-105 transition-all shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10">{copiedPrompt ? "Copied Prompt!" : "Copy Full Prompt"}</span>
              </button>

              <button
                onClick={copyLink}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-white dark:bg-[#1a1a1a] text-black dark:text-white font-bold py-4 px-6 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-all border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 shadow-sm"
              >
                {copiedLink ? "Link Copied!" : "Share Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
