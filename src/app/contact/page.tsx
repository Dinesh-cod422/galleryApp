import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach the person who runs Moments Gallari — attribution and takedown requests, prompt corrections, and advertising enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <Header />

      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-24 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">Contact</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Moments Gallari is run by one person, <strong>[YOUR FULL NAME]</strong>. Email is the
            fastest way to reach me and I read everything that arrives.
          </p>

          <h2>Email</h2>
          <p>
            <a href="mailto:dineshkumarmurugesan002@gmail.com" className="break-all">
              dineshkumarmurugesan002@gmail.com
            </a>
            <br />
            Typical reply within <strong>[N]</strong> business days.
          </p>

          <h2>Where I&apos;m based</h2>
          <p>[CITY, COUNTRY]</p>

          <h2>Please get in touch about</h2>
          <ul>
            <li>
              <strong>Attribution or takedown.</strong> If a prompt listed here originated with you,
              tell me which page and it will be credited or removed.
            </li>
            <li>
              <strong>A prompt that isn&apos;t working.</strong> Send the model and settings you used
              and I&apos;ll re-test it and update the page.
            </li>
            <li>
              <strong>Corrections.</strong> If something on a page is wrong, I want to know.
            </li>
            <li>
              <strong>Advertising and partnership enquiries.</strong>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
