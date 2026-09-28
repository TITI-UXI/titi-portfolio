import { createFileRoute } from "@tanstack/react-router";
import { TransitionLink } from "@/components/portfolio/PageTransition";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TINA" },
      { name: "description", content: "TINA is a creative developer and multidisciplinary designer based in Rasht, Iran, working worldwide." },
      { property: "og:title", content: "About — TINA" },
      { property: "og:description", content: "TINA is a creative developer and multidisciplinary designer based in Rasht, Iran, working worldwide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const SERVICES = [
  {
    index: "01",
    title: "Design",
    items: ["Art direction", "UI / UX design", "Design systems", "Prototyping", "Brand identity"],
  },
  {
    index: "02",
    title: "Development",
    items: ["Creative front-end", "React & TypeScript", "WebGL & motion", "CMS integration", "Performance"],
  },
  {
    index: "03",
    title: "Strategy",
    items: ["Product thinking", "Content structure", "Accessibility", "SEO foundations", "Launch support"],
  },
];

function AboutPage() {
  return (
    <main className="min-h-screen bg-canvas px-4 pb-32 pt-32 text-foreground sm:px-6 sm:pt-40">
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow text-ink-soft">About — TINA</p>
        <h1 className="display-xl mt-6 max-w-5xl">
          Design-minded developer, detail-obsessed designer
        </h1>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl">
              <img
                src="/portrait.jpg"
                alt="Portrait of TINA"
                className="h-full w-full object-cover grayscale"
              />
            </div>
            <p className="eyebrow mt-6 text-ink-soft">Rasht, Iran — Available Worldwide</p>
          </div>

          <div className="space-y-16">
            <section aria-label="Bio">
              <h2 className="eyebrow mb-6 text-ink-soft">Bio</h2>
              <p className="max-w-2xl text-xl leading-relaxed sm:text-2xl">
                I'm TINA — a creative developer and multidisciplinary designer. I help
                brands and startups turn fuzzy ideas into precise, fast, memorable
                digital products. My work sits at the seam between design and
                engineering: I sketch in the browser, prototype in code, and ship
                interfaces that feel as good as they look.
              </p>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-soft sm:text-2xl">
                Over the past five years I've worked across fintech, e-commerce and
                editorial projects — always with the same rule: every pixel earns its
                place, and every millisecond of motion has a reason.
              </p>
            </section>

            <section aria-label="Philosophy">
              <h2 className="eyebrow mb-6 text-ink-soft">Philosophy</h2>
              <blockquote className="max-w-2xl border-l-2 border-foreground pl-6 text-2xl font-medium leading-snug sm:text-3xl">
                Restraint is a feature. The best interface is the one you barely
                notice — until it moves.
              </blockquote>
            </section>

            <section aria-label="Services">
              <h2 className="eyebrow mb-6 text-ink-soft">Services</h2>
              <ul>
                {SERVICES.map((service) => (
                  <li
                    key={service.index}
                    className="grid gap-4 border-t border-border py-8 last:border-b sm:grid-cols-[0.5fr_1fr_1.5fr] sm:items-baseline"
                  >
                    <span className="eyebrow text-ink-soft">{service.index}</span>
                    <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      {service.title}
                    </span>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                      {service.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>

            <div>
              <TransitionLink
                href="/contact"
                label="Contact"
                className="inline-block rounded-full border border-foreground px-8 py-4 text-sm font-medium transition-colors hover:bg-foreground hover:text-canvas"
              >
                Let's work together
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
