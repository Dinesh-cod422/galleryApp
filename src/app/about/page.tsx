import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Moments Gallari, our mission to curate the best AI prompts, and the team behind the scenes.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <Header />
      
      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-24 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">About Us</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
            Welcome to Moments Gallari, your premium destination for exploring, discovering, and getting inspired by high-quality AI-generated art and the prompts that created them.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
          <p>
            In the rapidly evolving world of Artificial Intelligence, creating the perfect image often requires the perfect prompt. We realized that while there are many beautiful AI images online, the secret behind them—the text prompts—are often hidden. 
          </p>
          <p>
            Our mission is to bridge this gap. We curate the most aesthetic, cinematic, and professional AI designs and provide you with the exact prompts used to generate them. Whether you are using Midjourney, Stable Diffusion, or DALL-E, our gallery is designed to jumpstart your creative process.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Premium Curated Gallery:</strong> We hand-pick images that stand out in quality, composition, and aesthetics.</li>
            <li><strong>Copy-and-Paste Prompts:</strong> Every image comes with the full text prompt, free for you to copy, modify, and use in your own AI generations.</li>
            <li><strong>Trend Discovery:</strong> Stay updated with the latest styles in AI art, from hyper-realistic photography to stylized digital illustrations.</li>
            <li><strong>Creative Inspiration:</strong> Even if you don't use AI generators, our gallery serves as a mood board for designers, writers, and artists.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4">Our Community</h2>
          <p>
            Moments Gallari is built for creators, by creators. We believe that sharing knowledge and tools elevates everyone's work. We encourage you to explore our gallery, try out the prompts, and add your own unique twists.
          </p>
          <p>
            If you have any questions or feedback, feel free to reach out via our <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact page</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
