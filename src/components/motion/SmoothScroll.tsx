import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playTransition } from "./PageTransition";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const jumpTo = (hash: string) => {
      const el = hash && hash !== "#" ? document.querySelector(hash) : null;
      if (el) lenis.scrollTo(el as HTMLElement, { immediate: true, force: true });
      else lenis.scrollTo(0, { immediate: true, force: true });
      ScrollTrigger.refresh();
    };

    // In-page navigation links play the curved curtain, then jump behind it
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const hash = a.hash;
      const el = hash && document.querySelector(hash);
      if (el && a.pathname === window.location.pathname) {
        e.preventDefault();
        void playTransition(() => {
          if (window.location.hash !== hash) window.history.pushState(window.history.state, "", hash);
          jumpTo(hash);
        });
      }
    };
    // Browser back/forward between sections
    const onPop = () => {
      const hash = window.location.hash;
      void playTransition(() => jumpTo(hash));
    };
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
