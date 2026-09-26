"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Sits at the top edge of `targetRef` (pass the footer's own ref). Renders
 * a wide, shallow curve that straightens out as the target scrolls up into
 * view, giving the impression the footer is being "pulled" taut into place.
 * `fill` should match the page's background color sitting above the footer.
 */
export default function CurvedReveal({ targetRef, fill = "currentColor", className = "" }) {
  const pathRef = useRef(null);

  useLayoutEffect(() => {
    if (!targetRef?.current) return;

    const ctx = gsap.context(() => {
      const curve = { y: 55 }; // starting control-point y: a gentle upward bow

      gsap.to(curve, {
        y: 100, // 100 == flat, matching the baseline endpoints
        ease: "none",
        scrollTrigger: {
          trigger: targetRef.current,
          start: "top bottom",
          end: "top 60%",
          scrub: true,
        },
        onUpdate: () => {
          pathRef.current?.setAttribute("d", `M0,100 Q250,${curve.y} 500,100 L500,100 L0,100 Z`);
        },
      });
    });

    return () => ctx.revert();
  }, [targetRef]);

  return (
    <svg
      viewBox="0 0 500 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 -top-px h-14 w-full md:h-20 ${className}`}
      style={{ color: fill, willChange: "transform" }}
    >
      <path ref={pathRef} d="M0,100 Q250,55 500,100 L500,100 L0,100 Z" fill="currentColor" />
    </svg>
  );
}
