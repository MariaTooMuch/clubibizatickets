import Link from "next/link";
import { Vista } from "./Vista";
import { formatEUR } from "@/data";
import type { Destination, Development, InvestmentOpportunity, JournalArticle, Listing } from "@/data/types";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link href={`/destinations/${destination.slug}`} className="group block">
      <Vista variant={destination.vista} ratio="landscape" label={`${destination.name}, ${destination.region}`} />
      <p className="mt-4 eyebrow">{destination.region}</p>
      <h3 className="mt-1 text-xl">{destination.name}</h3>
      <p className="mt-2 font-sans text-sm text-ink-600">{destination.summary}</p>
    </Link>
  );
}

export function ListingCard({ listing, destinationName }: { listing: Listing; destinationName?: string }) {
  return (
    <Link href={`/buy/${listing.slug}`} className="group block">
      <Vista variant={listing.vista} ratio="landscape" label={listing.title} />
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-xl">{listing.title}</h3>
        <span className="whitespace-nowrap font-sans text-sm text-terracotta-700">{formatEUR(listing.priceEUR)}</span>
      </div>
      {destinationName && <p className="eyebrow mt-1">{destinationName}</p>}
      <p className="mt-2 font-sans text-sm text-ink-600">{listing.summary}</p>
      <p className="mt-2 font-sans text-xs uppercase tracking-wide text-ink-400">
        {listing.bedrooms} bed · {listing.bathrooms} bath · {listing.areaSqm} m²
      </p>
    </Link>
  );
}

export function DevelopmentCard({ development, destinationName }: { development: Development; destinationName?: string }) {
  return (
    <div className="block">
      <Vista variant={development.vista} ratio="landscape" label={development.name} />
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-xl">{development.name}</h3>
        <span className="whitespace-nowrap font-sans text-sm text-terracotta-700">
          from {formatEUR(development.priceFromEUR)}
        </span>
      </div>
      {destinationName && <p className="eyebrow mt-1">{destinationName}</p>}
      <p className="mt-2 font-sans text-sm text-ink-600">{development.summary}</p>
      <p className="mt-2 font-sans text-xs uppercase tracking-wide text-ink-400">
        {development.status} · Completion {development.completionYear}
      </p>
    </div>
  );
}

export function InvestmentCard({ opportunity, destinationName }: { opportunity: InvestmentOpportunity; destinationName?: string }) {
  return (
    <div className="block rounded-sm border border-ink-100 p-6">
      {destinationName && <p className="eyebrow">{destinationName}</p>}
      <h3 className="mt-2 text-xl">{opportunity.title}</h3>
      <p className="mt-2 font-sans text-sm text-ink-600">{opportunity.summary}</p>
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 font-sans text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-400">Minimum</dt>
          <dd className="mt-1 text-ink-800">{formatEUR(opportunity.minimumEUR)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-400">Target return</dt>
          <dd className="mt-1 text-ink-800">{opportunity.projectedYield}</dd>
        </div>
      </dl>
    </div>
  );
}

export function JournalCard({ article }: { article: JournalArticle }) {
  return (
    <Link href={`/journal/${article.slug}`} className="group block">
      <Vista variant={article.vista} ratio="landscape" label={article.title} />
      <p className="eyebrow mt-4">{article.category}</p>
      <h3 className="mt-1 text-xl">{article.title}</h3>
      <p className="mt-2 font-sans text-sm text-ink-600">{article.excerpt}</p>
      <p className="mt-2 font-sans text-xs uppercase tracking-wide text-ink-400">{article.readingMinutes} min read</p>
    </Link>
  );
}
