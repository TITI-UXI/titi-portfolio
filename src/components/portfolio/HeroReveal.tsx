import { useEffect, useRef, type RefObject } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

const REST = 40;
const DWELL_MS = 900;
const EASE = [0.16, 1, 0.3, 1] as const;

const DISCIPLINES = [
  "01 / Frontend Engineering & Creative Development",
  "02 / Bespoke Brand Identity & Graphic Craft",
  "03 / Editorial Portraiture & Art Direction",
];

export function HeroReveal({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const x = useSpring(mx, { stiffness: 220, damping: 30, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 30, mass: 0.6 });
  const size = useMotionValue(0);
  const edge = useMotionValue(2);
  const mask = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, #000 ${size}px, transparent ${edge}px)`;
  const anim = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    const unsub = size.on("change", (v) => edge.set(v + 2));
    const host = containerRef.current;
    if (!host || !window.matchMedia("(pointer: fine)").matches) return unsub;

    let timer = 0;
    let expanded = false;
    let last = { x: 0, y: 0 };
    const to = (target: number, duration: number) => {
      anim.current?.stop();
      anim.current = animate(size, target, { duration, ease: EASE });
    };
    const big = () => (window.innerWidth >= 1024 ? 440 : 320);

    const move = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const dist = Math.hypot(px - last.x, py - last.y);
      last = { x: px, y: py };
      mx.set(px);
      my.set(py);
      if (size.get() === 0) to(REST, 0.4);
      if (expanded && dist > 8) {
        expanded = false;
        to(REST, 0.7);
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        expanded = true;
        to(big(), 1.2);
      }, DWELL_MS);
    };
    const leave = () => {
      window.clearTimeout(timer);
      expanded = false;
      to(0, 0.6);
    };
    host.addEventListener("mousemove", move);
    host.addEventListener("mouseleave", leave);
    return () => {
      unsub();
      window.clearTimeout(timer);
      anim.current?.stop();
      host.removeEventListener("mousemove", move);
      host.removeEventListener("mouseleave", leave);
    };
  }, [containerRef, mx, my, size, edge]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] flex items-center bg-hero text-hero-foreground"
      style={{ maskImage: mask, WebkitMaskImage: mask, willChange: "mask-image, transform" }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative mx-auto w-full max-w-5xl px-8 md:px-16">
        <h2 className="text-4xl font-bold uppercase tracking-tight text-hero-foreground/90 md:text-6xl">
          Crafting digital experiences
        </h2>
        <ul className="mt-8 space-y-3 border-t border-hero-foreground/15 pt-6">
          {DISCIPLINES.map((d) => (
            <li key={d} className="text-xs uppercase tracking-[0.14em] text-hero-foreground/75 md:text-sm">
              {d}
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-surface-soft md:text-base">
          Translating brand visions into precise, tactile digital realities through high-performance code, motion
          physics, and meticulous aesthetic standards.
        </p>
      </div>
    </motion.div>
  );
}
