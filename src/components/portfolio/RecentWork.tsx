import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const projects = [
  { index: "01", title: "Aurora Studio", category: "Interactive Site", year: "2026", gradient: "from-[#2b3a67] via-[#496a81] to-[#b3c2bf]", accent: "#b3c2bf" },
  { index: "02", title: "Field Notes", category: "E-commerce", year: "2025", gradient: "from-[#3d2c29] via-[#8c5e4a] to-[#e0c097]", accent: "#e0c097" },
  { index: "03", title: "Halo Health", category: "Product Design & Build", year: "2025", gradient: "from-[#1e3a32] via-[#3f7d6b] to-[#a8d5ba]", accent: "#a8d5ba" },
  { index: "04", title: "Mono Records", category: "Web Experience", year: "2024", gradient: "from-[#171717] via-[#3a3a3a] to-[#9a9a9a]", accent: "#9a9a9a" },
  { index: "05", title: "Northwind", category: "Brand & Development", year: "2024", gradient: "from-[#26324d] via-[#4a5f8f] to-[#aebfe8]", accent: "#aebfe8" },
];

function Thumb({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${project.gradient}`}>
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
        style={{ backgroundColor: project.accent }}
      />
      <div className="absolute bottom-4 left-4 font-display text-lg font-bold uppercase tracking-tight text-canvas">
        {project.title}
      </div>
    </div>
  );
}

export function RecentWork() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const finePointer = useRef(false);

  useEffect(() => {
    finePointer.current = window.matchMedia("(pointer: fine)").matches;
    const modal = modalRef.current;
    const section = sectionRef.current;
    if (!modal || !section || !finePointer.current) return;

    gsap.set(modal, { xPercent: -50, yPercent: -50, scale: 0 });
    const xTo = gsap.quickTo(modal, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(modal, "y", { duration: 0.55, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const enter = () =>
      gsap.to(modal, { scale: 1, duration: 0.5, ease: "back.out(1.4)" });
    const leave = () =>
      gsap.to(modal, { scale: 0, duration: 0.4, ease: "power3.in" });

    section.addEventListener("mousemove", move);
    section.addEventListener("mouseenter", enter);
    section.addEventListener("mouseleave", leave);
    return () => {
      section.removeEventListener("mousemove", move);
      section.removeEventListener("mouseenter", enter);
      section.removeEventListener("mouseleave", leave);
    };
  }, []);

  // Slide the thumbnail strip when the active project changes
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !finePointer.current) return;
    gsap.to(strip, { yPercent: -active * 100, duration: 0.5, ease: "power3.out" });
  }, [active]);

  return (
    <section id="work" ref={sectionRef} className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="display-lg text-foreground">Recent Work</h2>
          <span className="eyebrow text-ink-soft">2024 — 2026</span>
        </div>

        <ul onMouseLeave={() => setActive(0)}>
          {projects.map((project, i) => (
            <li key={project.index} className="border-t border-border last:border-b">
              <a
                href="#work"
                onMouseEnter={() => setActive(i)}
                className="group flex items-baseline justify-between gap-6 py-7 transition-opacity duration-300 hover:opacity-60 sm:py-9"
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
              {/* Inline thumbnail on touch / small screens */}
              <div className="pb-7 md:hidden">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <Thumb project={project} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating hover modal — desktop only */}
      <div
        ref={modalRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-56 w-80 overflow-hidden rounded-2xl shadow-2xl md:block"
      >
        <div ref={stripRef} className="h-full w-full">
          {projects.map((project) => (
            <div key={project.index} className="h-full w-full">
              <Thumb project={project} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-canvas text-xs font-semibold uppercase tracking-widest text-ink">
            View
          </div>
        </div>
      </div>
    </section>
  );
}
