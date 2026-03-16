import { getPageBySlug } from "../../../actions/page";
import { PublicPageClient } from "@/components/public/PublicPageClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;
  
  if (!slug) return notFound();

  const page = await getPageBySlug(slug);

  if (!page) {
    return notFound();
  }

  return <PublicPageClient pageData={page} />;
}
