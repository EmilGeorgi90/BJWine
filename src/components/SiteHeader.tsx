import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60">
      <div className="container-editorial flex flex-col items-start gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="group flex items-baseline gap-3">
          <span className="font-display text-2xl tracking-tight text-primary">BJ Wine</span>
        </Link>
        <nav className="flex w-full flex-wrap items-center gap-x-6 gap-y-3 text-sm sm:w-auto lg:gap-8">
          <Link
            to="/"
            className="text-foreground/80 transition hover:text-primary"
            activeProps={{ className: "text-primary font-medium" }}
            activeOptions={{ exact: true }}
          >
            Katalog
          </Link>
          <Link
            to="/om"
            className="text-foreground/80 transition hover:text-primary"
            activeProps={{ className: "text-primary font-medium" }}
          >
            Om butikken
          </Link>
          <Link
            to="/vinsmagning"
            className="text-foreground/80 transition hover:text-primary"
            activeProps={{ className: "text-primary font-medium" }}
          >
            Vinsmagning
          </Link>
          <Link
            to="/kontakt"
            className="text-foreground/80 transition hover:text-primary"
            activeProps={{ className: "text-primary font-medium" }}
          >
            Kontakt
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="container-editorial flex flex-col gap-2 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display text-base text-primary">BJ Wine</span>
          {" — "}Kurateret vinhandel.
        </p>
        <p>© {new Date().getFullYear()} BJ Wine. Alle rettigheder forbeholdes.</p>
      </div>
    </footer>
  );
}
