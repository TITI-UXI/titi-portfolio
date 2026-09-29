import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "@/components/motion/Magnetic";
import { VelocityMarquee } from "./VelocityMarquee";
import { TransitionLink } from "./CurvedTransition";

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

function FillButton({ href, children }: { href: string; children: React.ReactNode }) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const place = (e: React.MouseEvent<HTMLAnchorElement>, scale: number) => {
    const fill = fillRef.current;
    if (!fill) return;
    const r = e.currentTarget.getBoundingClientRect();
    gsap.set(fill, { left: e.clientX - r.left, top: e.clientY - r.top });
    gsap.to(fill, { scale, duration: 0.6, ease: "power3.out", overwrite: true });
  };
  return (
    <TransitionLink
      href={href}
      onMouseEnter={(e) => place(e, 1)}
      onMouseLeave={(e) => place(e, 0)}
      className="relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-cta text-center text-lg font-medium text-inverse-foreground md:h-52 md:w-52"
    >
      <span
        ref={fillRef}
        aria-hidden
        className="pointer-events-none absolute h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-surface-soft"
      />
      <span className="relative">{children}</span>
    </TransitionLink>
  );
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
        <VelocityMarquee text="Available for freelance & collaborations — TINA — " />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-5 md:gap-8">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-lg md:h-24 md:w-24">
              <img
                src="/portrait.jpg"
                alt="Zahra Alizadeh"
                className="pointer-events-none h-full w-full select-none object-cover object-[center_20%]"
              />
            </div>
            <h2 className="text-5xl font-normal leading-[1] tracking-tight md:text-7xl lg:text-8xl">
              Let's work
              <br />
              together
            </h2>
          </div>
          <span aria-hidden className="mt-2 text-3xl text-surface-soft">↘</span>
        </div>

        <div className="relative mt-20 border-t border-inverse-border md:mt-28">
          <div className="absolute right-4 top-0 z-10 -translate-y-1/2 sm:right-16">
            <Magnetic strength={0.45}>
              <FillButton href="/contact">Get in touch</FillButton>
            </Magnetic>
          </div>
        </div>

        <div className="mt-32 flex flex-wrap gap-3 sm:mt-36">
          {[
            { label: "titi.uxui@gmail.com", href: "mailto:titi.uxui@gmail.com" },
            { label: "Telegram @titi-uxi", href: "https://t.me/titi_uxi" },
          ].map((pill) => (
            <Magnetic key={pill.label}>
              <a
                href={pill.href}
                className="block rounded-full border border-white/15 bg-transparent px-7 py-4 text-sm font-light text-inverse-foreground transition-colors hover:border-white/40 md:text-base"
              >
                {pill.label}
              </a>
            </Magnetic>
          ))}
        </div>

        <div className="mt-24 grid gap-8 text-sm sm:grid-cols-3 sm:items-end">
          <div>
            <p className="eyebrow mb-2 text-inverse-muted">Version</p>
            <p>2026 © TINA</p>
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
              {[
                { label: "Instagram", href: "https://instagram.com/titi-uxi" },
                { label: "Telegram", href: "https://t.me/titi_uxi" },
                { label: "WhatsApp", href: "https://wa.me/" },
                { label: "GitHub", href: "https://github.com/TITI_UXI" },
              ].map((social) => (
                <Magnetic key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block transition-opacity hover:opacity-70"
                  >
                    {social.label}
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
