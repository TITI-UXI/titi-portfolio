"use client";

/**
 * project: { id, title, category, image, href, cta? }
 * cta defaults to "Visit Site" — pass cta="Case Study" for case-study links.
 */
export default function ProjectCard({ project }) {
  const { title, category, image, href, cta = "Visit Site" } = project;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative block h-[70vh] w-[90vw] max-w-5xl overflow-hidden rounded-2xl
                 max-md:h-[55vh] max-md:w-full"
    >
      <img
        src={image}
        alt={title}
        className="h-full w-full scale-100 object-cover transition-transform duration-700
                   ease-out will-change-transform group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-white/60">{category}</p>
          <h3 className="mt-1 text-2xl font-semibold text-white md:text-3xl">{title}</h3>
        </div>

        {/* Floating pill: hidden until hover, slides up and fades in */}
        <span
          className="translate-y-3 whitespace-nowrap rounded-full border border-white/30
                     bg-white/10 px-4 py-2 text-sm font-medium text-white opacity-0
                     backdrop-blur-md transition-all duration-300 ease-out will-change-transform
                     group-hover:translate-y-0 group-hover:opacity-100"
        >
          {cta}
        </span>
      </div>
    </a>
  );
}
