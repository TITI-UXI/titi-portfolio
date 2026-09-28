import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "@/components/motion/Magnetic";
import { VelocityMarquee } from "./VelocityMarquee";

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tehran",
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return <span>{time ? `${time} IRST` : "\u00a0"}</span>;
}

export function Footer() {
  const curveRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const curve = curveRef.current;
    const footer = footerRef.current;
    if (!curve || !footer) return;
    const tween = gsap.fromTo(
      curve,
      { height: "12vw" },
      {
        height: 0,
        ease: "none",
        scrollTrigger: { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative overflow-hidden bg-inverse text-inverse-foreground"
    >
      {/* Curved lip of the light page that flattens as you reach the bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div
          ref={curveRef}
          className="relative -left-[10%] w-[120%] rounded-b-[50%] bg-canvas shadow-[0_40px_60px_-20px_oklch(0_0_0/35%)]"
        />
      </div>

      <div className="pt-[14vw]">
        <VelocityMarquee text="Available for freelance & collaborations — Iman Amanin — " />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 shrink-0 rounded-full bg-inverse-border sm:h-20 sm:w-20" />
          <h2 className="display-lg">
            Let's work
            <br />
            together
          </h2>
        </div>

        <div className="relative mt-16 border-t border-inverse-border">
          <div className="absolute right-4 top-0 -translate-y-1/2 sm:right-16">
            <Magnetic strength={0.5}>
              <a
                href="mailto:hello@imanamanin.com"
                className="flex h-36 w-36 items-center justify-center rounded-full bg-primary text-center text-base font-medium text-primary-foreground ring-1 ring-inverse-border transition-transform hover:scale-105 sm:h-52 sm:w-52 sm:text-lg"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="mt-28 flex flex-wrap gap-3 sm:mt-32">
          {["hello@imanamanin.com", "+98 000 000 0000"].map((c) => (
            <Magnetic key={c}>
              <a
                href={c.includes("@") ? `mailto:${c}` : `tel:${c.replace(/\s/g, "")}`}
                className="block rounded-full border border-inverse-border px-6 py-4 text-sm font-medium transition-colors hover:bg-inverse-border"
              >
                {c}
              </a>
            </Magnetic>
          ))}
        </div>

        <div className="mt-24 grid gap-8 text-sm sm:grid-cols-3 sm:items-end">
          <div>
            <p className="eyebrow mb-2 text-inverse-muted">Version</p>
            <p>2026 © Iman Amanin</p>
          </div>
          <div>
            <p className="eyebrow mb-2 text-inverse-muted">Local time</p>
            <p>
              <LocalTime /> — Rasht, Iran
            </p>
          </div>
          <div className="sm:text-right">
            <p className="eyebrow mb-2 text-inverse-muted">Socials</p>
            <div className="flex gap-5 sm:justify-end">
              {["Instagram", "Dribbble", "GitHub", "LinkedIn"].map((s) => (
                <Magnetic key={s}>
                  <a href="#contact" className="block transition-opacity hover:opacity-70">
                    {s}
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
