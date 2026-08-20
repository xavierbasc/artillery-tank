import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Next emits this as a static /sitemap.xml during `next build` (output: 'export').
// The landing page is one page with anchors, so it gets one entry — the privacy
// policy is a real route (the stores demand a URL of its own) and gets another.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}privacy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
