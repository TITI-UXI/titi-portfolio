const projects = [
  { index: "01", title: "Aurora Studio", category: "Interactive Site", year: "2026" },
  { index: "02", title: "Field Notes", category: "E-commerce", year: "2025" },
  { index: "03", title: "Halo Health", category: "Product Design & Build", year: "2025" },
  { index: "04", title: "Mono Records", category: "Web Experience", year: "2024" },
  { index: "05", title: "Northwind", category: "Brand & Development", year: "2024" },
];

export function RecentWork() {
  return (
    <section id="work" className="px-4 py-24 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="display-lg text-foreground">Recent Work</h2>
          <span className="eyebrow text-ink-soft">2024 — 2026</span>
        </div>

        <ul>
          {projects.map((project) => (
            <li key={project.index} className="border-t border-border last:border-b">
              <a
                href="#work"
                className="group flex items-baseline justify-between gap-6 py-7 transition-colors sm:py-9"
              >
                <div className="flex items-baseline gap-6 sm:gap-12">
                  <span className="eyebrow text-ink-soft">{project.index}</span>
                  <span className="text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-3 sm:text-4xl">
                    {project.title}
                  </span>
                </div>
                <div className="flex shrink-0 items-baseline gap-8 text-sm font-medium text-ink-soft sm:gap-16">
                  <span className="hidden sm:inline">{project.category}</span>
                  <span>{project.year}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
