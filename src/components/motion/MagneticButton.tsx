// @ts-nocheck -- untyped JS-style component; types not enforced here
"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Nudges its content toward the cursor within `strength`, springing back
 * on mouse leave. Renders an <a> when `href` is passed, otherwise a
 * <button>. Sizing/shape/color all come from `className`.
 */
export default function MagneticButton({ href, children, className = "", strength = 0.4, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 12, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 150, damping: 12, mass: 0.3 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Comp = href ? motion.a : motion.button;

  return (
    <Comp
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, willChange: "transform" }}
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}
