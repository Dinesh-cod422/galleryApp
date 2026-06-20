import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers regarding AI generated content on Moments Gallari.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <Header />
      
      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-24 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">Disclaimer</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. AI-Generated Content</h2>
          <p>
            The images displayed on Moments Gallari are generated using various Artificial Intelligence models (such as Midjourney, Stable Diffusion, DALL-E, etc.). These images are not real photographs, and any resemblance to real persons, living or dead, or actual places or buildings is purely coincidental unless specifically prompted for public figures.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Accuracy of Prompts</h2>
          <p>
            We strive to provide accurate text prompts that were used to generate the showcased images. However, due to the nature of AI image generation, running the exact same prompt multiple times will often yield different results. We do not guarantee that using a prompt from our gallery will produce the exact image shown on our website.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Copyright and Usage</h2>
          <p>
            The legal status of AI-generated art is constantly evolving. As of our current understanding, images generated entirely by AI are generally in the public domain. However, we do not provide legal advice, and you are responsible for ensuring that your use of any generated images complies with the terms of service of the AI tool you use to generate them.
          </p>
          <p>
            The text prompts themselves are provided freely for your use. 
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. External Links</h2>
          <p>
            Moments Gallari may contain links to external websites that are not provided or maintained by or in any way affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Professional Advice</h2>
          <p>
            The information provided on Moments Gallari is for general informational and inspirational purposes only and does not constitute professional advice. 
          </p>
        </div>
      </div>
    </main>
  );
}
