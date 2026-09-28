import { useEffect, useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/portfolio/PageTransition";

const NAV_LINKS = [
  { id: "work", label: "Work", href: "/work" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
] as const;

type SectionId = (typeof NAV_LINKS)[number]["id"];

const CONTACT_EMAIL = "titi.uxui@gmail.com";

/** Scroll distance (px) below which the navbar is always shown. */
const TOP_THRESHOLD = 80;
/** Ignore tiny scroll deltas so the bar doesn't flicker on trackpad noise. */
const DELTA_THRESHOLD = 4;

const MAGNET_SPRING = { stiffness: 220, damping: 16, mass: 0.35 };

/**
 * Pulls its child toward the cursor with spring physics and snaps
 * back to rest when the pointer leaves.
 */
function MagneticItem({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAGNET_SPRING);
  const springY = useSpring(y, MAGNET_SPRING);

  const onMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

export function FloatingNavbar() {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const lastY = useRef(0);

  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  // Hide on scroll down, reveal on scroll up or near the top.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastY.current;
    lastY.current = latest;

    if (latest < TOP_THRESHOLD) {
      setVisible(true);
      return;
    }
    if (Math.abs(delta) < DELTA_THRESHOLD) return;
    setVisible(delta < 0);
  });

  // Track which section sits under the middle of the viewport so the
  // highlight pill can rest on it when nothing is hovered.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) {
            setActiveSection(id);
          } else {
            setActiveSection((current) => (current === id ? null : current));
          }
        }
      },
      // A thin band around the vertical centre of the viewport.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const highlighted = hovered ?? activeSection;

  const revealTransition = reduceMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.8 };

  const pillTransition = reduceMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.6 };

  return (
    <motion.nav
      aria-label="Primary"
      initial={false}
      animate={visible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={revealTransition}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "fixed inset-x-0 top-6 z-50 mx-auto flex w-fit items-center gap-1",
        "rounded-full border border-inverse-foreground/10 bg-inverse/70 text-inverse-foreground",
        "p-1.5 shadow-2xl backdrop-blur-md sm:pl-2",
      )}
    >
      {/* Brand mark — back to top */}
      <MagneticItem className="hidden sm:inline-block">
        <TransitionLink
          href="#top"
          label="Home"
          aria-label="TINA — back to top"
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold tracking-tight transition-colors hover:bg-inverse-foreground/10"
        >
          T
        </TransitionLink>
      </MagneticItem>

      <ul className="flex items-center">
        {NAV_LINKS.map((link) => {
          const isHighlighted = highlighted === link.id;
          return (
            <li key={link.id}>
              <MagneticItem>
                <TransitionLink
                  href={link.href}
                  label={link.label}
                  aria-current={activeSection === link.id ? "location" : undefined}
                  onMouseEnter={() => setHovered(link.id)}
                  onFocus={() => setHovered(link.id)}
                  onBlur={() => setHovered(null)}
                  className={cn(
                    "relative block rounded-full px-3 py-2 text-[13px] font-medium tracking-tight sm:px-4 sm:text-sm",
                    "transition-colors duration-300",
                    isHighlighted ? "text-inverse-foreground" : "text-inverse-foreground/70 hover:text-inverse-foreground",
                  )}
                >
                  {isHighlighted && (
                    <motion.span
                      layoutId="floating-nav-highlight"
                      transition={pillTransition}
                      className="absolute inset-0 rounded-full bg-inverse-foreground/10"
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </TransitionLink>
              </MagneticItem>
            </li>
          );
        })}
      </ul>

      {/* Primary CTA */}
      <MagneticItem strength={0.4} className="ml-1">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          onMouseEnter={() => setHovered(null)}
          className="block rounded-full bg-inverse-foreground px-4 py-2 text-[13px] font-semibold tracking-tight text-inverse transition-opacity hover:opacity-85 sm:px-5 sm:text-sm"
        >
          Let's Talk
        </a>
      </MagneticItem>
    </motion.nav>
  );
}
