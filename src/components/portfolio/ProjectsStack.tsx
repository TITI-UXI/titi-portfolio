import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export type StackProject = {
  title: string;
  category: string;
  year: string;
  description: string;
  from: string;
  to: string;
};

const FALLBACK_PROJECTS: StackProject[] = [
  {
    title: "Fintech Ecosystem",
    category: "Product Design & Development",
    year: "2026",
    description: "A unified banking, payments and investing platform built for speed and clarity.",
    from: "#1b2436",
    to: "#8fa6c9",
  },
  {
    title: "Sina Wings 3D WebGL",
    category: "WebGL & Interaction",
    year: "2025",
    description: "An immersive real-time 3D showcase for an aviation brand, running smoothly in the browser.",
    from: "#2a1f1a",
    to: "#d9b48a",
  },
  {
    title: "Editorial Archive",
    category: "Art Direction & Frontend",
    year: "2024",
    description: "A typographic archive for long-form stories with a quiet, reading-first interface.",
    from: "#1a1a1a",
    to: "#bdbdbd",
  },
  {
    title: "Aurora Studio",
    category: "Brand & Interactive Site",
    year: "2026",
    description: "A motion-led studio site where every section responds to scroll with calm, physical easing.",
    from: "#131b2e",
    to: "#7f9bd6",
  },
  {
    title: "Field Notes",
    category: "Design & Development",
    year: "2025",
    description: "A research journal platform with fluid layouts, offline drafts and a distraction-free reading mode.",
    from: "#1f2a1c",
    to: "#a8c48e",
  },
  {
    title: "Halo Health",
    category: "Product Design",
    year: "2025",
    description: "A patient-first healthcare dashboard simplifying appointments, records and follow-ups.",
    from: "#2b1a22",
    to: "#d99ab5",
  },
  {
    title: "Mono Records",
    category: "E-commerce & WebGL",
    year: "2024",
    description: "A vinyl store with audio previews, a 3D turntable and a checkout that never leaves the page.",
    from: "#22201a",
    to: "#cfc4a4",
  },
];

function Card({
  project,
  index,
  total,
}: {
  project: StackProject;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.95]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : 0.45]);

  return (
    <div ref={ref} className="md:sticky md:top-0 md:flex md:h-screen md:items-center">
      <motion.article
        style={{ scale, top: `${index * 24}px` }}
        className="relative w-full origin-top overflow-hidden rounded-3xl bg-inverse text-inverse-foreground md:relative"
      >
        <div className="grid gap-6 p-6 sm:p-10 md:grid-cols-5 md:gap-10">
          <div className="flex flex-col justify-between gap-6 md:col-span-2">
            <div>
              <p className="eyebrow text-inverse-muted">
                {String(index + 1).padStart(2, "0")} / {project.year}
              </p>
              <h3 className="mt-4 text-4xl font-medium uppercase leading-none tracking-[-0.03em] sm:text-5xl">
                {project.title}
              </h3>
            </div>
            <div>
              <p className="text-sm text-inverse-muted">{project.category}</p>
              <p className="mt-3 max-w-sm text-base">{project.description}</p>
            </div>
          </div>
          <div
            className="aspect-[4/3] w-full rounded-2xl md:col-span-3 md:aspect-auto md:h-[60vh]"
            style={{ background: `linear-gradient(135deg, ${project.from}, ${project.to})` }}
          />
        </div>
        <motion.div
          aria-hidden
          style={{ opacity: overlay }}
          className="pointer-events-none absolute inset-0 hidden bg-foreground md:block"
        />
      </motion.article>
    </div>
  );
}

export function ProjectsStack({ projects }: { projects?: StackProject[] | null }) {
  const list = Array.isArray(projects) && projects.length > 0 ? projects : FALLBACK_PROJECTS;

  return (
    <section id="selected" className="bg-canvas px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow mb-10 text-muted-foreground">Selected works ({list.length})</p>
        <div className="flex flex-col gap-6 md:gap-0">
          {list.map((p, i) => (
            <Card key={p.title} project={p} index={i} total={list.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
