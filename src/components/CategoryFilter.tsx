"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CATEGORIES = [
  "All",
  "Women's",
  "Men's",
  "Love",
  "Baby",
  "Couple",
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
      <style dangerouslySetInnerHTML={{
        __html: `
        .flex::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {CATEGORIES.map(category => {
        const isSelected = currentCategory === category;
        let buttonStyle = isSelected
          ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md scale-105"
          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-[#0a0a0a] dark:text-gray-300 dark:border-white/10 dark:hover:border-white/30 hover:scale-105";

        if (category === "Women's") {
          buttonStyle = isSelected
            ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white border-transparent shadow-lg scale-105 shadow-purple-500/30"
            : "bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-indigo-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:scale-105 hover:shadow-md transition-all";
        }
        
        if (category === "Men's") {
          buttonStyle = isSelected
            ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white border-transparent shadow-lg scale-105 shadow-blue-500/30"
            : "bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 dark:from-cyan-500/20 dark:via-blue-500/20 dark:to-indigo-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:scale-105 hover:shadow-md transition-all";
        }

        return (
          <button
            key={category}
            onClick={() => handleSelect(category)}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all border ${buttonStyle}`}
          >
            {category}
          </button>
        );
      })}
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
