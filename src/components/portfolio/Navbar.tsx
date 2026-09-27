// @ts-nocheck -- untyped JS-style component; types not enforced here
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * Wraps a link and nudges it toward the cursor on hover ("magnetic" effect).
 * Pull strength and spring feel are tuned via `strength` / spring config.
 */
function MagneticLink({ href, children, className = "", strength = 0.35 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY < 80) {
        // Always visible near the top of the page
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true); // scrolling down -> hide
      } else if (delta < -4) {
        setHidden(false); // scrolling up -> reveal
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={hidden ? { y: -96, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 top-6 z-50 -translate-x-1/2"
    >
      <nav
        className="flex items-center gap-1 rounded-full border border-white/10
                   bg-white/5 px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                   backdrop-blur-md"
      >
        {NAV_LINKS.map((link) => (
          <MagneticLink
            key={link.href}
            href={link.href}
            className="rounded-full px-4 py-2 text-sm font-medium text-white/80
                       transition-colors duration-200 hover:text-white"
          >
            {link.label}
          </MagneticLink>
        ))}

        <MagneticLink
          href="#contact"
          className="ml-1 rounded-full bg-white px-5 py-2 text-sm font-semibold
                     text-black transition-colors duration-200 hover:bg-white/90"
        >
          Let&apos;s talk
        </MagneticLink>
      </nav>
    </motion.header>
  );
}
