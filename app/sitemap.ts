import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Next emits this as a static /sitemap.xml during `next build` (output: 'export').
// Single-page site — one canonical entry is correct here, not a per-section list.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
