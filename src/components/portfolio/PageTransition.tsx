import {
  useCallback,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import gsap from "gsap";

const NAVIGATION_READY_EVENT = "tina:navigation-ready";
const ROUTES = ["/", "/work", "/about", "/contact"] as const;

type AppRoute = (typeof ROUTES)[number];
type TransitionMidpoint = () => void | Promise<void>;
type TransitionRunner = (label: string, midpoint: TransitionMidpoint) => Promise<void>;

let runner: TransitionRunner | null = null;
let busy = false;

function routeLabel(pathname: string, hash = "") {
  if (pathname === "/work" || hash === "#work") return "Work";
  if (pathname === "/about" || hash === "#about") return "About";
  if (pathname === "/contact" || hash === "#contact") return "Contact";
  if (hash === "#services") return "Services";
  return "Home";
}

function isAppRoute(pathname: string): pathname is AppRoute {
  return ROUTES.some((route) => route === pathname);
}

function navigationReady(hash: string) {
  window.dispatchEvent(new CustomEvent(NAVIGATION_READY_EVENT, { detail: { hash } }));
}

function tween(target: gsap.TweenTarget, vars: gsap.TweenVars) {
  return new Promise<void>((resolve) => {
    gsap.to(target, { ...vars, onComplete: resolve });
  });
}

function wait(duration: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}

/** Plays the global curtain and updates the page only while it is fully covered. */
export async function playPageTransition(label: string, midpoint: TransitionMidpoint) {
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!runner || reduced) {
    await midpoint();
    return true;
  }
  if (busy) return false;

  busy = true;
  try {
    await runner(label, midpoint);
    return true;
  } finally {
    busy = false;
  }
}

export function usePageTransition() {
  const navigate = useNavigate();

  return useCallback(
    async (href: string, label?: string) => {
      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin || !isAppRoute(destination.pathname)) {
        window.location.assign(destination.href);
        return;
      }

      const current = `${window.location.pathname}${window.location.hash}`;
      const target = `${destination.pathname}${destination.hash}`;
      if (current === target) return;
      const route = destination.pathname;

      await playPageTransition(label ?? routeLabel(destination.pathname, destination.hash), async () => {
        if (destination.pathname === window.location.pathname) {
          window.history.pushState(window.history.state, "", target);
        } else if (destination.hash) {
          await navigate({ to: route, hash: destination.hash.slice(1) });
        } else {
          await navigate({ to: route });
        }
        navigationReady(destination.hash);
      });
    },
    [navigate],
  );
}

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  label?: string;
  children: ReactNode;
};

export function TransitionLink({ href, label, children, onClick, target, ...props }: TransitionLinkProps) {
  const transitionTo = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === "_blank"
    ) {
      return;
    }

    const destination = new URL(href, window.location.href);
    if (destination.origin !== window.location.origin || !isAppRoute(destination.pathname)) return;

    event.preventDefault();
    void transitionTo(href, label);
  };

  return (
    <a href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function PageTransition() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const leadingCurveRef = useRef<SVGPathElement>(null);
  const trailingCurveRef = useRef<SVGPathElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    const leadingCurve = leadingCurveRef.current;
    const trailingCurve = trailingCurveRef.current;
    const label = labelRef.current;
    if (!curtain || !leadingCurve || !trailingCurve || !label) return;

    gsap.set(curtain, { y: "120vh", autoAlpha: 0 });
    gsap.set(label, { y: 18, autoAlpha: 0 });

    runner = async (nextLabel, midpoint) => {
      label.textContent = `• ${nextLabel}`;
      gsap.set(curtain, { y: "120vh", autoAlpha: 1 });
      gsap.set(label, { y: 18, autoAlpha: 0 });
      gsap.set(leadingCurve, { attr: { d: "M0 100 Q50 0 100 100 Z" } });
      gsap.set(trailingCurve, { attr: { d: "M0 0 L100 0 L100 100 Q50 120 0 100 Z" } });

      await Promise.all([
        tween(curtain, { y: 0, duration: 0.6, ease: "power3.inOut" }),
        tween(leadingCurve, {
          attr: { d: "M0 100 Q50 100 100 100 Z" },
          duration: 0.6,
          ease: "power3.inOut",
        }),
      ]);
      await tween(label, { y: 0, autoAlpha: 1, duration: 0.24, ease: "power2.out" });
      await Promise.all([Promise.resolve(midpoint()), wait(550)]);
      await tween(label, { y: -20, autoAlpha: 0, duration: 0.24, ease: "power2.in" });
      await Promise.all([
        tween(curtain, { y: "-120vh", duration: 0.7, ease: "power3.inOut" }),
        tween(trailingCurve, {
          attr: { d: "M0 0 L100 0 L100 0 Q50 0 0 0 Z" },
          duration: 0.7,
          ease: "power3.inOut",
        }),
      ]);
      gsap.set(curtain, { autoAlpha: 0 });
    };

    const onPopState = () => {
      const hash = window.location.hash;
      void playPageTransition(routeLabel(window.location.pathname, hash), () => navigationReady(hash));
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
      runner = null;
      busy = false;
      gsap.killTweensOf([curtain, leadingCurve, trailingCurve, label]);
    };
  }, []);

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      id="page-transition"
      className="pointer-events-none invisible fixed inset-x-0 top-0 z-[9999] h-screen bg-inverse text-inverse-foreground"
    >
      <svg
        className="absolute bottom-full left-0 h-[18vh] w-full text-inverse"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path ref={leadingCurveRef} d="M0 100 Q50 0 100 100 Z" fill="currentColor" />
      </svg>
      <p
        ref={labelRef}
        className="absolute inset-0 flex items-center justify-center text-xl font-medium sm:text-2xl"
      />
      <svg
        className="absolute left-0 top-full h-[18vh] w-full text-inverse"
        viewBox="0 0 100 120"
        preserveAspectRatio="none"
      >
        <path
          ref={trailingCurveRef}
          d="M0 0 L100 0 L100 100 Q50 120 0 100 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export { NAVIGATION_READY_EVENT };