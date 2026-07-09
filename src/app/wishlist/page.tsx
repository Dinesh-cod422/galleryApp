"use client";

import { useWishlist } from "@/context/WishlistContext";
import PinCard from "@/components/PinCard";
import Header from "@/components/Header";
import Link from "@/components/AppLink";
import { useState, useEffect } from "react";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <Header />

      <div className="relative z-10 px-4 sm:px-6 pt-12 sm:pt-32 pb-32 sm:pb-24 max-w-[2200px] mx-auto min-h-screen">
        <div className="mb-12 flex flex-col items-center justify-center text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Your Saved Gallery</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            A private collection of your favorite cinematic inspirations and aesthetic prompts.
          </p>
        </div>

        {!mounted ? (
          <div className="flex justify-center items-center h-[40vh]">
            <div className="w-8 h-8 rounded-full border-4 border-gray-300 dark:border-white/20 border-t-black dark:border-t-white animate-spin"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="w-24 h-24 mb-6 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/10 dark:border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">No saved posts yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              Explore the gallery and click the heart icon on any post to save it here for later.
            </p>
            <Link 
              href="/" 
              className="bg-black text-white dark:bg-white dark:text-black font-semibold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Discover Inspiration
            </Link>
          </div>
        ) : (
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-6 lg:gap-8 mx-auto space-y-3 sm:space-y-6">
            {wishlist.map((pin, index) => (
              <div key={pin.id} className="animate-fade-in-up" style={{ animationDelay: `${(index % 10) * 100}ms` }}>
                <PinCard pin={pin} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
