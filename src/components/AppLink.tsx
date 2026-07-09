"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

type AppLinkProps = ComponentProps<typeof NextLink>;

/**
 * Drop-in replacement for next/link with viewport prefetching off by default.
 *
 * Next.js 16 prefetches each link's route segments separately, so a single
 * <Link> entering the viewport can cost ~5 edge requests. With a footer on
 * every page and a masonry grid of pin cards, that dominated our Vercel edge
 * request count. Navigation is unaffected: Next still prefetches on hover.
 *
 * Pass prefetch explicitly to opt a specific link back in.
 */
export default function AppLink({ prefetch = false, ...props }: AppLinkProps) {
  return <NextLink prefetch={prefetch} {...props} />;
}
