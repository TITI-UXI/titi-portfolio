import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

    const wrap = gsap.utils.wrap(-50, 0);
    let xPercent = 0;
    let direction = 1;
    let speed = 0.018;
    let velocityBoost = 0;
    let frame = 0;

    const tick = () => {
      velocityBoost *= 0.94;
      const targetSpeed = direction * (0.018 + velocityBoost);
      speed += (targetSpeed - speed) * 0.075;
      xPercent = wrap(xPercent - speed);
      gsap.set(el, { xPercent });
      frame = window.requestAnimationFrame(tick);
    };

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        direction = self.direction >= 0 ? 1 : -1;
        velocityBoost = Math.min(Math.abs(self.getVelocity()) / 12000, 0.22);
      },
    });

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      st.kill();
    };
  }, []);

  const half = (
    <span className="flex shrink-0">
      {[0, 1, 2].map((i) => <span key={i} className="pr-[0.25em]">{NAME}</span>)}
    </span>
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 w-full select-none overflow-hidden whitespace-nowrap md:bottom-6" aria-label="Zahra Alizadeh">
      <div ref={track} aria-hidden className="flex w-max whitespace-nowrap text-[15vw] font-medium md:text-[13vw] leading-none tracking-tighter text-hero-foreground will-change-transform">
        {half}
        {half}
      </div>
    </div>
  );
}

export function HeroMask() {
  return (
    <section className="relative h-screen max-h-[1080px] min-h-[680px] w-full overflow-hidden bg-hero text-hero-foreground">
      <p className="absolute left-8 top-8 z-30 text-sm tracking-wide text-hero-foreground/60 md:left-12">© Code by Tina</p>

      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 flex h-[72vh] max-h-[700px] w-auto max-w-[500px] -translate-x-1/2 select-none items-end justify-center">
        <img
          src="/portrait.jpg"
          alt="Portrait of Tina"
          className="h-full w-full object-contain object-bottom"
          style={{ maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)" }}
        />
      </div>

      <div className="absolute left-0 top-[42%] z-30 flex -translate-y-1/2 items-center gap-3 rounded-r-full border-y border-r border-hero-foreground/10 bg-hero-surface py-3 pl-8 pr-4 text-xs tracking-wider text-hero-foreground/85 shadow-xl md:pl-12">
        <span className="leading-tight">Located<br />in Iran</span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-hero-button text-hero-foreground">
          <Globe />
        </span>
      </div>

      <div className="absolute right-8 top-[42%] z-30 flex -translate-y-1/2 flex-col items-end text-right md:right-16">
        <span className="mb-1 text-2xl text-hero-foreground/60" aria-hidden>↘</span>
        <p className="text-base font-light leading-snug text-hero-foreground/85 md:text-lg">Freelance<br />Designer &amp; Developer</p>
      </div>

      <DirectionalSlider />
    </section>
  );
}
