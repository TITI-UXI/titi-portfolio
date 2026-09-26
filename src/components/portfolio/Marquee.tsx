import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TEXT = "Iman Amanin — Creative Developer & Designer — ";

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    gsap.registerPlugin(ScrollTrigger);

    // Track holds two identical halves; loop xPercent 0 → -50 forever.
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 28,
      ease: "none",
      repeat: -1,
    });

    let direction = 1;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        direction = self.direction;
        const boost = Math.min(Math.abs(self.getVelocity()) / 400, 4);
        gsap.to(tween, {
          timeScale: direction * (1 + boost),
          duration: 0.2,
          overwrite: true,
          onComplete: () => {
            gsap.to(tween, { timeScale: direction * 1, duration: 1, ease: "power2.out" });
          },
        });
      },
    });

    return () => {
      st.kill();
      tween.kill();
    };
  }, []);

  const half = (
    <span className="flex shrink-0 whitespace-nowrap">
      {[0, 1].map((i) => (
        <span key={i} className="pr-[0.3em]">
          {TEXT}
        </span>
      ))}
    </span>
  );

  return (
    <div className="overflow-hidden py-6" aria-label={TEXT}>
      <div
        ref={trackRef}
        className="flex w-max text-[clamp(4rem,14vw,13rem)] font-medium uppercase leading-none tracking-[-0.04em] text-foreground"
        aria-hidden
      >
        {half}
        {half}
      </div>
    </div>
  );
}
