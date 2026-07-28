const VARIANTS = {
  coast: "from-aegean-700 via-aegean-400 to-sand-100",
  grove: "from-olive-700 via-olive-400 to-sand-100",
  clay: "from-terracotta-700 via-terracotta-400 to-sand-100",
  dusk: "from-ink-800 via-aegean-600 to-sand-200",
  dune: "from-sand-600 via-sand-300 to-sand-50",
  cliff: "from-ink-600 via-sand-400 to-sand-50",
} as const;

type Variant = keyof typeof VARIANTS;

type VistaProps = {
  variant?: Variant;
  ratio?: "square" | "portrait" | "landscape" | "wide";
  label?: string;
  className?: string;
  hoverZoom?: boolean;
};

const RATIOS: Record<NonNullable<VistaProps["ratio"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

/** A single soft ridge line, reused at different amplitudes/positions per motif. */
function Ridge({ d, opacity = 0.4 }: { d: string; opacity?: number }) {
  return <path d={d} fill="currentColor" className="text-sand-50" style={{ opacity }} />;
}

function Motif({ variant }: { variant: Variant }) {
  switch (variant) {
    case "coast":
      return (
        <>
          <Ridge d="M0,84 C60,44 100,104 160,64 C220,24 260,94 320,54 C360,29 380,59 400,49 L400,120 L0,120 Z" opacity={0.4} />
          <Ridge d="M0,100 C70,72 130,116 200,92 C270,68 330,108 400,86 L400,120 L0,120 Z" opacity={0.25} />
        </>
      );
    case "grove":
      return (
        <g className="text-sand-50" style={{ opacity: 0.4 }}>
          {[40, 100, 160, 220, 280, 340].map((cx, i) => (
            <g key={cx}>
              <line x1={cx} y1={120} x2={cx} y2={190 - (i % 2) * 10} stroke="currentColor" strokeWidth="2" />
              <circle cx={cx} cy={175 - (i % 2) * 10} r={22 - (i % 3) * 3} fill="currentColor" opacity={0.6} />
            </g>
          ))}
          <path d="M0,205 C80,185 160,215 240,195 C300,180 350,200 400,190 L400,240 L0,240 Z" fill="currentColor" opacity={0.35} />
        </g>
      );
    case "clay":
      return (
        <g className="text-sand-50" style={{ opacity: 0.45 }}>
          <circle cx="330" cy="60" r="46" fill="currentColor" opacity={0.5} />
          <path d="M0,150 C90,120 150,165 240,135 C310,112 350,140 400,122 L400,300 L0,300 Z" fill="currentColor" opacity={0.3} />
        </g>
      );
    case "dusk":
      return (
        <g className="text-sand-50" style={{ opacity: 0.5 }}>
          {[
            [40, 40], [90, 70], [140, 30], [200, 55], [250, 20], [300, 60], [350, 35], [70, 110], [230, 100], [320, 100],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2.2 : 1.3} fill="currentColor" />
          ))}
          <path d="M0,160 C80,135 160,175 240,150 C300,132 350,158 400,140 L400,300 L0,300 Z" fill="currentColor" opacity={0.35} />
        </g>
      );
    case "dune":
      return (
        <>
          <Ridge d="M0,140 C100,180 180,110 280,150 C330,170 370,145 400,155 L400,300 L0,300 Z" opacity={0.3} />
          <Ridge d="M0,180 C110,210 190,160 300,190 C340,202 370,188 400,195 L400,300 L0,300 Z" opacity={0.4} />
        </>
      );
    case "cliff":
      return (
        <g className="text-sand-50" style={{ opacity: 0.4 }}>
          <Ridge d="M0,90 C90,100 130,80 220,92 C300,102 350,86 400,94 L400,105 C350,97 300,113 220,103 C130,91 90,111 0,101 Z" opacity={0.5} />
          <Ridge d="M0,150 C90,160 130,140 220,152 C300,162 350,146 400,154 L400,166 C350,158 300,174 220,164 C130,152 90,172 0,162 Z" opacity={0.4} />
          <Ridge d="M0,210 C90,220 130,200 220,212 C300,222 350,206 400,214 L400,226 C350,218 300,234 220,224 C130,212 90,232 0,222 Z" opacity={0.3} />
        </g>
      );
    default:
      return null;
  }
}

/**
 * Abstract Mediterranean colour-field composition used in place of photography
 * until licensed imagery is supplied. Each variant carries its own line-art
 * motif so the placeholders read as intentional art direction, not stock photos.
 */
export function Vista({ variant = "coast", ratio = "landscape", label, className = "", hoverZoom = false }: VistaProps) {
  return (
    <div
      role="img"
      aria-label={label ?? "Decorative Mediterranean landscape composition"}
      className={`relative overflow-hidden rounded-sm bg-gradient-to-br ${VARIANTS[variant]} ${RATIOS[ratio]} ${className}`}
    >
      <div
        className={`absolute inset-0 ${hoverZoom ? "transition-transform duration-700 ease-out group-hover:scale-[1.06]" : ""}`}
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
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
          <Motif variant={variant} />
        </svg>
      </div>
    </div>
  );
}
