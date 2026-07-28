import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Vista } from "@/components/Vista";
import { ListingCard, DevelopmentCard, InvestmentCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { destinations, listingsFor, developmentsFor, investmentsFor } from "@/data";
import { breadcrumbSchema } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);
  if (!destination) return {};
  return {
    title: destination.name,
    description: destination.summary,
    alternates: { canonical: `/destinations/${destination.slug}` },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);
  if (!destination) notFound();

  const destinationListings = listingsFor(destination.slug);
  const destinationDevelopments = developmentsFor(destination.slug);
  const destinationInvestments = investmentsFor(destination.slug);

  return (
    <div className="py-16 md:py-24">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Destinations", url: "/destinations" },
          { name: destination.name, url: `/destinations/${destination.slug}` },
        ])}
      />
      <div className="container-page">
        <p className="eyebrow">{destination.region}</p>
        <h1 className="mt-2 text-3xl md:text-5xl">{destination.name}</h1>
        <Vista variant={destination.vista} ratio="wide" label={destination.name} className="mt-8" />
        <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-ink-700">{destination.description}</p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {destination.highlights.map((highlight) => (
            <li key={highlight} className="rounded-full border border-ink-200 px-4 py-1.5 font-sans text-xs uppercase tracking-wide text-ink-600">
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      {destinationListings.length > 0 && (
        <div className="container-page mt-20">
          <h2 className="text-2xl">Available Properties</h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {destinationListings.map((listing) => (
              <ListingCard key={listing.slug} listing={listing} />
            ))}
          </div>
        </div>
      )}

      {destinationDevelopments.length > 0 && (
        <div className="container-page mt-20">
          <h2 className="text-2xl">Developments</h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {destinationDevelopments.map((development) => (
              <DevelopmentCard key={development.slug} development={development} />
            ))}
          </div>
        </div>
      )}

      {destinationInvestments.length > 0 && (
        <div className="container-page mt-20">
          <h2 className="text-2xl">Investment Opportunities</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {destinationInvestments.map((opportunity) => (
              <InvestmentCard key={opportunity.slug} opportunity={opportunity} />
            ))}
          </div>
        </div>
      )}

      <div className="container-page mt-20">
        <div className="rounded-sm bg-sand-100 p-10 text-center">
          <h2 className="text-2xl">Interested in {destination.name}?</h2>
          <p className="mx-auto mt-3 max-w-lg font-sans text-sm text-ink-600">
            Speak with our team about current and upcoming opportunities in {destination.name}.
          </p>
          <Link href="/contact" className="btn-primary mt-6 inline-flex">
            Enquire About {destination.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
