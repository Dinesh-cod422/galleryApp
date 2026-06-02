"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Pin } from '@/data/mock-pins';

interface WishlistContextType {
  wishlist: Pin[];
  addToWishlist: (pin: Pin) => void;
  removeFromWishlist: (pinId: string) => void;
  isInWishlist: (pinId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Pin[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('guessme-wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist");
      }
    }
  }, []);

  const addToWishlist = (pin: Pin) => {
    setWishlist(prev => {
      if (prev.some(item => item.id === pin.id)) return prev; // Deduplication
      
      const newWishlist = [...prev, pin];
      localStorage.setItem('guessme-wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const removeFromWishlist = (pinId: string) => {
    setWishlist(prev => {
      const newWishlist = prev.filter(item => item.id !== pinId);
      localStorage.setItem('guessme-wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isInWishlist = (pinId: string) => {
    return wishlist.some(item => item.id === pinId);
  };

  // Only render children when mounted to prevent hydration mismatches with localStorage
  if (!mounted) {
    return null;
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
