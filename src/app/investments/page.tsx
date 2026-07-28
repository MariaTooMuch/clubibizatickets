import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { InvestmentCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { investmentOpportunities, getDestination } from "@/data";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Investments",
  description:
    "Explore managed rental portfolios, branded residence co-investments and development-stage opportunities across the Link Places network.",
  alternates: { canonical: "/investments" },
};

export default function InvestmentsPage() {
  return (
    <div className="py-16 md:py-24">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Investments", url: "/investments" }])} />
      <div className="container-page">
        <SectionHeading
          eyebrow="Investments"
          title="Property as a long-term, income-generating asset."
          description="We work with investors evaluating yield, growth and diversification across our destinations, from managed rental portfolios to early-stage development positions."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {investmentOpportunities.map((opportunity) => (
            <InvestmentCard
              key={opportunity.slug}
              opportunity={opportunity}
              destinationName={getDestination(opportunity.destinationSlug)?.name}
            />
          ))}
        </div>
        <div className="mt-16 rounded-sm bg-sand-100 p-10 text-center">
          <h2 className="text-2xl">Considering property as an investment?</h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-sm text-ink-600">
            Speak with our investment advisory team about yield expectations, risk and how a given opportunity fits
            a wider portfolio.
          </p>
          <Link href="/contact" className="btn-primary mt-6 inline-flex">
            Speak With Our Investment Team
          </Link>
        </div>
      </div>
    </div>
  );
}
