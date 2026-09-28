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

export const NAVIGATION_READY_EVENT = "tina:navigation-ready";

const APP_ROUTES = ["/", "/work", "/about", "/contact"] as const;
const INITIAL_CURVE = "M0 0 L1 0 L1 1 Q0.5 1.2 0 1 Z";
const EXIT_CURVE = "M0 0 L1 0 L1 1 Q0.5 1 0 1 Z";
const HOLD_MS = 300;
const WIPE_MS = 800;
const WIPE_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

type AppRoute = (typeof APP_ROUTES)[number];
type NavigationAction = () => void | Promise<void>;
type TransitionRunner = (label: string, navigate: NavigationAction) => Promise<boolean>;

let transitionRunner: TransitionRunner | null = null;
let transitionBusy = false;

function isAppRoute(pathname: string): pathname is AppRoute {
  return APP_ROUTES.some((route) => route === pathname);
}

function labelFor(pathname: string, hash = "") {
  if (pathname === "/work" || hash === "#work") return "Work";
  if (pathname === "/about" || hash === "#about") return "About";
  if (pathname === "/contact" || hash === "#contact") return "Contact";
  if (hash === "#services") return "Services";
  return "Home";
}

function notifyNavigationReady(hash: string) {
  window.dispatchEvent(new CustomEvent(NAVIGATION_READY_EVENT, { detail: { hash } }));
}

function afterPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
  });
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

async function playCurvedTransition(label: string, navigate: NavigationAction) {
  if (!transitionRunner) {
    await navigate();
    return true;
  }
  if (transitionBusy) return false;

  transitionBusy = true;
  try {
    return await transitionRunner(label, navigate);
  } finally {
    transitionBusy = false;
  }
}

export function useCurvedNavigation() {
  const navigate = useNavigate();

  return useCallback(
    async (href: string, label?: string) => {
      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin || !isAppRoute(destination.pathname)) {
        window.location.assign(destination.href);
        return false;
      }

      const current = `${window.location.pathname}${window.location.hash}`;
      const target = `${destination.pathname}${destination.hash}`;
      if (current === target) return false;

      return playCurvedTransition(label ?? labelFor(destination.pathname, destination.hash), async () => {
        if (destination.pathname === window.location.pathname) {
          window.history.pushState(window.history.state, "", target);
        } else if (destination.hash) {
          await navigate({ to: destination.pathname, hash: destination.hash.slice(1) });
        } else {
          await navigate({ to: destination.pathname });
        }
        notifyNavigationReady(destination.hash);
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
  const curvedNavigate = useCurvedNavigation();

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
    void curvedNavigate(href, label);
  };

  return (
    <a href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function CurvedTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const curveRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const label = labelRef.current;
    const curve = curveRef.current;
    if (!overlay || !label || !curve) return;

    gsap.set(overlay, { yPercent: 100, visibility: "hidden" });
    gsap.set(label, { y: 0, autoAlpha: 1 });

    transitionRunner = async (nextLabel, navigate) => {
      gsap.killTweensOf([overlay, label, curve]);
      label.textContent = `• ${nextLabel}`;
      gsap.set(curve, { attr: { d: INITIAL_CURVE } });
      gsap.set(label, { y: 0, autoAlpha: 1 });
      gsap.set(overlay, { yPercent: 0, visibility: "visible" });

      // Let the fully covered state paint before the router swaps the page beneath it.
      await afterPaint();
      await navigate();
      await wait(HOLD_MS);

      const overlayAnimation = overlay.animate(
        [{ transform: "translateY(0%)" }, { transform: "translateY(-100%)" }],
        { duration: WIPE_MS, easing: WIPE_EASE, fill: "forwards" },
      );
      const labelAnimation = label.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-32px)" },
        ],
        { duration: WIPE_MS * 0.7, easing: WIPE_EASE, fill: "forwards" },
      );
      const curveTween = gsap.to(curve, {
        attr: { d: EXIT_CURVE },
        duration: WIPE_MS / 1000,
        ease: "power4.inOut",
      });

      await Promise.all([
        overlayAnimation.finished.catch(() => undefined),
        labelAnimation.finished.catch(() => undefined),
      ]);
      curveTween.kill();
      overlayAnimation.cancel();
      labelAnimation.cancel();
      gsap.set(overlay, { yPercent: 100, visibility: "hidden" });
      gsap.set(label, { y: 0, autoAlpha: 1 });
      gsap.set(curve, { attr: { d: INITIAL_CURVE } });
      return true;
    };

    const onPopState = () => {
      const hash = window.location.hash;
      void playCurvedTransition(labelFor(window.location.pathname, hash), () => {
        notifyNavigationReady(hash);
      });
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
      transitionRunner = null;
      transitionBusy = false;
      gsap.killTweensOf([overlay, label, curve]);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      id="curved-page-transition"
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[99999] h-[calc(100vh+200px)] w-full invisible"
    >
      <div className="relative h-[100vh] w-full bg-transition-canvas text-transition-foreground">
        <p
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold sm:text-3xl"
        />
      </div>
      <svg
        className="block h-[200px] w-full text-transition-canvas"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        <path ref={curveRef} d={INITIAL_CURVE} fill="currentColor" />
      </svg>
    </div>
  );
}