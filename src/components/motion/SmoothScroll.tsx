import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAVIGATION_READY_EVENT } from "@/components/portfolio/CurvedTransition";

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

    const onNavigationReady = (event: Event) => {
      const navigationEvent = event as CustomEvent<{ hash?: string }>;
      window.requestAnimationFrame(() => jumpTo(navigationEvent.detail?.hash ?? window.location.hash));
    };
    window.addEventListener(NAVIGATION_READY_EVENT, onNavigationReady);

    return () => {
      window.removeEventListener(NAVIGATION_READY_EVENT, onNavigationReady);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
