import { PublicPageContainer } from "../../components/public/PublicPageContainer";
import { notFound } from "next/navigation";
import type { PageProps } from "@/types/app/[slug]";
import { Metadata } from "next";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import { APP_ORIGIN, BRAND_NAME } from "@/config/app-config";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const pageData = await api.get<any>(API_ENDPOINTS.PAGE.GET_BY_SLUG(slug));
    const title = pageData.title || pageData.username || slug;
    const description = `Visit ${title}'s personal link hub on ${BRAND_NAME}. Explore their digital identity, widgets, and socials in one place.`;

    return {
      title: `${title} on ${BRAND_NAME}`,
      description,
      openGraph: {
        title: `${title} | ${BRAND_NAME}`,
        description,
        url: `${APP_ORIGIN}/${slug}`,
        images: [
          {
            url: "/full-logo.png",
            width: 1200,
            height: 630,
            alt: `${BRAND_NAME} Badge`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ${BRAND_NAME}`,
        description,
        images: ["/full-logo.png"],
      },
    };
  } catch {
    return {
      title: `${slug} | ${BRAND_NAME}`,
      description: `Connect with ${slug} on ${BRAND_NAME}.`,
    };
  }
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) return notFound();

  return <PublicPageContainer slug={slug} />;
}
