import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Next emits this as a static /robots.txt during `next build` (output: 'export').
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}sitemap.xml`,
  };
}
