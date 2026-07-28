import Link from "next/link";
import { Logo } from "./Logo";
import { primaryNav, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-900 text-sand-100">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo className="text-sand-50" />
          <p className="mt-4 font-sans text-sm leading-relaxed text-sand-200/80">{siteConfig.tagline}</p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-sand-200/70">
            An international property network built on trust, local expertise and long-term relationships.
          </p>
        </div>

        <div>
          <p className="eyebrow text-terracotta-300">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {primaryNav.slice(0, 5).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-sans text-sm text-sand-200/85 hover:text-sand-50">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-terracotta-300">Company</p>
          <ul className="mt-4 space-y-2.5">
            {primaryNav.slice(5).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-sans text-sm text-sand-200/85 hover:text-sand-50">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-terracotta-300">Connect</p>
          <ul className="mt-4 space-y-2.5 font-sans text-sm text-sand-200/85">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-sand-50">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={siteConfig.social.instagram} className="hover:text-sand-50">
                Instagram
              </a>
            </li>
            <li>
              <a href={siteConfig.social.linkedin} className="hover:text-sand-50">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sand-50/10">
        <div className="container-page flex flex-col gap-2 py-6 font-sans text-xs text-sand-200/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Trusted Property Connections.</p>
        </div>
      </div>
    </footer>
  );
}
