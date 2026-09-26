"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

function wrap(min, max, v) {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

/**
 * One infinite-scrolling row. `baseVelocity` sets the idle drift speed and
 * default direction (negative = leftward). Actual scroll velocity is
 * layered on top: fast scrolling multiplies the speed, and its direction
 * (up vs down) flips which way the row runs.
 */
function MarqueeRow({ text, baseVelocity = 3, className = "" }) {
  const baseX = useMotionValue(0);
  const directionRef = useRef(baseVelocity < 0 ? -1 : 1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 40, stiffness: 300 });
  // Raw px/s scroll velocity -> a signed speed multiplier, clamped so it can't fly off
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-6, 0, 6], {
    clamp: true,
  });

  useAnimationFrame((t, delta) => {
    const factor = velocityFactor.get();

    if (factor < -0.1) directionRef.current = -1;
    else if (factor > 0.1) directionRef.current = 1;
    // near-zero factor: keep whatever direction it was already drifting in

    const speedMultiplier = Math.max(1, Math.abs(factor)); // never slower than idle drift
    const moveBy = directionRef.current * Math.abs(baseVelocity) * speedMultiplier * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div style={{ x, willChange: "transform" }} className="flex flex-none">
        <span className="pr-8">{text}</span>
        <span className="pr-8">{text}</span>
      </motion.div>
    </div>
  );
}

/**
 * Two stacked rows drifting in opposite directions at idle, both reacting
 * together to scroll speed/direction.
 */
export default function ScrollVelocityMarquee({
  text = "LET'S BUILD SOMETHING EXTRAORDINARY — ",
  className = "",
}) {
  return (
    <div className={`select-none py-6 ${className}`}>
      <MarqueeRow
        text={text}
        baseVelocity={3}
        className="text-[10vw] font-semibold leading-none md:text-[6vw]"
      />
      <MarqueeRow
        text={text}
        baseVelocity={-3}
        className="mt-2 text-[10vw] font-semibold leading-none text-white/40 md:mt-4 md:text-[6vw]"
      />
    </div>
  );
}
