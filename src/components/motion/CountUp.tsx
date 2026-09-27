// @ts-nocheck -- untyped JS-style component; types not enforced here
"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Animates from 0 up to `value` the first time it scrolls into view.
 * Renders as `${prefix}${roundedNumber}${suffix}`, e.g. CountUp with
 * value={50} prefix="+" suffix=" Projects" -> "+50 Projects".
 */
export default function CountUp({
  value,
  duration = 1.6, // seconds
  prefix = "",
  suffix = "",
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(0);

  // Stiffness/damping tuned so ~1.5s spring settles without overshoot bounce
  const spring = useSpring(motionValue, {
    stiffness: 55 / duration,
    damping: 18,
    mass: 0.6,
  });

  const display = useTransform(spring, (latest) => `${prefix}${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  return (
    <motion.span ref={ref} className={className} style={{ willChange: "transform" }}>
      {display}
    </motion.span>
  );
}
