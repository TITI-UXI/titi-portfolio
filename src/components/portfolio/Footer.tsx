export function Footer() {
  return (
    <footer id="contact" className="bg-inverse px-4 pb-10 pt-28 text-inverse-foreground sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-8 text-inverse-muted">Got a project?</p>

        <a
          href="mailto:hello@tina.dev"
          className="display-lg block transition-opacity hover:opacity-70"
        >
          Let's work
          <br />
          together
        </a>

        <div className="mt-24 flex flex-col gap-6 border-t border-inverse-border pt-6 text-sm font-medium text-inverse-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Tina</p>
          <div className="flex gap-6">
            <a href="#contact" className="transition-opacity hover:opacity-70">
              Twitter
            </a>
            <a href="#contact" className="transition-opacity hover:opacity-70">
              GitHub
            </a>
            <a href="#contact" className="transition-opacity hover:opacity-70">
              LinkedIn
            </a>
          </div>
          <p>Tehran, IR</p>
        </div>
      </div>
    </footer>
  );
}
