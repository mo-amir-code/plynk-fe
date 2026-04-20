import { MetadataRoute } from 'next';
import { APP_ORIGIN } from '@/config/app-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${APP_ORIGIN}${route}`,
    lastModified: new URLSearchParams().get('date') || new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
