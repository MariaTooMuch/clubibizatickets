import Link from "next/link";
import type { ComponentProps } from "react";

type ArrowLinkProps = ComponentProps<typeof Link> & { direction?: "forward" | "back" };

export function ArrowLink({ direction = "forward", className = "", children, ...props }: ArrowLinkProps) {
  return (
    <Link
      {...props}
      className={`group inline-flex items-center gap-2 font-sans text-sm uppercase tracking-wide text-terracotta-700 transition-colors duration-200 hover:text-terracotta-900 ${className}`}
    >
      {direction === "back" && (
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-1">
          ←
        </span>
      )}
      {children}
      {direction === "forward" && (
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      )}
    </Link>
  );
}
