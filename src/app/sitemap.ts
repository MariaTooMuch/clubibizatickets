import type { MetadataRoute } from "next";
import { destinations, listings, journalArticles } from "@/data";
import { primaryNav } from "@/lib/site";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    ...primaryNav.map((item) => ({
      url: `${siteConfig.url}${item.href}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((destination) => ({
    url: `${siteConfig.url}/destinations/${destination.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${siteConfig.url}/buy/${listing.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const articleRoutes: MetadataRoute.Sitemap = journalArticles.map((article) => ({
    url: `${siteConfig.url}/journal/${article.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
    lastModified: article.publishedAt,
  }));

  return [...staticRoutes, ...destinationRoutes, ...listingRoutes, ...articleRoutes];
}
