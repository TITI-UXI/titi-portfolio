import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ";

function ScrambledText({ text, className }: { text: string; className?: string }) {
  const [out, setOut] = useState(text); // SSR / no-JS fallback: final text
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const revealed = Math.floor(p * text.length);
        setOut(
          text
            .split("")
            .map((c, i) =>
              i < revealed || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (e) => e[0]?.isIntersecting && run(),
      { threshold: 0.6 },
    );
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

export function HeroMask() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = root.current;
    const hero = stage.current;
    if (!section || !hero) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(hero, { "--portal-radius": "0vw" });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1200",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(hero, { "--portal-radius": "150vw", ease: "none" });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-svh w-full overflow-hidden bg-inverse">
      <div
        ref={stage}
        className="portal-mask absolute inset-0 bg-inverse text-inverse-foreground"
      >
        <img
          src="/portrait.jpg"
          alt="Portrait of TINA"
          className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse via-inverse/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6">
          <p className="eyebrow mb-6 opacity-70">Rasht, Iran — Available Worldwide</p>
          <h1 className="display-xl uppercase">TINA</h1>
          <ScrambledText
            text="Creative Developer & Multidisciplinary Designer"
            className="mt-6 block font-mono text-sm uppercase tracking-widest opacity-80 sm:text-base"
          />
        </div>
      </div>
    </section>
  );
}
