import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/portfolio/CurvedTransition";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

const SOCIALS = [
  { label: "Awwwards", href: "https://www.awwwards.com/" },
  { label: "Instagram", href: "https://instagram.com/titi-uxi" },
  { label: "Telegram", href: "https://t.me/titi_uxui" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
] as const;


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

  const duration = reduceMotion ? 0.15 : 0.7;

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
              transition={{ duration: duration * 0.6 }}
            />

            <motion.aside
              className="absolute inset-y-0 right-0 flex h-screen w-full flex-col justify-between rounded-none border-l border-hero-foreground/5 bg-surface p-12 text-hero-foreground shadow-2xl sm:w-[480px] md:w-[560px] md:p-16"
              variants={{ closed: { x: "100%" }, open: { x: 0 } }}
              transition={{ duration, ease: [0.76, 0, 0.24, 1] }}
            >
              <nav aria-label="Drawer navigation" className="pt-24">
                <p className="mb-8 border-b border-hero-foreground/10 pb-4 text-xs uppercase tracking-widest text-surface-muted">Navigation</p>
                <ul className="flex flex-col gap-6">
                  {LINKS.map((link, index) => (
                    <motion.li
                      key={link.to}
                      variants={{ closed: { opacity: 0, x: 60 }, open: { opacity: 1, x: 0 } }}
                      transition={{ delay: reduceMotion ? 0 : 0.15 + index * 0.06, duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                    >
                      <TransitionLink
                        href={link.to}
                        label={link.label}
                        onClick={() => setOpen(false)}
                        className="group relative flex items-center text-5xl font-normal tracking-tight md:text-6xl"
                      >
                        <span
                          aria-hidden
                          className={`absolute -left-7 h-2.5 w-2.5 rounded-full bg-hero-foreground transition-transform duration-300 ${pathname === link.to ? "scale-100" : "scale-0"}`}
                        />
                        <span className="transition-transform duration-300 ease-out group-hover:translate-x-3">{link.label}</span>
                      </TransitionLink>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                variants={{ closed: { opacity: 0, y: 20 }, open: { opacity: 1, y: 0 } }}
                transition={{ delay: reduceMotion ? 0 : 0.45, duration: 0.4 }}
              >
                <p className="mb-3 text-xs uppercase tracking-widest text-surface-muted">Socials</p>
                <div className="flex flex-wrap gap-6 text-xs text-surface-soft md:text-sm">
                  {SOCIALS.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-hero-foreground">
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