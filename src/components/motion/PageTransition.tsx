import { useEffect, useRef } from "react";
import gsap from "gsap";

type Runner = (midpoint: () => void) => Promise<void>;
let runner: Runner | null = null;
let busy = false;

/** Cover the screen with the curved curtain, run `midpoint`, then reveal. */
export async function playTransition(midpoint: () => void) {
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!runner || busy || reduced) {
    midpoint();
    return;
  }
  busy = true;
  try {
    await runner(midpoint);
  } finally {
    busy = false;
  }
}

export function PageTransition() {
  const curtain = useRef<HTMLDivElement>(null);
  const top = useRef<SVGPathElement>(null);
  const bottom = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = curtain.current;
    if (!el) return;
    gsap.set(el, { y: "120vh", autoAlpha: 0 });

    runner = (midpoint) =>
      new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: resolve });
        tl.set(el, { y: "120vh", autoAlpha: 1 })
          .set(top.current, { attr: { d: "M0 100 Q50 0 100 100 Z" } })
          .set(bottom.current, { attr: { d: "M0 0 L100 0 Q50 0 0 0 Z" } })
          .to(el, { y: 0, duration: 0.6, ease: "power3.inOut" })
          .to(top.current, { attr: { d: "M0 100 Q50 100 100 100 Z" }, duration: 0.6, ease: "power3.inOut" }, "<")
          .add(() => midpoint())
          .to(el, { y: "-120vh", duration: 0.7, ease: "power3.inOut" }, "+=0.08")
          .to(bottom.current, { attr: { d: "M0 0 L100 0 Q50 100 0 0 Z" }, duration: 0.7, ease: "power3.inOut" }, "<")
          .set(el, { autoAlpha: 0 });
      });

    return () => {
      runner = null;
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div
      ref={curtain}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-x-0 top-0 z-[1000] h-screen bg-inverse text-inverse"
    >
      <svg className="absolute bottom-full left-0 h-[18vh] w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={top} d="M0 100 Q50 0 100 100 Z" fill="currentColor" />
      </svg>
      <svg className="absolute left-0 top-full h-[18vh] w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={bottom} d="M0 0 L100 0 Q50 0 0 0 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
