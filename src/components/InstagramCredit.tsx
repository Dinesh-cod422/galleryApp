/**
 * Credited Instagram embed.
 *
 * The previous treatment cropped the post's header out of view (a 600px iframe
 * inside a 250-450px `overflow-hidden` box, offset -60px) and passed
 * `hidecaption=true`, which removed the caption. The result was a third-party
 * post stripped of the attribution that identified it as third-party, used as
 * the site's own hero image.
 *
 * Google's Publisher Policies bar Google-served ads on screens "with embedded or
 * copied content from others without additional commentary, curation, or
 * otherwise adding value to that content". Here the embed is a citation: it sits
 * below our own render and our own writing, at its natural size, with the
 * caption and account header intact and a visible attribution line above it.
 */

export function getInstagramEmbedUrl(url: string) {
  if (!url) return "";
  if (url.includes("/embed")) return url;
  const baseUrl = url.split("?")[0];
  const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  // No `hidecaption` — the caption and account header must stay visible.
  return `${cleanBase}embed/`;
}

export default function InstagramCredit({
  embedUrl,
  title,
}: {
  embedUrl: string;
  title: string;
}) {
  if (!embedUrl) return null;

  return (
    <section className="mt-16 pt-10 border-t border-black/10 dark:border-white/10 max-w-3xl">
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-3">
        Original post
      </h2>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
        This prompt was first published on our Instagram account,{" "}
        <a
          href="https://www.instagram.com/moments_galleri"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-4 hover:text-black dark:hover:text-white"
        >
          @moments_galleri
        </a>
        . The post is embedded below in full. Any images shown above it are our own
        generations, not the post&apos;s media.
      </p>
      <div className="max-w-[400px] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white">
        <iframe
          src={getInstagramEmbedUrl(embedUrl)}
          title={`Original Instagram post: ${title}`}
          className="w-full border-0"
          height={640}
          loading="lazy"
          scrolling="no"
        />
      </div>
    </section>
  );
}
