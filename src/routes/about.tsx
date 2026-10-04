import { createFileRoute } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TINA" },
      { name: "description", content: "TINA helps founders and forward-thinking studios with tailor-made digital solutions — design, development and visual journal." },
      { property: "og:title", content: "About — TINA" },
      { property: "og:description", content: "TINA helps founders and forward-thinking studios with tailor-made digital solutions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const DISCIPLINES = [
  { index: "01", title: "Design & Brand Identity", body: "Editorial layouts, typography, bespoke design systems, business cards & visual assets." },
  { index: "02", title: "Development", body: "Scalable front-end web applications, interactive micro-animations, GSAP motion, and fluid WebGL interactions." },
  { index: "03", title: "✦ Visual Journal & Reading", body: "Fine-art photography, high-end editorial image grading, and curated literary/reading reviews." },
];

function AboutPage() {
  return (
    <main className="min-h-screen bg-hero text-hero-foreground">
      <div className="mx-auto max-w-7xl px-8 pt-32 md:px-16 md:pt-44">
        <h1 className="max-w-4xl text-5xl font-normal leading-[1.08] tracking-tight md:text-7xl lg:text-8xl">
          Helping brands thrive in the digital world
        </h1>

        <div className="relative mt-20 border-t border-white/10 md:mt-28">
          <div className="absolute right-4 top-0 flex h-32 w-32 -translate-y-1/2 items-center justify-center rounded-full bg-cta-slate md:right-16 md:h-40 md:w-40">
            <Globe className="h-12 w-12 animate-[spin_12s_linear_infinite] md:h-14 md:w-14" strokeWidth={1} />
          </div>
        </div>

        <section className="mt-32 flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
          <div className="md:w-[34%] md:pt-8">
            <span aria-hidden className="text-3xl text-surface-soft">↘</span>
            <p className="mt-8 text-lg leading-relaxed md:text-xl">
              I help founders and forward-thinking studios with tailor-made digital solutions. With each project, I push visual fidelity and engineering to new horizons, always putting craft first.
            </p>
            <p className="mt-8 text-sm italic text-surface-muted">Always exploring...</p>
          </div>
          <div className="h-[70vh] w-full overflow-hidden rounded-none md:w-[60%]">
            <img src="/portrait.jpg" alt="Portrait of TINA" className="h-full w-full object-cover object-[center_20%]" />
          </div>
        </section>

        <section className="mt-40">
          <h2 className="mb-16 text-3xl font-normal md:text-5xl">I can help you with .</h2>
          <div className="grid gap-12 md:grid-cols-3 md:gap-10">
            {DISCIPLINES.map((d) => (
              <div key={d.index}>
                <p className="border-b border-white/10 pb-8 text-sm text-surface-muted">{d.index}</p>
                <h3 className="mt-8 text-2xl font-normal md:text-3xl">{d.title}</h3>
                <p className="mt-5 leading-relaxed text-surface-soft">{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-40 grid gap-16 pb-40 md:grid-cols-2 md:items-center">
          <div className="aspect-[4/5] w-full overflow-hidden">
            <img src="/portrait.jpg" alt="TINA at work" className="h-full w-full object-cover object-top grayscale" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-surface-muted">Recognition & Focus</p>
            <h2 className="mt-6 text-4xl font-normal tracking-tight md:text-6xl">Multidisciplinary Craft '20-26</h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-surface-soft">
              Six years of moving between design and code. Every interface is a small act of restraint — the easing curve, the kerning, the detail nobody names but everybody feels.
            </p>
          </div>
        </section>
      </div>
      <Footer lipClassName="bg-hero" />
    </main>
  );
}
