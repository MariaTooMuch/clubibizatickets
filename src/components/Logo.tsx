export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-serif ${className}`}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="8" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="14" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.1" />
      </svg>
      <span className="text-lg tracking-wide">
        Link <span className="italic">Places</span>
      </span>
    </span>
  );
}
