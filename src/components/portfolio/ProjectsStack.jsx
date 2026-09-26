"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Desktop (>=768px): each card is `position: sticky; top: 0`, stacked with
 * rising z-index. As the next card's sticky range begins covering the one
 * beneath it, GSAP scrubs that lower card's scale down to 0.95 and fades in
 * a dark overlay — giving the impression of the stack receding in depth.
 *
 * Mobile (<768px): pinning/sticky is skipped entirely (gsap.matchMedia),
 * and the cards fall back to a plain vertical stack via normal flow.
 *
 * projects: Array<{ id, title, category, image, href, cta? }>
 */
export default function ProjectsStack({ projects }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const cards = cardRefs.current.filter(Boolean);

        cards.forEach((card, i) => {
          if (i === cards.length - 1) return; // the last card never needs to recede

          const overlay = card.querySelector("[data-overlay]");
          const scrollTrigger = {
            trigger: card,
            start: "top top",
            end: "bottom top",
            scrub: true,
          };

          gsap.to(card, { scale: 0.95, ease: "none", scrollTrigger });
          gsap.to(overlay, { opacity: 0.55, ease: "none", scrollTrigger });
        });
      }, containerRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [projects.length]);

  return (
    <section ref={containerRef} className="relative">
      {projects.map((project, i) => (
        <div
          key={project.id ?? i}
          ref={(el) => (cardRefs.current[i] = el)}
          className="flex items-center justify-center py-6
                     md:sticky md:top-0 md:h-screen md:py-0"
          style={{ zIndex: i + 1, willChange: "transform" }}
        >
          <div className="relative">
            <ProjectCard project={project} />
            {/* Dims the card beneath as the next one slides over it (desktop only) */}
            <div
              data-overlay
              className="pointer-events-none absolute inset-0 rounded-2xl bg-black opacity-0"
              style={{ willChange: "opacity" }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
