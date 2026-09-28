import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import portrait from "@/assets/portrait.jpg";

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
      (e) => e[0].isIntersecting && run(),
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
  const hint = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(stage.current, { clipPath: "circle(6% at 50% 50%)" });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=120%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          },
        })
        .to(stage.current, { clipPath: "circle(75% at 50% 50%)", ease: "power2.inOut" })
        .to(hint.current, { opacity: 0, y: -20, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-svh w-full overflow-hidden bg-canvas">
      <p
        ref={hint}
        className="eyebrow absolute inset-x-0 bottom-10 z-10 text-center text-ink-soft"
      >
        Scroll to enter
      </p>

      {/* Full reveal by default (no-JS fallback); GSAP sets the tight mask on mount */}
      <div
        ref={stage}
        className="absolute inset-0 bg-inverse text-inverse-foreground"
        style={{ willChange: "clip-path" }}
      >
        <img
          src={portrait}
          alt="Portrait of Iman Amanin"
          className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse via-inverse/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6">
          <p className="eyebrow mb-6 opacity-70">Rasht, Iran — Available Worldwide</p>
          <h1 className="display-xl uppercase">
            Iman
            <br />
            Amanin
          </h1>
          <ScrambledText
            text="Creative Developer & Multidisciplinary Designer"
            className="mt-6 block font-mono text-sm uppercase tracking-widest opacity-80 sm:text-base"
          />
        </div>
      </div>
    </section>
  );
}
