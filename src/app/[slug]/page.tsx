import { getPageBySlug, getPublicThemeBySlug, getPublicWidgetsBySlug } from "../../../actions/page";
import { PublicPageClient } from "@/components/public/PublicPageClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) return notFound();

  const [page, themeResponse, widgetsResponse] = await Promise.all([
    getPageBySlug(slug),
    getPublicThemeBySlug(slug),
    getPublicWidgetsBySlug(slug),
  ]);

  if (!page && !themeResponse.success) {
    return notFound();
  }

  return (
    <PublicPageClient
      pageData={page || themeResponse.result?.page || { slug, title: slug }}
      themeResponse={themeResponse}
      widgetsResponse={widgetsResponse}
    />
  );
}
