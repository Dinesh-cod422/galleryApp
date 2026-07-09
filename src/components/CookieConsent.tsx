"use client";

import { useState, useEffect } from "react";
import Link from "@/components/AppLink";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-white dark:bg-[#111111] border-t border-gray-200 dark:border-gray-800 shadow-2xl">
      <div className="max-w-[2200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>
            We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you've provided to them or that they've collected from your use of their services.
            {" "}
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
              Learn more in our Privacy Policy.
            </Link>
          </p>
        </div>
        <div className="flex-shrink-0 flex gap-3 w-full sm:w-auto">
          <button 
            onClick={acceptCookies}
            className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
