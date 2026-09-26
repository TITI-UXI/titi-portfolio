"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hero with a scroll-driven "portal" entrance:
 * the section pins briefly while a circular clip-path mask expands
 * from a small dot to full-bleed, revealing the portrait behind it.
 * The headline fades in once the mask is roughly half open.
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const maskRef = useRef(null);
  const portraitRef = useRef(null);
  const headlineRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%", // how long the section stays pinned while the mask expands
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        maskRef.current,
        { clipPath: "circle(4% at 50% 50%)" },
        { clipPath: "circle(75% at 50% 50%)", ease: "power2.inOut" },
        0
      )
        .fromTo(
          portraitRef.current,
          { scale: 1.15, opacity: 0.5 },
          { scale: 1, opacity: 1, ease: "power2.out" },
          0
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: "power2.out" },
          0.35 // starts partway through the mask expansion, not at scroll start
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center
                 overflow-hidden bg-black"
    >
      {/* Static backdrop visible outside the mask */}
      <div className="absolute inset-0 bg-black" />

      {/* Circular portal that reveals the portrait as the mask expands */}
      <div
        ref={maskRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ clipPath: "circle(4% at 50% 50%)" }}
      >
        <img
          ref={portraitRef}
          src="/portrait.jpg"
          alt="Portrait of Iman Amanin"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Headline, sits above the mask and fades in as it opens */}
      <h1
        ref={headlineRef}
        className="relative z-10 select-none text-center text-[clamp(2.5rem,9vw,7rem)]
                   font-semibold tracking-tight text-white opacity-0
                   mix-blend-difference"
      >
        IMAN AMANIN
      </h1>
    </section>
  );
}
