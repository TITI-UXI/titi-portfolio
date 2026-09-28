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

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Row({ text, baseVelocity }: { text: string; baseVelocity: number }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const xPct = useTransform(x, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    x.set(x.get() + move);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div style={{ x: xPct }} className="flex w-max">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="pr-[0.4em] text-[clamp(3rem,9vw,8rem)] font-medium uppercase leading-[1.05] tracking-[-0.04em]"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityMarquee({ text }: { text: string }) {
  return (
    <div aria-label={text} className="select-none py-6">
      <div aria-hidden>
        <Row text={text} baseVelocity={-3} />
        <Row text={text} baseVelocity={3} />
      </div>
    </div>
  );
}
