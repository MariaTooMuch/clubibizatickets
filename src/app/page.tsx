import Link from "next/link";
import { Vista } from "@/components/Vista";
import { SectionHeading } from "@/components/SectionHeading";
import { DestinationCard, ListingCard, JournalCard } from "@/components/cards";
import { destinations, listings, journalArticles, getDestination } from "@/data";

export default function HomePage() {
  const featuredDestinations = destinations.slice(0, 3);
  const featuredListings = listings.slice(0, 3);
  const latestArticles = journalArticles.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-sand-50">
        <div className="absolute inset-0 opacity-70">
          <Vista variant="coast" ratio="wide" className="h-full w-full rounded-none" label="Mediterranean coastline" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/20" />
        <div className="container-page relative flex min-h-[80vh] flex-col justify-end py-20">
          <p className="eyebrow text-sand-200">International Property Network</p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-[1.1] text-sand-50 md:text-6xl">Trusted Property Connections.</h1>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-sand-100/90 md:text-lg">
            Link Places connects buyers, investors, developers and trusted local partners across the world&apos;s
            most desirable destinations.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/buy" className="btn-primary">
              Explore Properties
            </Link>
            <Link href="/contact" className="btn-secondary border-sand-50 text-sand-50 hover:border-terracotta-400 hover:text-terracotta-300">
              Speak With Us
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <SectionHeading
          eyebrow="Our Approach"
          title="A modern property network, not a traditional agency."
          description="We work with a curated group of local partners in each destination, giving international clients access to vetted opportunities, honest guidance and long-term relationships rather than a single transaction."
        />
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            { title: "Trust", body: "Every partner and opportunity is reviewed before it reaches our network." },
            { title: "Local Knowledge", body: "Grounded expertise in each destination, not a generic global playbook." },
            { title: "Long-Term Relationships", body: "We measure success by clients who return, not by transaction volume." },
          ].map((item) => (
            <div key={item.title} className="border-t border-ink-200 pt-6">
              <h3 className="text-xl">{item.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand-100 py-20 md:py-28">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Destinations" title="Where we operate." className="mb-0" />
            <Link href="/destinations" className="font-sans text-sm uppercase tracking-wide text-terracotta-700 hover:text-terracotta-900">
              View all destinations →
            </Link>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDestinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Featured Properties" title="A selection currently available." className="mb-0" />
          <Link href="/buy" className="font-sans text-sm uppercase tracking-wide text-terracotta-700 hover:text-terracotta-900">
            View all properties →
          </Link>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} destinationName={getDestination(listing.destinationSlug)?.name} />
          ))}
        </div>
      </section>

      <section className="bg-ink-900 py-20 text-sand-50 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow text-sand-200">Investments</p>
            <h2 className="mt-3 text-3xl leading-tight text-sand-50 md:text-4xl">Property as a long-term asset.</h2>
            <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-sand-100/85">
              From managed rental portfolios to early-stage developments, we help investors evaluate opportunities
              across our network of destinations with clear, honest reporting.
            </p>
            <Link href="/investments" className="btn-secondary mt-8 inline-flex border-sand-50 text-sand-50 hover:border-terracotta-400 hover:text-terracotta-300">
              Explore Investments
            </Link>
          </div>
          <Vista variant="dusk" ratio="landscape" label="Investment property composition" />
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Journal" title="Insight for international buyers." className="mb-0" />
          <Link href="/journal" className="font-sans text-sm uppercase tracking-wide text-terracotta-700 hover:text-terracotta-900">
            Visit the Journal →
          </Link>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <JournalCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="bg-terracotta-700 py-20 text-sand-50">
        <div className="container-page text-center">
          <h2 className="text-3xl text-sand-50 md:text-4xl">Let&apos;s find your next property, together.</h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-base text-sand-50/90">
            Tell us what you&apos;re looking for and a member of our team will introduce you to the right opportunities
            and local partner.
          </p>
          <Link href="/contact" className="btn-primary mt-8 inline-flex bg-sand-50 text-ink-900 hover:bg-sand-100">
            Start the Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
