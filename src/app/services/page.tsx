import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { services, faqs } from "@/data";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Buyer representation, seller advisory, relocation support, investment advisory and developer partnerships from Link Places.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="py-16 md:py-24">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Services", url: "/services" }])} />
      <JsonLd data={faqSchema(faqs)} />
      <div className="container-page">
        <SectionHeading
          eyebrow="Services"
          title="Support at every stage of an international property decision."
          description="Whether you're buying, selling, relocating or investing, our team and local partners provide guidance tailored to your destination and goals."
        />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.slug} className="border-t border-ink-200 pt-6">
              <h2 className="text-xl">{service.title}</h2>
              <p className="mt-2 font-sans text-sm text-ink-600">{service.summary}</p>
              <ul className="mt-4 space-y-2 font-sans text-sm text-ink-700">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1 h-1 w-1 shrink-0 rounded-full bg-terracotta-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page mt-24 md:mt-32">
        <SectionHeading eyebrow="Frequently Asked" title="Questions we hear often." />
        <div className="mt-10 max-w-3xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </div>

      <div className="container-page mt-20">
        <div className="rounded-sm bg-sand-100 p-10 text-center">
          <h2 className="text-2xl">Not sure where to start?</h2>
          <p className="mx-auto mt-3 max-w-lg font-sans text-sm text-ink-600">
            Tell us a little about your situation and we&apos;ll point you to the right service and destination.
          </p>
          <Link href="/contact" className="btn-primary mt-6 inline-flex">
            Contact Our Team
          </Link>
        </div>
      </div>
    </div>
  );
}
