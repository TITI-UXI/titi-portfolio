// @ts-nocheck
"use client";

import React from "react";

const portfolioProjects = [
  {
    id: 1,
    title: "Fintech Platform Ecosystem",
    category: "Web Application & Architecture",
    year: "2026",
    description: "Multi-venture financial hub featuring role-based dashboards and dynamic analytics.",
  },
  {
    id: 2,
    title: "Sina Wings 3D WebGL",
    category: "Creative Dev & Shaders",
    year: "2026",
    description: "Interactive 3D audio-visual portfolio built with Three.js, GSAP, and custom GLSL.",
  },
  {
    id: 3,
    title: "Editorial Archive & Reader",
    category: "Typography & UI Motion",
    year: "2026",
    description: "Minimalist reading platform inspired by Stripe Press with smooth layout transitions.",
  },
];

export default function ProjectsStack(props) {
  // حفاظت کامل: اگر هیچ آرایه‌ای نرسید، از دیتاهای پیش‌فرض بالا استفاده کن
  const list = (props && Array.isArray(props.projects) && props.projects.length > 0)
    ? props.projects
    : portfolioProjects;

  return (
    <section className="relative w-full py-24 px-6 md:px-12 bg-background text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-foreground/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Selected Works</span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-2">Projects Stack</h2>
          </div>
          <span className="text-sm text-muted-foreground mt-4 md:mt-0 font-mono">
            {list.length.toString().padStart(2, "0")} Archive Units
          </span>
        </div>

        <div className="flex flex-col gap-8">
          {list.map((project, i) => (
            <div
              key={project.id || i}
              className="group relative border border-foreground/10 rounded-2xl p-8 md:p-12 hover:border-foreground/30 transition-all duration-300 bg-background/50 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-muted-foreground">{project.year || "2026"}</span>
                  <h3 className="text-2xl md:text-3xl font-medium mt-1 group-hover:translate-x-1 transition-transform">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xl">{project.description}</p>
                </div>
                <div className="text-xs font-mono tracking-wider border border-foreground/15 rounded-full px-4 py-1.5 self-start md:self-center">
                  {project.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// برای پشتیبانی از هر دو نوع Import (Named یا Default)
export { ProjectsStack };
