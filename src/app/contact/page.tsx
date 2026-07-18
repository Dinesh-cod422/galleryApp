import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "How to reach Moments Gallari — attribution and takedown requests, corrections, and advertising enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <Header />

      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-24 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">Contact</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead">
            Moments Gallari is run by one person. Email is the only channel, it is
            read personally, and every message gets a reply.
          </p>

          <h2>Email</h2>
          <p>
            <a href="mailto:dineshkumarmurugesan002@gmail.com" className="break-all">
              dineshkumarmurugesan002@gmail.com
            </a>
          </p>

          <h2>What to write about</h2>
          <ul>
            <li>
              <strong>Attribution or takedown.</strong> If a prompt published here
              originated with you, name the page and it will be credited or removed.
            </li>
            <li>
              <strong>A prompt that isn&apos;t working.</strong> Tell us the model and
              settings you used and we will re-test it and update the page.
            </li>
            <li>
              <strong>Corrections.</strong> If anything on a page is wrong or out of
              date, we want to know.
            </li>
            <li>
              <strong>Advertising and partnership enquiries.</strong>
            </li>
          </ul>

          <h2>Also here</h2>
          <p>
            The prompts are posted first on Instagram at{" "}
            <a
              href="https://www.instagram.com/moments_galleri"
              target="_blank"
              rel="noopener noreferrer"
            >
              @moments_galleri
            </a>
            . Messages sent there are seen less often than email.
          </p>
        </div>
      </div>
    </main>
  );
}
