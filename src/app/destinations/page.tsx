import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { DestinationCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { destinations } from "@/data";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore the destinations in the Link Places network, from Ibiza and Marbella to the Algarve, Mallorca, Costa Smeralda and Bahia.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  return (
    <div className="py-16 md:py-24">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Destinations", url: "/destinations" }])} />
      <div className="container-page">
        <SectionHeading
          eyebrow="Destinations"
          title="Trusted local partners in the world's most desirable places."
          description="Each destination in our network is represented by a vetted local partner who understands the market, the legal landscape and the lifestyle."
        />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </div>
    </div>
  );
}
