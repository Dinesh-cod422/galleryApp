import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Moments Gallari. Learn how we collect, use, and protect your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#000000] dark:text-white selection:bg-black/10 dark:selection:bg-white/30 relative overflow-x-hidden transition-colors duration-300">
      <Header />
      
      <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-32 pb-24 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <p>
            At Moments Gallari, accessible from https://moment-galleri.vercel.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Moments Gallari and how we use it.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
          <p>
            We collect information from you when you visit our site. Since we currently do not have a user registration system, the information we collect is primarily non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request.
          </p>
          <p>
            If you contact us directly, we may receive additional information about you such as your name, email address, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Log Files</h2>
          <p>
            Moments Gallari follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Cookies and Web Beacons</h2>
          <p>
            Like any other website, Moments Gallari uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>
          <p>
            We also use Google Analytics to help us understand how our customers use the Site. You can read more about how Google uses your Personal Information here: https://www.google.com/intl/en/policies/privacy/.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://policies.google.com/technologies/ads
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Third Party Privacy Policies</h2>
          <p>
            Moments Gallari's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>
          <p>
            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>
      </div>
    </main>
  );
}
