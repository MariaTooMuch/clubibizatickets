import type { Metadata } from "next";
import Link from "next/link";
import { Vista } from "@/components/Vista";
import { SectionHeading } from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Sell Your Property",
  description:
    "Introduce your property to Link Places' international network of qualified buyers and investors, with clear positioning and transaction support.",
  alternates: { canonical: "/sell" },
};

const steps = [
  { title: "Introduction", body: "We learn about your property, timeline and goals in a short initial conversation." },
  { title: "Positioning", body: "We assess market pricing and prepare your property for an international audience." },
  { title: "Introduction to Buyers", body: "Your property is shared with qualified buyers across our network." },
  { title: "Transaction Support", body: "We coordinate through offer, negotiation and closing alongside local counsel." },
];

export default function SellPage() {
  return (
    <div className="py-16 md:py-24">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Sell", url: "/sell" }])} />
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">Sell</p>
          <h1 className="mt-3 text-3xl leading-tight md:text-5xl">
            Introduce your property to a trusted international audience.
          </h1>
          <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-ink-600">
            Link Places represents sellers who want more than a local listing. We position your property for
            international buyers, investors and relocating families across our network of destinations.
          </p>
          <Link href="/contact" className="btn-primary mt-8 inline-flex">
            Request a Valuation
          </Link>
        </div>
        <Vista variant="clay" ratio="landscape" label="Property positioned for sale" />
      </div>

      <div className="container-page mt-24 md:mt-32">
        <SectionHeading eyebrow="Our Process" title="A clear path from introduction to closing." />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="border-t border-ink-200 pt-6">
              <p className="font-serif text-3xl text-terracotta-600">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-lg">{step.title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-600">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page mt-24 md:mt-32">
        <div className="rounded-sm bg-sand-100 p-10 text-center md:p-16">
          <h2 className="text-3xl md:text-4xl">Ready to discuss your property?</h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm text-ink-600">
            Share a few details and a member of our team will follow up to discuss positioning, timeline and next
            steps.
          </p>
          <Link href="/contact" className="btn-primary mt-8 inline-flex">
            Start the Conversation
          </Link>
        </div>
      </div>
    </div>
  );
}
