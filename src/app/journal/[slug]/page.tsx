import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Vista } from "@/components/Vista";
import { JsonLd } from "@/components/JsonLd";
import { journalArticles } from "@/data";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return journalArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = journalArticles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
  };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = journalArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <article className="py-16 md:py-24">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Journal", url: "/journal" },
          { name: article.title, url: `/journal/${article.slug}` },
        ])}
      />
      <JsonLd data={articleSchema(article)} />
      <div className="container-page max-w-3xl">
        <p className="eyebrow">{article.category}</p>
        <h1 className="mt-2 text-3xl leading-tight md:text-5xl">{article.title}</h1>
        <p className="mt-4 font-sans text-sm text-ink-500">
          {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          {" · "}
          {article.readingMinutes} min read
        </p>
        <Vista variant={article.vista} ratio="wide" label={article.title} className="mt-8" />
        <div className="mt-10 space-y-6 font-sans text-base leading-relaxed text-ink-700">
          {article.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-16 border-t border-ink-100 pt-8">
          <Link href="/journal" className="font-sans text-sm uppercase tracking-wide text-terracotta-700 hover:text-terracotta-900">
            ← Back to Journal
          </Link>
        </div>
      </div>
    </article>
  );
}
