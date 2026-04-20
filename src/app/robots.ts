import { MetadataRoute } from 'next';
import { APP_ORIGIN } from '@/config/app-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/faq', '/contact', '/privacy', '/terms'],
        disallow: ['/auth/', '/dashboard/', '/onboarding/'],
      },
    ],
    sitemap: `${APP_ORIGIN}/sitemap.xml`,
  };
}
