import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { JournalCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { journalArticles } from "@/data";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Journal",
  description: "Guides and insight for international property buyers, investors and relocating families.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return (
    <div className="py-16 md:py-24">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Journal", url: "/journal" }])} />
      <div className="container-page">
        <SectionHeading
          eyebrow="Journal"
          title="Insight for international buyers, investors and relocating families."
          description="Practical guidance on buying, selling, investing and relocating across our destinations."
        />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {journalArticles.map((article) => (
            <JournalCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
