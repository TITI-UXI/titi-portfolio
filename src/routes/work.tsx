import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { TransitionLink } from "@/components/portfolio/CurvedTransition";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — TINA" },
      { name: "description", content: "Selected digital products, design and development projects by TINA." },
      { property: "og:title", content: "Work — TINA" },
      { property: "og:description", content: "Selected digital products, design and development projects by TINA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkPage,
});

type Category = "Design" | "Development";

const PROJECTS: Array<{
  title: string;
  client: string;
  location: string;
  services: string;
  year: string;
  category: Category;
  gradient: string;
  accent: string;
}> = [
  { title: "Aurora Studio", client: "Aurora", location: "Berlin", services: "Art Direction, Build", year: "2026", category: "Development", gradient: "from-[#2b3a67] via-[#496a81] to-[#b3c2bf]", accent: "#b3c2bf" },
  { title: "Field Notes", client: "Field Co.", location: "Amsterdam", services: "E-commerce Design", year: "2025", category: "Design", gradient: "from-[#3d2c29] via-[#8c5e4a] to-[#e0c097]", accent: "#e0c097" },
  { title: "Halo Health", client: "Halo", location: "London", services: "Product Design & Build", year: "2025", category: "Design", gradient: "from-[#1e3a32] via-[#3f7d6b] to-[#a8d5ba]", accent: "#a8d5ba" },
  { title: "Mono Records", client: "Mono", location: "Tehran", services: "Web Experience", year: "2024", category: "Development", gradient: "from-[#171717] via-[#3a3a3a] to-[#9a9a9a]", accent: "#9a9a9a" },
  { title: "Northwind", client: "Northwind", location: "Oslo", services: "Brand & Development", year: "2024", category: "Development", gradient: "from-[#26324d] via-[#4a5f8f] to-[#aebfe8]", accent: "#aebfe8" },
  { title: "Sina Wings", client: "Sina", location: "Rasht", services: "3D WebGL Site", year: "2025", category: "Development", gradient: "from-[#241f3d] via-[#5b4a8a] to-[#c9b8e8]", accent: "#c9b8e8" },
  { title: "Ledgerly", client: "Ledgerly", location: "Dubai", services: "Fintech UI System", year: "2026", category: "Design", gradient: "from-[#12303f] via-[#2f6b7a] to-[#a8e0d5]", accent: "#a8e0d5" },
];

type Filter = "All" | Category;
type ViewMode = "list" | "grid";

function Thumb({ project }: { project: (typeof PROJECTS)[number] }) {
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

function WorkPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<ViewMode>("list");
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const filtered = PROJECTS.filter((p) => filter === "All" || p.category === filter);
  const counts: Record<Filter, number> = {
    All: PROJECTS.length,
    Design: PROJECTS.filter((p) => p.category === "Design").length,
    Development: PROJECTS.filter((p) => p.category === "Development").length,
  };

  // Floating follower: rectangular preview in List view, compact "View" circle in Grid view.
  const quick = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal || !window.matchMedia("(pointer: fine)").matches) return;
    gsap.set(modal, { xPercent: -50, yPercent: -50, scale: 0 });
    const lag = view === "list" ? 0.6 : 0.3;
    quick.current = {
      x: gsap.quickTo(modal, "x", { duration: lag, ease: "power3.out" }),
      y: gsap.quickTo(modal, "y", { duration: lag, ease: "power3.out" }),
    };
    return () => {
      gsap.killTweensOf(modal);
      quick.current = null;
    };
  }, [view]);

  const follow = (e: ReactMouseEvent) => {
    quick.current?.x(e.clientX);
    quick.current?.y(e.clientY);
  };
  const showFollower = (i: number) => {
    setActive(i);
    if (quick.current && modalRef.current) gsap.to(modalRef.current, { scale: 1, duration: 0.45, ease: "back.out(1.4)" });
  };
  const hideFollower = () => {
    if (modalRef.current) gsap.to(modalRef.current, { scale: 0, duration: 0.35, ease: "power3.in" });
  };

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || view !== "list") return;
    gsap.to(strip, { yPercent: -active * 100, duration: 0.5, ease: "power3.out" });
  }, [active, view]);

  return (
    <main className="min-h-screen bg-canvas px-4 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-7xl pb-32">
        <p className="eyebrow pt-28 text-ink-soft md:pt-36">Work — 2024 / 2026</p>
        <h1 className="mt-6 max-w-4xl pb-12 text-left text-5xl font-normal leading-[1.08] tracking-tight text-foreground md:text-6xl lg:text-[4.75rem]">
          Creating next level digital products
        </h1>

        {/* Filters + view toggle */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-3" role="group" aria-label="Filter projects">
            {(["All", "Design", "Development"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setFilter(option);
                  setActive(0);
                }}
                aria-pressed={filter === option}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                  filter === option
                    ? "border-foreground bg-foreground text-canvas"
                    : "border-border text-ink-soft hover:border-foreground hover:text-foreground"
                }`}
              >
                {option}
                <sup className="ml-1 text-[0.65em]">{counts[option]}</sup>
              </button>
            ))}
          </div>
          <div className="flex gap-2" role="group" aria-label="View mode">
            {(["list", "grid"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
                  view === mode
                    ? "border-foreground bg-foreground text-canvas"
                    : "border-border text-ink-soft hover:border-foreground hover:text-foreground"
                }`}
              >
                {mode === "list" ? "List" : "Grid"}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="mt-12"
            >
              <div className="eyebrow hidden grid-cols-[2fr_1fr_1.5fr_1fr_0.5fr] gap-6 border-b border-border pb-4 text-ink-soft sm:grid">
                <span>Client</span>
                <span>Location</span>
                <span>Services</span>
                <span>Category</span>
                <span className="text-right">Year</span>
              </div>
              <ul onMouseMove={follow} onMouseLeave={hideFollower}>
                {filtered.map((project, i) => (
                  <li key={project.title} className="border-b border-border" onMouseEnter={() => showFollower(i)}>
                    <div className="group grid gap-2 py-6 transition-opacity hover:opacity-60 sm:grid-cols-[2fr_1fr_1.5fr_1fr_0.5fr] sm:items-baseline sm:gap-6 sm:py-8">
                      <span className="text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-3 sm:text-3xl">
                        {project.client}
                      </span>
                      <span className="text-sm text-ink-soft">{project.location}</span>
                      <span className="text-sm text-ink-soft">{project.services}</span>
                      <span className="text-sm text-ink-soft">{project.category}</span>
                      <span className="text-sm text-ink-soft sm:text-right">{project.year}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.section
              key="grid"
              ref={sectionRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="relative mt-12"
              onMouseMove={follow}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {filtered.map((project, i) => (
                  <div
                    key={project.title}
                    onMouseEnter={() => showFollower(i)}
                    onMouseLeave={hideFollower}
                    className="group md:cursor-none"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl transition-transform duration-500 group-hover:scale-[0.98]">
                      <Thumb project={project} />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="text-xl font-semibold tracking-tight">{project.title}</span>
                      <span className="text-sm text-ink-soft">
                        {project.category} — {project.year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </motion.section>
          )}
        </AnimatePresence>

        {view === "list" ? (
          <div
            key="list-preview"
            ref={modalRef}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-60 w-80 overflow-hidden rounded-2xl shadow-2xl md:block"
            style={{ transform: "scale(0)" }}
          >
            <div ref={stripRef} className="h-full w-full">
              {filtered.map((project) => (
                <div key={project.title} className="h-full w-full">
                  <Thumb project={project} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            key="grid-cursor"
            ref={modalRef}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-20 w-20 items-center justify-center rounded-full bg-foreground text-xs font-semibold uppercase tracking-widest text-canvas md:flex"
            style={{ transform: "scale(0)" }}
          >
            View
          </div>
        )}

        <div className="mt-24 flex justify-center">
          <TransitionLink
            href="/contact"
            label="Contact"
            className="rounded-full border border-foreground px-8 py-4 text-sm font-medium transition-colors hover:bg-foreground hover:text-canvas"
          >
            Start a project
          </TransitionLink>
        </div>
      </div>
      <Footer />
    </main>
  );
}
