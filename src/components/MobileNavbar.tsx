"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function MobileNavbar() {
  const pathname = usePathname();
  const { wishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const navItems: {
    name: string;
    href: string;
    icon: React.ReactNode;
    hasBadge?: boolean;
    isAction?: boolean;
  }[] = [
    {
      name: "Home",
      href: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={pathname === "/" ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      name: "Explore",
      href: "/explore",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/explore" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={pathname === "/explore" ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      )
    },

    {
      name: "Wishlist",
      href: "/wishlist",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/wishlist" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={pathname === "/wishlist" ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ),
      hasBadge: true
    }
  ];

  return (
    <div className="sm:hidden fixed bottom-0 w-full z-50 pb-[env(safe-area-inset-bottom)] bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-black/10 dark:border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-5px_20px_rgba(255,255,255,0.05)]">
      <nav className="flex justify-around items-center px-2 py-2 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isAction) {
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="relative -mt-6 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 text-white dark:text-black shadow-xl border-[4px] border-white/80 dark:border-[#0a0a0a] hover:scale-105 transition-transform"
              >
                {item.icon}
              </Link>
            );
          }

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive 
                  ? "text-black dark:text-white" 
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.hasBadge && mounted && wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white dark:border-black shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-1 ${isActive ? "font-bold" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* Theme Toggle in Mobile Nav */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex flex-col items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {mounted ? (
            theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )
          ) : (
            <div className="w-6 h-6 opacity-0" />
          )}
          <span className="text-[10px] font-medium mt-1">Theme</span>
        </button>
      </nav>
    </div>
  );
}
