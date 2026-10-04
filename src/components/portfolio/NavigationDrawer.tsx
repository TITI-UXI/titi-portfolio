import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/portfolio/CurvedTransition";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "Instagram", href: "https://instagram.com/titi-uxi" },
  { label: "Telegram", href: "https://t.me/titi_uxui" },
  { label: "GitHub", href: "https://github.com/TITI_UXI" },
] as const;

const CURTAIN_PANELS = [
  "bg-menu-graphite",
  "bg-menu-charcoal",
  "bg-menu-obsidian",
  "bg-menu-canvas",
] as const;

const DRAWER_EASE = [0.76, 0, 0.24, 1] as const;

const curtainGroupVariants = {
  closed: { transition: { staggerChildren: 0 } },
  open: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: 1,
    },
  },
};

const curtainPanelVariants = {
  closed: { x: "100%", transition: { duration: 0.3, ease: "easeInOut" as const } },
  open: { x: 0, transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as const } },
};

const linkVariants = {
  closed: { y: 40, opacity: 0 },
  open: { y: 0, opacity: 1 },
};


function MagneticItem({ children, strength = 0.22 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 240, damping: 18, mass: 0.35 });

  const move = (event: MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * strength);
    y.set((event.clientY - bounds.top - bounds.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} onMouseMove={move} onMouseLeave={reset}>
      {children}
    </motion.div>
  );
}

export function NavigationDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 100);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="fixed right-4 top-4 z-[90] sm:right-8 sm:top-8">
        <MagneticItem strength={0.35}>
          <Button
            ref={closeButtonRef}
            type="button"
            size="icon"
            aria-expanded={open}
            aria-controls="navigation-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((current) => !current)}
            className={`relative h-16 w-16 rounded-full border border-hero-foreground/10 ${open ? "bg-cta-slate hover:scale-105" : "bg-surface hover:bg-hero-foreground hover:text-hero"} text-hero-foreground shadow-2xl transition-all duration-300 md:h-20 md:w-20`}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <motion.span
              aria-hidden
              className="absolute h-[1.5px] w-6 bg-current"
              animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              aria-hidden
              className="absolute h-[1.5px] w-6 bg-current"
              animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
              transition={{ duration: 0.25 }}
            />
          </Button>
        </MagneticItem>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="navigation-drawer"
            className="fixed inset-0 z-[80]"
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 cursor-default bg-foreground/45"
              variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
              transition={{ duration: 0.35 }}
            />

            <motion.div
              className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[480px] md:w-[560px]"
              variants={curtainGroupVariants}
            >
              {CURTAIN_PANELS.map((panelClass) => (
                <motion.div
                  key={panelClass}
                  aria-hidden
                  className={`absolute inset-0 ${panelClass}`}
                  variants={curtainPanelVariants}
                />
              ))}
            </motion.div>

            <motion.aside
              className="absolute inset-y-0 right-0 flex h-[100dvh] w-full select-none flex-col justify-between rounded-none border-l border-hero-foreground/5 bg-surface px-8 py-12 text-hero-foreground shadow-2xl sm:w-[480px] md:w-[560px] md:px-14 md:py-16"
              variants={curtainPanelVariants}
            >
              <motion.nav
                aria-label="Drawer navigation"
                className="flex flex-1 flex-col"
                variants={{
                  closed: { transition: { staggerChildren: 0 } },
                  open: {
                    transition: {
                      delayChildren: reduceMotion ? 0 : 0.82,
                      staggerChildren: reduceMotion ? 0 : 0.06,
                    },
                  },
                }}
              >
                <motion.p
                  className="border-b border-hero-foreground/5 pb-4 text-[11px] uppercase tracking-[0.25em] text-surface-muted"
                  variants={linkVariants}
                  transition={{ duration: reduceMotion ? 0.1 : 0.45, ease: DRAWER_EASE }}
                >
                  Navigation
                </motion.p>
                <ul className="my-auto flex flex-col space-y-4 py-8 md:space-y-6">
                  {LINKS.map((link, index) => (
                    <li key={link.to} className="overflow-hidden py-1"><motion.div
                      custom={index}
                      variants={linkVariants}
                      transition={{ duration: reduceMotion ? 0.1 : 0.5, ease: DRAWER_EASE }}
                    >
                      <TransitionLink
                        href={link.to}
                        label={link.label}
                        onClick={() => setOpen(false)}
                        className="group relative flex items-center text-5xl font-normal tracking-tight md:text-6xl"
                      >
                        <span className="w-8 shrink-0 font-mono text-xs tracking-wider text-surface-muted">{String(index + 1).padStart(2, "0")}</span>
                        <span
                          aria-hidden
                          className={`absolute -left-5 h-2.5 w-2.5 rounded-full bg-hero-foreground transition-transform duration-300 ${pathname === link.to ? "scale-100" : "scale-0"}`}
                        />
                        <span className="transition-transform duration-300 ease-out group-hover:translate-x-3">{link.label}</span>
                      </TransitionLink>
                    </motion.div></li>
                  ))}
                </ul>
              </motion.nav>

              <motion.div
                variants={{
                  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
                  open: { opacity: 1, y: 0, transition: { delay: reduceMotion ? 0 : 1.08, duration: reduceMotion ? 0.1 : 0.4 } },
                }}
              >
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-surface-muted">Socials</p>
                <div className="flex flex-wrap items-center gap-6 text-xs text-surface-soft">
                  {SOCIALS.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="transition-colors duration-300 hover:text-hero-foreground">
                      {social.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}