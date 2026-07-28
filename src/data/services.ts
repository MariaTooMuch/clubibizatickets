import type { Faq, Service } from "./types";

export const services: Service[] = [
  {
    slug: "buyer-representation",
    title: "Buyer Representation",
    summary: "Independent representation for international buyers, from shortlist to closing.",
    points: [
      "Curated shortlist based on your criteria and budget",
      "Coordination of viewings across destinations",
      "Independent legal and tax referrals",
      "Negotiation and closing support",
    ],
  },
  {
    slug: "seller-advisory",
    title: "Seller Advisory",
    summary: "Positioning and introducing your property to a qualified international audience.",
    points: [
      "Market pricing analysis",
      "Professional listing preparation",
      "Introduction to our qualified buyer and partner network",
      "Transaction coordination through to completion",
    ],
  },
  {
    slug: "relocation-support",
    title: "Relocation Support",
    summary: "Practical support for families and individuals relocating internationally.",
    points: [
      "Area orientation and school research",
      "Residency and visa referral network",
      "Local service provider introductions",
      "Ongoing support after move-in",
    ],
  },
  {
    slug: "investment-advisory",
    title: "Investment Advisory",
    summary: "Guidance for investors evaluating yield, growth and portfolio diversification.",
    points: [
      "Market and yield analysis by destination",
      "Rental management partner introductions",
      "Off-plan and development due diligence",
      "Portfolio-level reporting",
    ],
  },
  {
    slug: "developer-partnerships",
    title: "Developer Partnerships",
    summary: "Distribution and international marketing support for trusted developers.",
    points: [
      "International buyer network access",
      "Sales & marketing collaboration",
      "Local market positioning guidance",
      "Qualified lead introductions",
    ],
  },
];

export const faqs: Faq[] = [
  {
    question: "Which countries does Link Places operate in?",
    answer:
      "Link Places currently connects buyers, investors and developers across Spain (Ibiza, Formentera, Mallorca, Marbella), Portugal (Algarve), Italy (Costa Smeralda), and Brazil (Bahia), through trusted local partners in each destination.",
  },
  {
    question: "Is Link Places a traditional real estate agency?",
    answer:
      "No. Link Places is an international property network. Rather than operating as a single local agency, we connect clients with trusted, vetted local partners and curated opportunities across our destinations.",
  },
  {
    question: "Can non-residents buy property through Link Places?",
    answer:
      "Yes. Many of our clients are international buyers, investors and relocating families. We coordinate with independent local legal and tax advisors to guide non-resident buyers through each destination's specific requirements.",
  },
  {
    question: "How does Link Places vet the properties and partners it features?",
    answer:
      "Every destination partner and listing is reviewed for legal standing, ownership clarity and market positioning before being introduced to our network, whether the listing originates from Link Places directly or from an authorised partner such as Best of Bahia.",
  },
  {
    question: "Does Link Places charge buyers a fee?",
    answer:
      "Our buyer representation services are typically compensated through the transaction structure customary in each destination. We disclose our fee arrangement clearly before any engagement begins.",
  },
];
