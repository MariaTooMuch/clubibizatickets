import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-3xl md:text-4xl">This page could not be found.</h1>
      <p className="mt-4 max-w-md font-sans text-sm text-ink-600">
        The page you&apos;re looking for may have moved or no longer exists.
      </p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        Return Home
      </Link>
    </div>
  );
}
