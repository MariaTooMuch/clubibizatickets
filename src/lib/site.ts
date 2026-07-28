export const siteConfig = {
  name: "Link Places",
  tagline: "Trusted Property Connections.",
  description:
    "Link Places is an international premium property platform connecting buyers, investors, developers and trusted real estate partners across the world's most desirable destinations.",
  url: "https://www.linkplaces.com",
  email: "hello@linkplaces.com",
  social: {
    instagram: "https://www.instagram.com/linkplaces",
    linkedin: "https://www.linkedin.com/company/linkplaces",
  },
};

export const primaryNav = [
  { label: "Buy", href: "/buy" },
  { label: "Sell", href: "/sell" },
  { label: "Destinations", href: "/destinations" },
  { label: "Developments", href: "/developments" },
  { label: "Investments", href: "/investments" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
] as const;
