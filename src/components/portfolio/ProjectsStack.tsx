// @ts-nocheck -- untyped JS-style component; types not enforced here
"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";

// هوک ایمن برای جلوگیری از کرش‌های SSR
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// دیتای پیش‌فرض ایمن در صورت ارسال نشدن پروپ
const defaultProjects = [
  {
    id: 1,
    title: "Fintech Platform Ecosystem",
    category: "Web Application & Architecture",
    year: "2026",
    description: "Multi-venture financial platform with role-based dashboards and dynamic analytics.",
    href: "#",
  },
  {
    id: 2,
    title: "Sina Wings 3D WebGL",
    category: "Creative Dev & Shaders",
    year: "2026",
    description: "Interactive 3D audio-visual web application built with Three.js and custom GLSL.",
    href: "#",
  },
  {
    id: 3,
    title: "Editorial Archive & Reader",
    category: "Typography & UI Motion",
    year: "2026",
    description: "Minimalist reading experience inspired by Stripe Press with smooth transitions.",
    href: "#",
  },
];

export default function ProjectsStack({ projects = defaultProjects }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  // تضمین آرایه بودن پروژه‌ها
  const safeProjects = Array.isArray(projects) && projects.length > 0 ? projects : defaultProjects;

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const cards = cardRefs.current.filter(Boolean);

        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;

          const overlay = card.querySelector("[data-overlay]");
          const scrollTrigger = {
            trigger: card,
            start: "top top",
            end: "bottom top",
            scrub: true,
          };

          gsap.to(card, { scale: 0.95, ease: "none", scrollTrigger });
          if (overlay) {
            gsap.to(overlay, { opacity: 0.55, ease: "none", scrollTrigger });
          }
        });
      }, containerRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [safeProjects.length]);

  return (
    <section ref={containerRef} className="relative w-full">
      {safeProjects.map((project, i) => (
        <div
          key={project.id ?? i}
          ref={(el) => (cardRefs.current[i] = el)}
          className="flex items-center justify-center py-6
                     md:sticky md:top-0 md:h-screen md:py-0"
          style={{ zIndex: i + 1, willChange: "transform" }}
        >
          <div className="relative w-full max-w-5xl px-4">
            {/* رندر ایمن کارت */}
            {ProjectCard ? (
              <ProjectCard project={project} />
            ) : (
              <div className="p-8 border border-white/10 rounded-2xl bg-zinc-900/80 backdrop-blur-md">
                <span className="text-xs uppercase tracking-widest text-zinc-400">{project.category}</span>
                <h3 className="text-3xl font-bold mt-2">{project.title}</h3>
                <p className="text-zinc-400 mt-2">{project.description}</p>
              </div>
            )}

            {/* لایه تیره در اسکرول دسکتاپ */}
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
