import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service and conditions of use for Moments Gallari.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <Header />
      
      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-24 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Moments Gallari ("the Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Description of Service</h2>
          <p>
            Moments Gallari provides a curated gallery of AI-generated art and the text prompts used to create them. The website allows users to browse images, copy prompts, and save items to a local wishlist. 
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Use of Content and Prompts</h2>
          <p>
            The text prompts provided on Moments Gallari are free to copy, modify, and use in your own AI generation tools (like Midjourney, Stable Diffusion, etc.). However, the images displayed on the site are provided for inspiration and visual reference.
          </p>
          <p>
            Users are permitted to use the text prompts to generate their own images. We do not claim copyright over the words used in the prompts.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. User Conduct</h2>
          <p>
            You agree not to use the Website to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Attempt to scrape, data mine, or mass download the content of the Website without express written permission.</li>
            <li>Interfere with or disrupt the services or servers or networks connected to the services.</li>
            <li>Reproduce, duplicate, copy, sell, trade, resell or exploit for any commercial purposes, any portion of the service (excluding the raw text prompts, which you may use freely).</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Disclaimer of Warranties</h2>
          <p>
            Your use of the service is at your sole risk. The service is provided on an "as is" and "as available" basis. Moments Gallari expressly disclaims all warranties of any kind, whether express or implied.
          </p>
          <p>
            We do not guarantee that the prompts provided will always produce the exact same result in AI image generators, as AI models are constantly updated and vary in output based on seeds and versions.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            Moments Gallari shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages resulting from your use or inability to use the service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes.
          </p>
        </div>
      </div>
    </main>
  );
}
