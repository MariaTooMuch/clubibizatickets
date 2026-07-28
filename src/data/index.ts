export * from "./types";
export * from "./destinations";
export * from "./listings";
export * from "./developments";
export * from "./investments";
export * from "./journal";
export * from "./services";

import { destinations } from "./destinations";
import { listings } from "./listings";
import { developments } from "./developments";
import { investmentOpportunities } from "./investments";

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

export function listingsFor(destinationSlug: string) {
  return listings.filter((l) => l.destinationSlug === destinationSlug);
}

export function developmentsFor(destinationSlug: string) {
  return developments.filter((d) => d.destinationSlug === destinationSlug);
}

export function investmentsFor(destinationSlug: string) {
  return investmentOpportunities.filter((i) => i.destinationSlug === destinationSlug);
}

export function formatEUR(value: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
