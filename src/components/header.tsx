import { Link } from "@tanstack/react-router";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4 border-b-4 border-ink px-5 py-4 sm:px-8">
      <Link to="/" className="m-0 flex items-center gap-3 font-sans text-2xl text-ink">
        <img
          src="/jetson/icon.jpg"
          alt=""
          className="h-12 w-12 rounded-2xl border-4 border-ink object-cover"
        />
        ${site.ticker}
      </Link>
      <nav className="flex items-center gap-4 font-mono text-sm">
        <Link
          to="/bus"
          className="text-ink underline"
          activeProps={{ className: "rounded-full bg-lime px-3 py-1 text-ink no-underline" }}
        >
          Bus
        </Link>
        <Link
          to="/how"
          className="text-ink underline"
          activeProps={{ className: "rounded-full bg-sky px-3 py-1 text-ink no-underline" }}
        >
          How
        </Link>
      </nav>
    </header>
  );
}
