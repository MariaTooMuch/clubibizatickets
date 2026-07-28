import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Vista } from "@/components/Vista";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLink } from "@/components/ArrowLink";
import { listings, getDestination, formatEUR } from "@/data";
import { breadcrumbSchema, listingSchema } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = listings.find((l) => l.slug === slug);
  if (!listing) return {};
  return {
    title: listing.title,
    description: listing.summary,
    alternates: { canonical: `/buy/${listing.slug}` },
  };
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listing = listings.find((l) => l.slug === slug);
  if (!listing) notFound();

  const destination = getDestination(listing.destinationSlug);

  return (
    <div className="py-16 md:py-24">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Buy", url: "/buy" },
          { name: listing.title, url: `/buy/${listing.slug}` },
        ])}
      />
      <JsonLd data={listingSchema(listing, destination)} />
      <div className="container-page">
        <p className="eyebrow">{destination?.name}</p>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="text-3xl md:text-4xl">{listing.title}</h1>
          <span className="font-sans text-xl text-terracotta-700">{formatEUR(listing.priceEUR)}</span>
        </div>

        <Vista variant={listing.vista} ratio="wide" label={listing.title} className="mt-8" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="font-sans text-base leading-relaxed text-ink-700">{listing.summary}</p>
            <dl className="mt-8 grid grid-cols-3 gap-6 border-y border-ink-100 py-6 font-sans text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-400">Bedrooms</dt>
                <dd className="mt-1 text-lg text-ink-900">{listing.bedrooms}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-400">Bathrooms</dt>
                <dd className="mt-1 text-lg text-ink-900">{listing.bathrooms}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-400">Area</dt>
                <dd className="mt-1 text-lg text-ink-900">{listing.areaSqm} m²</dd>
              </div>
            </dl>
            <h2 className="mt-8 text-xl">Features</h2>
            <ul className="mt-4 grid gap-2 font-sans text-sm text-ink-700 sm:grid-cols-2">
              {listing.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1 h-1 w-1 shrink-0 rounded-full bg-terracotta-600" />
                  {feature}
                </li>
              ))}
            </ul>
            {listing.source && <p className="mt-6 font-sans text-xs italic text-ink-400">{listing.source}</p>}
          </div>

          <div className="h-fit rounded-sm border border-ink-100 p-6">
            <h2 className="text-xl">Interested in this property?</h2>
            <p className="mt-3 font-sans text-sm text-ink-600">
              Reach out and a member of our team will arrange next steps with our local partner in {destination?.name}.
            </p>
            <Link href="/contact" className="btn-primary mt-6 w-full">
              Enquire About This Property
            </Link>
            {destination && (
              <ArrowLink href={`/destinations/${destination.slug}`} className="mt-3 justify-center">
                More about {destination.name}
              </ArrowLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
