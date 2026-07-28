import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Link Places team about buying, selling, investing or a developer partnership.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }])} />
      <div className="container-page grid gap-16 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-3xl leading-tight md:text-4xl">Let&apos;s talk about your next property.</h1>
          <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-ink-600">
            Whether you&apos;re buying, selling, investing or relocating, tell us a little about what you need and
            we&apos;ll introduce you to the right person on our team.
          </p>
          <div className="mt-8 space-y-2 font-sans text-sm text-ink-700">
            <p>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-terracotta-700">
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
