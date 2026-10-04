import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  animate,
  type Variants,
} from "framer-motion";

const STATEMENT =
  "I'm TINA — a developer who treats code like a craft. I build fast, precise interfaces for studios and founders who care about the last 5%: the easing curve, the kerning, the detail nobody names but everybody feels.";

const metrics = [
  { value: 5, suffix: "+", label: "Years of Multidisciplinary Craft" },
  { value: 20, suffix: "+", label: "Digital & Fintech Projects Launched" },
  { value: 99, suffix: "%", label: "Performance & Frame-rate Integrity" },
];

/* React Bits "Blur Text" — word-by-word blur reveal.
 * Container staggers children 0.035s apart; each word rises 16px
 * out of a 10px blur over 0.45s once the paragraph is 35% in view. */
const BLUR_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.035 },
  },
};

const BLUR_WORD: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 16,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
};

function BlurText({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <motion.p
      variants={BLUR_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      className="max-w-4xl text-2xl font-medium leading-snug tracking-tight sm:text-4xl"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={BLUR_WORD}
          className="inline-block will-change-[filter,opacity,transform]"
        >
          {word}
          {"\u00A0"}
        </motion.span>
      ))}
    </motion.p>
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
  return (
    <section
      id="about"
      className="bg-surface px-4 py-28 text-inverse-foreground sm:px-6"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-10 text-inverse-muted">About</p>

        <BlurText text={STATEMENT} />

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
