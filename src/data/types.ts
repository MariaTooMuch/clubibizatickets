export type Destination = {
  slug: string;
  name: string;
  region: string;
  summary: string;
  description: string;
  highlights: string[];
  vista: "coast" | "grove" | "clay" | "dusk" | "dune" | "cliff";
};

export type Listing = {
  slug: string;
  title: string;
  destinationSlug: string;
  type: "Villa" | "Apartment" | "Penthouse" | "Estate" | "Townhouse";
  priceEUR: number;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  summary: string;
  features: string[];
  vista: Destination["vista"];
  source?: string;
};

export type Development = {
  slug: string;
  name: string;
  destinationSlug: string;
  developer: string;
  status: "Off-plan" | "Under construction" | "Ready to move in";
  completionYear: number;
  priceFromEUR: number;
  summary: string;
  units: string[];
  vista: Destination["vista"];
};

export type InvestmentOpportunity = {
  slug: string;
  title: string;
  destinationSlug: string;
  strategy: string;
  minimumEUR: number;
  projectedYield: string;
  summary: string;
  vista: Destination["vista"];
};

export type JournalArticle = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  excerpt: string;
  body: string[];
  vista: Destination["vista"];
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  points: string[];
};

export type Faq = {
  question: string;
  answer: string;
};
