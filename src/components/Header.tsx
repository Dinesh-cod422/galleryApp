"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { wishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="fixed top-0 w-full z-50 glass-panel py-4 px-6 flex items-center justify-between gap-4 transition-all duration-300 border-b border-black/10 dark:border-white/5 bg-white/70 dark:bg-black/60 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        {/* Minimalist Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <img 
            src="/applogo.png" 
            alt="Logo" 
            className="w-10 h-10 rounded-full object-cover shadow-lg dark:shadow-glow group-hover:scale-110 transition-transform duration-500" 
          />
          <span className="font-bold text-xl hidden sm:block tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">PostGallery</span>
        </Link>
        
        <nav className="hidden md:flex gap-1 ml-4 font-medium text-sm">
          <Link href="/" className="bg-black/5 dark:bg-white/10 text-black dark:text-white px-5 py-2.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-all border border-transparent dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]">Discover</Link>
          <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white px-5 py-2.5 rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/5">Creators</button>
        </nav>
      </div>

      <div className="flex-1 max-w-xl px-4 hidden sm:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search aesthetics, prompts, creators..."
            className="w-full bg-black/5 hover:bg-black/10 focus:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 dark:focus:bg-white/10 text-black dark:text-white text-sm rounded-full border border-black/10 focus:border-black/30 dark:border-white/10 dark:focus:border-white/30 outline-none block pl-11 p-3 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 backdrop-blur-md"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Wishlist Button */}
        <Link 
          href="/wishlist" 
          className="relative p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform hover:scale-110">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {mounted && wishlist.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-black">
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all"
          aria-label="Toggle Theme"
        >
          {mounted ? (
            theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )
          ) : (
            <div className="w-5 h-5 opacity-0" />
          )}
        </button>
      </div>
    </header>
  );
}
