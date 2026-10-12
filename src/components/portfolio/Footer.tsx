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
      className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cta-accent text-center text-base font-medium text-hero-foreground shadow-2xl transition-transform duration-300 hover:scale-105 md:h-48 md:w-48"
    >
      <span
        ref={fillRef}
        aria-hidden
        className="pointer-events-none absolute h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-cta-slate"
      />
      <span className="relative">{children}</span>
    </TransitionLink>
  );
}

export function Footer({ lipClassName = "bg-canvas" }: { lipClassName?: string }) {
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
      className="relative flex min-h-[85vh] flex-col justify-between overflow-hidden bg-hero px-8 pb-12 pt-24 text-hero-foreground md:px-16"
    >
      {/* Curved lip of the light page that flattens as you reach the bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div
          ref={curveRef}
          className={`relative -left-[10%] w-[120%] rounded-b-[50%] ${lipClassName} shadow-[0_40px_60px_-20px_oklch(0_0_0/35%)]`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="pt-[14vw]">
          <VelocityMarquee text="Available for freelance & collaborations — TINA — " />
        </div>
        <div className="mt-12 flex items-center gap-6">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-lg md:h-24 md:w-24">
            <img
              src="/portrait.jpg"
              alt="Zahra Alizadeh"
              className="pointer-events-none h-full w-full select-none object-cover object-[center_20%]"
            />
          </div>
          <h2 className="text-5xl font-normal leading-[1.1] tracking-tight text-hero-foreground md:text-7xl lg:text-8xl">
            Let's work
            <br />
            together
          </h2>
          <span aria-hidden className="ml-auto shrink-0 text-3xl text-surface-soft">
            ↘
          </span>
        </div>
      </div>

      <div className="relative my-8 flex w-full items-center py-10 md:my-12 md:py-12">
        <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-inverse-border" />
        <div className="relative z-10 ml-auto mr-[15%] shrink-0 md:mr-[18%]">
          <Magnetic strength={0.45}>
            <FillButton href="/contact">Get in touch</FillButton>
          </Magnetic>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap gap-3">
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

        <div className="mt-14 grid gap-8 text-sm sm:grid-cols-3 sm:items-end">
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
