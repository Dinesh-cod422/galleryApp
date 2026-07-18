import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Moments Gallari collects, which third parties set cookies, and how to opt out or have your data removed.",
  alternates: { canonical: "/privacy" },
};

// Hand-bumped. Previously `new Date()`, which claimed the policy was revised on
// whatever day the page happened to be rendered — a false statement about a
// legal document, and it froze at the build date in production anyway.
const LAST_UPDATED = "19 July 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <Header />

      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-24 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {LAST_UPDATED}</p>

          <p>
            This policy explains what Moments Gallari
            (<a href="https://moment-galleri.vercel.app">moment-galleri.vercel.app</a>)
            collects, who else receives data when you visit, and how to opt out.
            The site is run by an individual, not a company. For any privacy
            request, including deletion, email{" "}
            <a href="mailto:dineshkumarmurugesan002@gmail.com" className="break-all">
              dineshkumarmurugesan002@gmail.com
            </a>
            .
          </p>

          <h2>What we collect directly</h2>
          <p>
            There are no accounts and no registration, so we hold no profile for
            you. Two things are stored in your own browser and never transmitted to
            us: your light/dark theme preference, and your saved-prompts wishlist.
            Both live in your browser&apos;s local storage. Clearing your browser
            data deletes them, and we cannot read them.
          </p>
          <p>
            If you email us, we receive whatever you put in the message. We keep
            correspondence only as long as needed to deal with it.
          </p>

          <h2>Server logs</h2>
          <p>
            The site is hosted on Vercel, which records standard request logs
            including IP address, browser type, referring page and timestamp. These
            are used for security and reliability, are retained by Vercel on our
            behalf, and are not combined with anything else to identify you. See{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              Vercel&apos;s privacy policy
            </a>
            .
          </p>

          <h2>Google AdSense</h2>
          <p>
            We intend to fund this site through Google AdSense. Google is a
            third-party vendor and uses cookies to serve ads based on your prior
            visits to this and other websites. Google&apos;s use of advertising
            cookies enables it and its partners to serve ads to you based on your
            visit to this site and/or other sites on the internet.
          </p>
          <ul>
            <li>
              You may opt out of personalised advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              Google&apos;s advertising practices are described at{" "}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
                How Google uses cookies in advertising
              </a>
              .
            </li>
            <li>
              You can opt out of third-party vendor cookies more broadly at{" "}
              <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
                aboutads.info
              </a>
              .
            </li>
          </ul>

          <h2>Google Analytics</h2>
          <p>
            We use Google Analytics 4 to count visits and see which pages are read.
            It sets cookies in your browser. We do not use it to identify
            individuals and we have not enabled advertising features that link
            analytics data to ad profiles. See{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google&apos;s privacy policy
            </a>
            .
          </p>

          <h2>Your consent choice, and what happens before you make it</h2>
          <p>
            Advertising and analytics cookies are set to <strong>denied</strong> by
            default, before any Google tag runs, using Google Consent Mode v2.
            Nothing is stored for advertising or analytics until you choose
            &ldquo;Accept&rdquo; on the cookie banner. Choosing
            &ldquo;Reject&rdquo; keeps them denied.
          </p>
          <p>
            Your choice is remembered in your browser&apos;s local storage. To change
            it, clear this site&apos;s local storage in your browser settings and the
            banner will appear again.
          </p>

          <h2>Embedded Instagram content</h2>
          <p>
            Prompt pages embed the original Instagram post the prompt came from.
            When that embed loads, Instagram (Meta) may set its own cookies and
            receive your IP address, exactly as if you had visited Instagram
            directly. We have no control over and no access to that data. See{" "}
            <a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noopener noreferrer">
              Instagram&apos;s privacy policy
            </a>
            .
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live you may have the right to access, correct,
            delete or export your personal data, to object to processing, and to
            withdraw consent at any time. This includes rights under the GDPR
            (EU/UK), the CCPA/CPRA (California) and the Digital Personal Data
            Protection Act 2023 (India). Because we hold almost no personal data —
            no accounts, and preferences that never leave your device — most
            requests are satisfied by clearing your browser storage or by
            contacting Google directly for ad and analytics data.
          </p>
          <p>
            To exercise a right against us, email{" "}
            <a href="mailto:dineshkumarmurugesan002@gmail.com" className="break-all">
              dineshkumarmurugesan002@gmail.com
            </a>
            . We aim to respond within 30 days.
          </p>

          <h2>Children</h2>
          <p>
            This site is not directed at children under 13 and we do not knowingly
            collect their personal data. If you believe a child has provided us with
            personal information, email us and it will be deleted.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If this policy changes materially, the date at the top will be updated.
            Continued use of the site after a change means you accept the revised
            policy.
          </p>
        </div>
      </div>
    </main>
  );
}
