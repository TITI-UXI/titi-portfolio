import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NAME = "Zahra Alizadeh — ";

function Globe() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 animate-[spin_8s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <path d="M2 12h20M4 7h16M4 17h16" />
    </svg>
  );
}

function DirectionalSlider() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Two identical halves: loop xPercent 0 → -50.
    const tween = gsap.fromTo(el, { xPercent: 0 }, { xPercent: -50, duration: 24, ease: "none", repeat: -1 });
    if (reduce) {
      tween.timeScale(0.3);
      return () => { tween.kill(); };
    }
    let direction = 1;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        direction = self.direction; // 1 = down → left, -1 = up → right
        const boost = Math.min(Math.abs(self.getVelocity()) / 300, 5);
        gsap.to(tween, {
          timeScale: direction * (1 + boost),
          duration: 0.2,
          overwrite: true,
          onComplete: () => { gsap.to(tween, { timeScale: direction, duration: 0.8, ease: "power2.out" }); },
        });
      },
    });
    return () => { st.kill(); tween.kill(); };
  }, []);

  const half = (
    <span className="flex shrink-0">
      {[0, 1, 2].map((i) => <span key={i} className="pr-[0.25em]">{NAME}</span>)}
    </span>
  );

  return (
    <div className="pointer-events-none relative z-20 overflow-hidden" aria-label="Zahra Alizadeh">
      <div ref={track} aria-hidden className="flex w-max whitespace-nowrap text-[15vw] font-medium leading-none tracking-tight text-hero-foreground md:text-[13vw]">
        {half}
        {half}
      </div>
    </div>
  );
}

export function HeroMask() {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-hero pb-12 pt-8 text-hero-foreground">
      <p className="relative z-20 px-8 text-sm font-medium md:px-16">© Code by Tina</p>

      <img
        src="/portrait.jpg"
        alt="Portrait of Tina"
        className="pointer-events-none absolute bottom-0 left-1/2 z-10 w-full max-w-[420px] -translate-x-1/2 select-none object-contain md:max-w-[480px]"
      />

      <div className="relative z-20 flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="flex w-fit items-center gap-3 rounded-r-full border border-hero-foreground/10 bg-hero-surface py-2.5 pl-8 pr-4 text-xs tracking-wide text-hero-foreground/75 md:pl-16">
          <span className="leading-tight">Located<br />in Iran</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-hero-button text-hero-foreground">
            <Globe />
          </span>
        </div>
        <div className="px-8 md:px-16">
          <span className="mb-2 block text-2xl text-hero-foreground/60" aria-hidden>↘</span>
          <p className="text-2xl font-medium leading-tight md:text-3xl">Freelance<br />Designer &amp; Developer</p>
        </div>
      </div>

      <DirectionalSlider />
    </section>
  );
}
