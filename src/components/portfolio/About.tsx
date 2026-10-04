import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  animate,
} from "framer-motion";

const STATEMENT =
  "I'm TINA — a developer who treats code like a craft. I build fast, precise interfaces for studios and founders who care about the last 5%: the easing curve, the kerning, the detail nobody names but everybody feels.";

const metrics = [
  { value: 5, suffix: "+", label: "Years of Multidisciplinary Craft" },
  { value: 20, suffix: "+", label: "Digital & Fintech Projects Launched" },
  { value: 99, suffix: "%", label: "Performance & Frame-rate Integrity" },
];

function Word({ children, index }: { children: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, filter: "blur(12px)", y: 24 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9], delay: index * 0.035 }}
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

  const words = STATEMENT.split(" ");

  return (
    <section
      id="about"
      className="bg-surface px-4 py-28 text-inverse-foreground sm:px-6"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-10 text-inverse-muted">About</p>

        <p
          className="max-w-4xl text-2xl font-medium leading-snug tracking-tight sm:text-4xl"
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`}>
              <Word index={i}>{word}</Word>{" "}
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
