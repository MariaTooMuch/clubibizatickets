"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { primaryNav } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-sand-50/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="text-ink-900" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`border-b pb-1 font-sans text-sm uppercase tracking-wide transition-colors ${
                      isActive
                        ? "border-terracotta-600 text-ink-900"
                        : "border-transparent text-ink-700 hover:border-terracotta-300 hover:text-terracotta-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link href="/contact" className="btn-secondary hidden lg:inline-flex">
          Enquire
        </Link>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-px w-6 bg-ink-900 transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`absolute left-0 top-2 h-px w-6 bg-ink-900 transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`absolute left-0 top-4 h-px w-6 bg-ink-900 transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-ink-100 bg-sand-50 lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 font-sans text-base text-ink-800 hover:text-terracotta-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary w-full">
                Enquire
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
