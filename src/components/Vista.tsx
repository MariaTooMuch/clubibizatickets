const VARIANTS = {
  coast: "from-aegean-700 via-aegean-400 to-sand-100",
  grove: "from-olive-700 via-olive-400 to-sand-100",
  clay: "from-terracotta-700 via-terracotta-400 to-sand-100",
  dusk: "from-ink-800 via-aegean-600 to-sand-200",
  dune: "from-sand-600 via-sand-300 to-sand-50",
  cliff: "from-ink-600 via-sand-400 to-sand-50",
} as const;

type VistaProps = {
  variant?: keyof typeof VARIANTS;
  ratio?: "square" | "portrait" | "landscape" | "wide";
  label?: string;
  className?: string;
};

const RATIOS: Record<NonNullable<VistaProps["ratio"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

/**
 * Abstract Mediterranean colour-field composition used in place of photography
 * until licensed imagery is supplied. Kept deliberately painterly rather than
 * photo-realistic so it reads as intentional art direction, not a stock photo.
 */
export function Vista({ variant = "coast", ratio = "landscape", label, className = "" }: VistaProps) {
  return (
    <div
      role="img"
      aria-label={label ?? "Decorative Mediterranean landscape composition"}
      className={`relative overflow-hidden rounded-sm bg-gradient-to-br ${VARIANTS[variant]} ${RATIOS[ratio]} ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.15] mix-blend-overlay"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <filter id={`grain-${variant}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${variant})`} />
      </svg>
      <svg
        className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-40"
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,80 C60,40 100,100 160,60 C220,20 260,90 320,50 C360,25 380,55 400,45 L400,120 L0,120 Z"
          fill="currentColor"
          className="text-sand-50/40"
        />
      </svg>
    </div>
  );
}
