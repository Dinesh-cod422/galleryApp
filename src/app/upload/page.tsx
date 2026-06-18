"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AVAILABLE_FILTERS = [
  "Aesthetic",
  "Cinematic",
  "Portrait",
  "Couple",
  "Women's",
  "Men's",
  "Fashion",
  "Anime",
  "3D",
  "Love",
  "Collage",
  "Kids",
  "Artistic"
];

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    prompt: "",
    embedUrl: "",
    Tstatus: "Trending",
    TrendingPosition: "1",
  });
  
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/upload-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          filter: selectedFilters,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "Pin uploaded and saved successfully!");
        setFormData({
          prompt: "",
          embedUrl: "",
          Tstatus: "Trending",
          TrendingPosition: "1",
        });
        setSelectedFilters([]);
      } else {
        setErrorMessage(data.error || "Failed to upload pin.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-12 pb-32 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Upload New Pin
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Title, Image, Author, and Avatar are auto-generated. Fill out the core details below.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              {errorMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">

            <div className="sm:col-span-2">
              <label htmlFor="embedUrl" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Embed URL (Instagram Post link) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  name="embedUrl"
                  id="embedUrl"
                  required
                  value={formData.embedUrl}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-0 py-3 px-4 text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent transition-all"
                  placeholder="e.g. https://www.instagram.com/p/..."
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="prompt" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Prompt <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={6}
                  required
                  value={formData.prompt}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-0 py-3 px-4 text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent transition-all"
                  placeholder="Enter the full AI generation prompt here..."
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Filters (Select Multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_FILTERS.map(filter => {
                  const isSelected = selectedFilters.includes(filter);
                  return (
                    <button
                      type="button"
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected 
                          ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700" 
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="Tstatus" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Status
              </label>
              <div className="mt-1">
                <select
                  id="Tstatus"
                  name="Tstatus"
                  value={formData.Tstatus}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-0 py-3 px-4 text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent transition-all"
                >
                  <option value="Trending">Trending</option>
                  <option value="New">New</option>
                  <option value="Popular">Popular</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="TrendingPosition" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Trending Position
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="TrendingPosition"
                  id="TrendingPosition"
                  min="1"
                  value={formData.TrendingPosition}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-0 py-3 px-4 text-neutral-900 dark:text-white shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent transition-all"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center items-center px-8 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload Pin"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
