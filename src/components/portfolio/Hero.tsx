export function Hero() {
  return (
    <section className="flex min-h-svh flex-col justify-end px-4 pb-10 pt-32 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-8 text-ink-soft">
          Freelance Developer
          <span className="mx-3 inline-block h-1 w-1 rounded-full bg-ink-soft align-middle" />
          Available for work
        </p>

        <h1 className="display-xl text-foreground">
          Creative
          <br />
          Developer
        </h1>

        <div className="mt-10 flex flex-col justify-between gap-6 border-t border-border pt-6 text-sm font-medium text-ink-soft sm:flex-row">
          <p>Currently based in Tehran — working worldwide.</p>
          <p>Digital experiences that feel crafted, not assembled.</p>
        </div>
      </div>
    </section>
  );
}
