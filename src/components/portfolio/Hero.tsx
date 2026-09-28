import { Marquee } from "./Marquee";

export function Hero() {
  return (
    <section className="flex min-h-svh flex-col justify-end overflow-hidden pb-10 pt-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <p className="eyebrow mb-8 text-ink-soft">
          Rasht, Iran
          <span className="mx-3 inline-block h-1 w-1 rounded-full bg-ink-soft align-middle" />
          Available Worldwide
        </p>

        <h2 className="display-xl text-foreground">
          Creative
          <br />
          Developer
        </h2>
      </div>

      <div className="mt-8">
        <Marquee />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mt-6 flex flex-col justify-between gap-6 border-t border-border pt-6 text-sm font-medium text-ink-soft sm:flex-row">
          <p>Iman Amanin — Creative Developer & Multidisciplinary Designer.</p>
          <p>Rasht, Iran — Available Worldwide</p>
        </div>
      </div>
    </section>
  );
}
