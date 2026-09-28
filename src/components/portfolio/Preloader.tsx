import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const GREETINGS = ["Hello", "Bonjour", "Ciao", "Olà", "やあ", "Hallå", "Guten Tag", "سلام"];
const STEP_DURATION = 165;
export const PRELOADER_COMPLETE_EVENT = "tina:preloader-complete";

export function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const duration = GREETINGS.length * STEP_DURATION;
    const startedAt = performance.now();
    let frame = 0;
    let exitTimer = 0;
    let exitTween: gsap.core.Tween | undefined;

    const finish = () => {
      setProgress(100);
      setGreetingIndex(GREETINGS.length - 1);
      exitTimer = window.setTimeout(() => {
        document.body.style.overflow = previousOverflow;
        exitTween = gsap.to(overlay, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          onComplete: () => {
            setVisible(false);
            window.dispatchEvent(new CustomEvent(PRELOADER_COMPLETE_EVENT));
          },
        });
      }, 240);
    };

    const update = (now: number) => {
      const ratio = Math.min((now - startedAt) / duration, 1);
      setProgress(Math.round(ratio * 100));
      setGreetingIndex(Math.min(GREETINGS.length - 1, Math.floor(ratio * GREETINGS.length)));

      if (ratio < 1) {
        frame = requestAnimationFrame(update);
      } else {
        finish();
      }
    };

    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      exitTween?.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    gsap.fromTo(word, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.14, ease: "power2.out" });
  }, [greetingIndex]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-inverse text-inverse-foreground"
      role="status"
      aria-live="polite"
      aria-label={`Loading ${progress}%`}
    >
      <span ref={wordRef} className="text-3xl font-medium sm:text-5xl">
        {GREETINGS[greetingIndex]}
      </span>
      <span className="absolute bottom-8 right-6 font-mono text-xs tabular-nums text-inverse-muted sm:bottom-10 sm:right-10">
        {String(progress).padStart(3, "0")}%
      </span>

      <svg
        aria-hidden
        viewBox="0 0 100 150"
        preserveAspectRatio="none"
        className="absolute left-0 top-full h-[18vh] w-full text-inverse"
      >
        <path d="M0 0 L100 0 L100 100 Q50 150 0 100 Z" fill="currentColor" />
      </svg>
    </div>
  );
}