"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CATEGORIES = [
  "All",
  "Cinematic",
  "Portrait",
  "Aesthetic",
  "Collage",
  "Fashion",
  "Anime",
  "Vintage",
  "Streetwear",
  "3D"
];

function FilterList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get("category") || "All";

  const handleSelect = (category: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div 
      className="flex items-center gap-3 overflow-x-auto pb-4 pt-2"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .flex::-webkit-scrollbar {
          display: none;
        }
      `}} />
      
      {CATEGORIES.map(category => (
        <button
          key={category}
          onClick={() => handleSelect(category)}
          className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all border ${
            currentCategory === category
              ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md scale-105"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-[#0a0a0a] dark:text-gray-300 dark:border-white/10 dark:hover:border-white/30 hover:scale-105"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default function CategoryFilter() {
  return (
    <Suspense fallback={<div className="h-16" />}>
      <FilterList />
    </Suspense>
  );
}
