import type { InvestmentOpportunity } from "./types";

export const investmentOpportunities: InvestmentOpportunity[] = [
  {
    slug: "ibiza-managed-villa-portfolio",
    title: "Ibiza Managed Villa Portfolio",
    destinationSlug: "ibiza-formentera",
    strategy: "Buy-to-let with full rental management",
    minimumEUR: 1200000,
    projectedYield: "4.5% – 6.0% net",
    summary:
      "A curated selection of villas let through a single managed rental program, spreading seasonal demand across multiple properties.",
    vista: "coast",
  },
  {
    slug: "marbella-golf-residences",
    title: "Marbella Golf Residence Fund",
    destinationSlug: "marbella-costa-del-sol",
    strategy: "Co-investment in branded golf residences",
    minimumEUR: 350000,
    projectedYield: "5.0% – 7.0% net",
    summary: "Fractional positions in a branded residence development with a fixed operator lease-back agreement.",
    vista: "clay",
  },
  {
    slug: "algarve-relocation-rentals",
    title: "Algarve Long-Let Relocation Homes",
    destinationSlug: "algarve",
    strategy: "Long-term lease to relocating families",
    minimumEUR: 600000,
    projectedYield: "3.8% – 5.2% net",
    summary: "Stable, long-let residential assets aimed at the growing relocation and remote-work population.",
    vista: "dune",
  },
  {
    slug: "bahia-coastal-development",
    title: "Bahia Coastal Development Positions",
    destinationSlug: "bahia-brazil",
    strategy: "Early-stage coastal land & resort development",
    minimumEUR: 450000,
    projectedYield: "Growth-oriented, target 2-3x over 7 years",
    summary: "Introduced through our authorised local partner, targeting long-term appreciation on Bahia's Atlantic coastline.",
    vista: "dusk",
  },
];
