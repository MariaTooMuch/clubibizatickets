import { siteConfig } from "./site";
import type { Destination, Faq, JournalArticle, Listing } from "@/data/types";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    slogan: siteConfig.tagline,
    email: siteConfig.email,
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
    areaServed: ["Spain", "Portugal", "Italy", "Brazil"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/buy?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function listingSchema(listing: Listing, destination?: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.summary,
    url: `${siteConfig.url}/buy/${listing.slug}`,
    price: listing.priceEUR,
    priceCurrency: "EUR",
    numberOfRooms: listing.bedrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: listing.areaSqm,
      unitCode: "MTK",
    },
    address: destination
      ? {
          "@type": "PostalAddress",
          addressRegion: destination.region,
        }
      : undefined,
  };
}

export function articleSchema(article: JournalArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    url: `${siteConfig.url}/journal/${article.slug}`,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    articleSection: article.category,
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
