import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { DevelopmentCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { developments, getDestination } from "@/data";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Developments",
  description: "Vetted new-build and off-plan developments across the Link Places network, from concept to completion.",
  alternates: { canonical: "/developments" },
};

export default function DevelopmentsPage() {
  return (
    <div className="py-16 md:py-24">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Developments", url: "/developments" }])} />
      <div className="container-page">
        <SectionHeading
          eyebrow="Developments"
          title="New-build opportunities from vetted developers."
          description="Every development featured here has been reviewed for developer track record, construction stage and legal standing before being introduced to our network."
        />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {developments.map((development) => (
            <DevelopmentCard
              key={development.slug}
              development={development}
              destinationName={getDestination(development.destinationSlug)?.name}
            />
          ))}
        </div>
        <div className="mt-16 rounded-sm border border-ink-100 p-8 text-center">
          <h2 className="text-2xl">Developer with a project to feature?</h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-sm text-ink-600">
            We partner with a limited number of developers in each destination. Get in touch to discuss distribution
            and marketing collaboration.
          </p>
          <Link href="/contact" className="btn-primary mt-6 inline-flex">
            Contact Our Team
          </Link>
        </div>
      </div>
    </div>
  );
}
