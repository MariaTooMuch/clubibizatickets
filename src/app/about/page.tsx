import type { Metadata } from "next";
import { Vista } from "@/components/Vista";
import { SectionHeading } from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Link Places is an international premium property platform built on trust, transparency, local knowledge and long-term relationships.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Trust", body: "We introduce only opportunities and partners we would recommend to our own families." },
  { title: "Transparency", body: "Clear pricing, clear fees, and honest guidance, even when it means saying no." },
  { title: "Local Knowledge", body: "Every destination is represented by a partner grounded in that specific market." },
  { title: "Global Reach", body: "A single point of contact across an international network of destinations." },
  { title: "Long-Term Relationships", body: "We aim to be the first call for a client's next property, years later." },
  { title: "Quality Over Quantity", body: "A curated network is a smaller network, by design." },
];

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "About", url: "/about" }])} />
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">About Link Places</p>
          <h1 className="mt-3 text-3xl leading-tight md:text-5xl">Trusted Property Connections.</h1>
          <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-ink-600">
            Link Places is an international premium property platform connecting buyers, investors, developers and
            trusted real estate partners across the world&apos;s most desirable destinations. We are not a
            traditional agency — we are a modern property network built on trust, quality and long-term
            relationships.
          </p>
        </div>
        <Vista variant="dune" ratio="landscape" label="Mediterranean landscape" />
      </div>

      <div className="container-page mt-24 md:mt-32">
        <SectionHeading
          eyebrow="Mission"
          title="Connect people with exceptional properties through trusted local expertise."
          description="We believe the best property decisions are made with honest guidance and genuine local knowledge, not sales pressure. Every destination in our network is represented by a partner who lives that market."
        />
      </div>

      <div className="container-page mt-24 md:mt-32">
        <SectionHeading eyebrow="Our Values" title="What guides how we work." />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="border-t border-ink-200 pt-6">
              <h3 className="text-xl">{value.title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-600">{value.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page mt-24 md:mt-32">
        <SectionHeading
          eyebrow="Who We Work With"
          title="International buyers, investors and families."
          description="Our clients include international buyers, property investors, second-home buyers, relocating families, luxury holiday-home buyers, high-net-worth individuals and digital entrepreneurs building a life across borders."
        />
      </div>
    </div>
  );
}
