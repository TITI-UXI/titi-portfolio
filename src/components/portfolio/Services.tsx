const services = [
  {
    index: "01",
    title: "Creative Development",
    description:
      "Fast, precise front-ends built with React, GSAP and WebGL. Performance budgets, pixel-accurate builds and motion that feels native.",
  },
  {
    index: "02",
    title: "Interaction & Motion",
    description:
      "Scroll choreography, micro-interactions and page transitions that give a product its character without getting in the way.",
  },
  {
    index: "03",
    title: "Brand & Visual Identity",
    description:
      "Type systems, colour and art direction that carry from the logo to the landing page — one voice across every touchpoint.",
  },
  {
    index: "04",
    title: "Product & UX Design",
    description:
      "From first wireframe to shipped interface. Research-led, prototype-driven and designed with the build in mind.",
  },
];

export function Services() {
  return (
    <section id="services" className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-6 text-ink-soft">Services</p>
            <h2 className="display-lg text-foreground">What I do</h2>
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-ink-soft">
            Working with studios, founders and agencies worldwide — from a single
            landing page to a full product, design and build under one roof.
          </p>
        </div>

        <ul>
          {services.map((service) => (
            <li
              key={service.index}
              className="group grid gap-4 border-t border-border py-8 last:border-b sm:grid-cols-12 sm:gap-8 sm:py-10"
            >
              <span className="eyebrow text-ink-soft sm:col-span-1">{service.index}</span>
              <h3 className="text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-3 sm:col-span-5 sm:text-4xl">
                {service.title}
              </h3>
              <p className="text-base leading-relaxed text-ink-soft sm:col-span-6 sm:col-start-7 sm:max-w-md sm:justify-self-end sm:text-lg">
                {service.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
