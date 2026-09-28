import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  animate,
  type MotionValue,
} from "framer-motion";

const STATEMENT =
  "I'm Iman Amanin — a developer who treats code like a craft. I build fast, precise interfaces for studios and founders who care about the last 5%: the easing curve, the kerning, the detail nobody names but everybody feels.";

const metrics = [
  { value: 5, suffix: "+", label: "Years of Multidisciplinary Craft" },
  { value: 20, suffix: "+", label: "Digital & Fintech Projects Launched" },
  { value: 99, suffix: "%", label: "Performance & Frame-rate Integrity" },
];

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const t = useTransform(progress, range, [0, 1]);
  const opacity = useTransform(t, [0, 1], [0.3, 1]);
  const y = useTransform(t, [0, 1], [12, 0]);
  const filter = useTransform(t, (v) => `blur(${(1 - v) * 4}px)`);

  return (
    <motion.span
      style={{ opacity, y, filter }}
      className="inline-block will-change-[filter,transform]"
    >
      {children}
    </motion.span>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [display, setDisplay] = useState(0);

  const safeValue = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, safeValue, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, safeValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {String(display).padStart(2, "0")}
      {suffix}
    </span>
  );
}

export function About() {
  const statementRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ["start 0.85", "start 0.3"],
  });

  const words = STATEMENT.split(" ");

  return (
    <section
      id="about"
      className="bg-inverse px-4 py-28 text-inverse-foreground sm:px-6"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-10 text-inverse-muted">About</p>

        <p
          ref={statementRef}
          className="max-w-4xl text-2xl font-medium leading-snug tracking-tight sm:text-4xl"
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`}>
              <Word
                progress={scrollYProgress}
                range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}
              >
                {word}
              </Word>{" "}
            </span>
          ))}
        </p>

        <dl className="mt-20 grid grid-cols-1 gap-px border-t border-inverse-border sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="border-b border-inverse-border py-8 sm:pr-8"
            >
              <dt className="eyebrow text-inverse-muted">{metric.label}</dt>
              <dd className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                <Counter value={metric.value} suffix={metric.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
