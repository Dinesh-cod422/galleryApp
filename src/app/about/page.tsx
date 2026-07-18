import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Who runs Moments Gallari, where the prompts come from, and how every prompt is tested before it is published.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <Header />

      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-24 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">About Moments Gallari</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead">
            Moments Gallari is a small, independently run library of AI image prompts. Every prompt
            here is run through real image generators before publication, and every page shows the
            results — including the ones that didn&apos;t work.
          </p>

          <h2>Who runs this</h2>
          <p>
            My name is <strong>[YOUR FULL NAME]</strong>. I&apos;m <strong>[YOUR ROLE]</strong> based
            in <strong>[CITY, COUNTRY]</strong>, and I&apos;ve been working with AI image generation
            since <strong>[YEAR]</strong>. I build and write every page on this site myself. You can
            reach me at{" "}
            <a href="mailto:dineshkumarmurugesan002@gmail.com" className="break-all">
              dineshkumarmurugesan002@gmail.com
            </a>
            .
          </p>

          <h2>What we actually do</h2>
          <p>
            Most prompt collections are lists — copied, posted, never tested. That was true of the
            first version of this site, and it&apos;s why it was rebuilt. For each prompt we publish now:
          </p>
          <ul>
            <li>We run it ourselves and record the model and settings used.</li>
            <li>We publish <strong>our own</strong> generated images, so you can see what the prompt really produces.</li>
            <li>
              We document where it fails — contradictory instructions, tokens that do nothing, and
              the parts that need rewriting for a particular model.
            </li>
            <li>We publish specific, tested edits rather than generic advice.</li>
          </ul>

          <h2>Where the prompts come from</h2>
          <p>
            The prompts and reference images here were published on our own Instagram account,{" "}
            <a href="https://www.instagram.com/moments_galleri" rel="noopener noreferrer" target="_blank">
              @moments_galleri
            </a>
            , and each page links back to the original post. Prompts are short functional text and we
            make no ownership claim over them. If a prompt listed here originated with you, email me
            and it will be credited or removed within <strong>[N]</strong> business days.
          </p>

          <h2>What we don&apos;t do</h2>
          <p>
            We don&apos;t republish other people&apos;s generated images as our own. We don&apos;t use
            invented contributor names — an earlier version of this site did, and those have been
            removed. We don&apos;t publish a prompt we haven&apos;t run.
          </p>

          <p>
            This site is funded by display advertising. We have no commercial relationship with
            Midjourney, Google, Stability AI or Meta.
          </p>

          <p>
            Questions or corrections? The{" "}
            <a href="/contact">contact page</a> has everything.
          </p>

          <p>
            <em>Last updated: [DATE]</em>
          </p>
        </div>
      </div>
    </main>
  );
}
