import { PublicPageContainer } from "../../components/public/PublicPageContainer";
import { notFound } from "next/navigation";
import type { PageProps } from "@/types/app/[slug]";

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) return notFound();

  return <PublicPageContainer slug={slug} />;
}
