import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          to="/"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold tracking-tight text-primary-foreground transition-opacity hover:opacity-80"
        >
          TN
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-border bg-canvas/70 px-2 py-2 backdrop-blur-md sm:flex">
          {[
            { label: "Work", to: "/#work" },
            { label: "About", to: "/#about" },
            { label: "Contact", to: "/#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.to}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-ink/10"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="mailto:hello@tina.dev"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold tracking-tight text-primary-foreground transition-opacity hover:opacity-80"
        >
          Let's talk
        </a>
      </nav>
    </header>
  );
}
