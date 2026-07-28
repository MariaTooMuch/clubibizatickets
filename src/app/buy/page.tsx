import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { ListingCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { listings, getDestination } from "@/data";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Buy Property Abroad",
  description:
    "Browse curated villas, penthouses and estates across Link Places destinations, from Ibiza and Marbella to the Algarve, Mallorca, Costa Smeralda and Bahia.",
  alternates: { canonical: "/buy" },
};

export default function BuyPage() {
  return (
    <div className="py-16 md:py-24">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Buy", url: "/buy" }])} />
      <div className="container-page">
        <SectionHeading
          eyebrow="Buy"
          title="Curated properties across our destinations."
          description="Every property in our network has been reviewed for legal standing and market positioning before it reaches this page. Contact us for a shortlist tailored to your criteria."
        />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} destinationName={getDestination(listing.destinationSlug)?.name} />
          ))}
        </div>
        <div className="mt-16 rounded-sm border border-ink-100 p-8 text-center">
          <h2 className="text-2xl">Not seeing what you&apos;re looking for?</h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-sm text-ink-600">
            Many opportunities in our network are shared privately before they are listed publicly. Tell us your
            criteria and we&apos;ll introduce you to relevant options.
          </p>
          <Link href="/contact" className="btn-primary mt-6 inline-flex">
            Tell Us What You&apos;re Looking For
          </Link>
        </div>
      </div>
    </div>
  );
}
