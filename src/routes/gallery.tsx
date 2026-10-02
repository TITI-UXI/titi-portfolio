import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import img1 from "@/assets/gallery-1.jpg";
import img2 from "@/assets/gallery-2.jpg";
import img3 from "@/assets/gallery-3.jpg";
import img4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — TINA" },
      { name: "description", content: "A visual journal of photography, reading and editorial studies by TINA." },
      { property: "og:title", content: "Gallery — TINA" },
      { property: "og:description", content: "A visual journal of photography, reading and editorial studies by TINA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

const BASE = "#141516";
const IMAGES = [img1, img2, img3, img4];
const ENTRIES = [
  { title: "Caspian Dawn", kicker: "Selected Photography", color: "#b59e91" },
  { title: "Concrete Hours", kicker: "This strange page", color: "#9a9b9c" },
  { title: "Terracotta", kicker: "Selected Photography", color: "#b07a62" },
  { title: "Rain Reading", kicker: "Reading Journal", color: "#c7beb5" },
  { title: "Low Tide", kicker: "This strange page", color: "#a89a8c" },
  { title: "Stairwell", kicker: "Architecture Study", color: "#8f9294" },
  { title: "Clay & Light", kicker: "Selected Photography", color: "#c08a72" },
  { title: "Linen Notes", kicker: "Reading Journal", color: "#cfc4b8" },
  { title: "Fog Line", kicker: "Selected Photography", color: "#b8a497" },
  { title: "Grey Room", kicker: "Architecture Study", color: "#a3a4a5" },
  { title: "Dry Bloom", kicker: "This strange page", color: "#b5836b" },
  { title: "Margins", kicker: "Reading Journal", color: "#c4b9ad" },
  { title: "Still Water", kicker: "Selected Photography", color: "#ad9a8e" },
  { title: "Brutal Soft", kicker: "Architecture Study", color: "#96999b" },
].map((e, i) => ({ ...e, index: String(i + 1).padStart(2, "0"), src: IMAGES[i % 4]! }));

const LINKS = [
  { label: "Email", href: "mailto:titi.uxui@gmail.com" },
  { label: "Instagram", href: "https://instagram.com/titi-uxi" },
  { label: "Telegram", href: "https://t.me/titi_uxui" },
  { label: "GitHub", href: "https://github.com/TITI_UXI" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function GalleryPage() {
  const [active, setActive] = useState<number | null>(null);
  const [about, setAbout] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const project = active === null ? null : ENTRIES[active]!;

  // Vertical wheel → horizontal momentum on the strip
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let target = el.scrollLeft;
    let raf = 0;
    const tick = () => {
      el.scrollLeft += (target - el.scrollLeft) * 0.12;
      if (Math.abs(target - el.scrollLeft) > 0.5) raf = requestAnimationFrame(tick);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, target + e.deltaY + e.deltaX));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    let dragX: number | null = null;
    const down = (e: PointerEvent) => { dragX = e.clientX; target = el.scrollLeft; };
    const move = (e: PointerEvent) => {
      if (dragX === null) return;
      target = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, target - (e.clientX - dragX)));
      dragX = e.clientX;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const up = () => { dragX = null; };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setActive(null), setAbout(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main
      className="relative h-screen w-full overflow-hidden text-hero-foreground transition-colors duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ backgroundColor: project?.color ?? BASE }}
    >
      {/* Corner chrome */}
      <p className="fixed left-6 top-8 z-30 text-xl font-black uppercase tracking-tight md:left-10">Tina</p>
      <button
        type="button"
        onClick={() => (project ? setActive(null) : setAbout((a) => !a))}
        className="fixed right-28 top-12 z-30 text-[10px] uppercase tracking-widest text-surface-soft transition-colors hover:text-hero-foreground md:right-36 md:top-14"
      >
        {project || about ? "Close" : "About"}
      </button>
      <p className="fixed bottom-8 left-6 z-30 max-w-[220px] text-[10px] uppercase leading-relaxed tracking-widest text-surface-muted md:left-10">
        Independent developer & creative — based in Rasht
      </p>
      <ul className="fixed bottom-8 right-6 z-30 flex flex-col items-end gap-1 md:right-10">
        {LINKS.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-widest text-surface-soft transition-colors hover:text-hero-foreground">
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Filmstrip */}
      <motion.div
        animate={{ opacity: project || about ? 0 : 1, scale: project ? 0.96 : 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className={`absolute inset-0 flex items-center ${project || about ? "pointer-events-none" : ""}`}
      >
        <div ref={stripRef} className="w-full cursor-grab select-none overflow-x-hidden active:cursor-grabbing">
          <div className="mx-auto flex w-max items-center gap-1.5 px-[20vw]">
            {ENTRIES.map((e, i) => (
              <button
                key={e.index}
                type="button"
                aria-label={`Open ${e.title}`}
                onClick={() => setActive(i)}
                className="group relative h-[48vh] w-[45px] shrink-0 cursor-pointer overflow-hidden rounded-none transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:w-[140px] md:h-[55vh] md:w-[65px] md:hover:w-[180px]"
              >
                <img
                  src={e.src}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  width={768}
                  height={1152}
                  className="h-full w-full object-cover opacity-70 contrast-125 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                />
                <span className="absolute bottom-2 left-2 text-[10px] tracking-widest opacity-0 transition-opacity group-hover:opacity-100">{e.index}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* About overlay */}
      <AnimatePresence>
        {about && !project && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-0 z-20 flex items-center justify-center px-8"
          >
            <p className="max-w-2xl text-center font-serif text-3xl leading-snug md:text-5xl">
              A visual journal — photographs, reading notes and quiet studies collected between projects.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active project */}
      <AnimatePresence mode="wait">
        {project && (
          <motion.div key={project.index} className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto py-24">
            <motion.h2
              aria-hidden
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 0.18, y: 0 }}
              exit={{ opacity: 0, y: -80 }}
              transition={{ duration: 1, ease: EASE }}
              className="pointer-events-none fixed inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center text-[26vh] font-black uppercase leading-[0.8] tracking-tighter text-hero md:text-[38vh]"
              style={{ fontStretch: "condensed" }}
            >
              {project.title}
            </motion.h2>

            <motion.article
              initial={{ opacity: 0, y: 60, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="relative my-auto w-[90vw] max-w-3xl bg-paper p-8 text-hero shadow-2xl md:p-14"
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-hero px-5 py-2 text-[10px] uppercase tracking-widest text-hero-foreground transition-transform hover:scale-105"
              >
                ✕ Close / Projects
              </button>
              <div className="flex items-baseline justify-between text-[10px] uppercase tracking-widest text-surface-muted">
                <span>{project.index} / {String(ENTRIES.length).padStart(2, "0")}</span>
                <span>Rasht — 2026</span>
              </div>
              <p className="mt-8 font-serif text-lg italic">{project.kicker}</p>
              <h3 className="mt-2 font-serif text-4xl leading-tight md:text-6xl">{project.title}</h3>
              <div className="mt-10 overflow-hidden">
                <img src={project.src} alt={project.title} width={768} height={1152} className="max-h-[60vh] w-full object-cover" />
              </div>
              <div className="mt-8 grid gap-6 text-sm leading-relaxed md:grid-cols-2">
                <p>Shot on film between client projects — a study of light, texture and stillness.</p>
                <dl className="grid grid-cols-2 gap-2 text-[11px] uppercase tracking-widest">
                  <dt className="text-surface-muted">Medium</dt><dd>35mm film</dd>
                  <dt className="text-surface-muted">Series</dt><dd>{project.kicker}</dd>
                </dl>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
