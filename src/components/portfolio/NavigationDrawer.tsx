import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/portfolio/PageTransition";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/titi-uxi" },
  { label: "Telegram", href: "https://t.me/titi_uxi" },
  { label: "GitHub", href: "https://github.com/TITI_UXI" },
  { label: "WhatsApp", href: "https://wa.me/" },
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
            className="relative h-14 w-14 rounded-full shadow-xl sm:h-16 sm:w-16"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <motion.span
              aria-hidden
              className="absolute h-px w-5 bg-primary-foreground"
              animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              aria-hidden
              className="absolute h-px w-5 bg-primary-foreground"
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
              className="absolute inset-y-0 right-0 flex w-[92vw] flex-col justify-between bg-inverse px-7 pb-8 pt-28 text-inverse-foreground sm:w-[72vw] sm:px-12 sm:pb-10 lg:w-[58vw] lg:px-20"
              variants={{ closed: { x: "115%" }, open: { x: 0 } }}
              transition={{ duration, ease: [0.76, 0, 0.24, 1] }}
            >
              <svg
                aria-hidden
                viewBox="0 0 150 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-y-0 right-full h-full w-24 text-inverse sm:w-36"
              >
                <motion.path
                  fill="currentColor"
                  variants={{
                    closed: { d: "M150 0 L150 100 L150 100 Q150 50 150 0 Z" },
                    open: { d: "M150 0 L150 100 L75 100 Q0 50 75 0 Z" },
                  }}
                  transition={{ duration: duration * 1.15, ease: [0.76, 0, 0.24, 1] }}
                />
              </svg>

              <nav aria-label="Drawer navigation">
                <p className="eyebrow mb-7 text-inverse-muted">Navigation</p>
                <ul>
                  {LINKS.map((link, index) => (
                    <motion.li
                      key={link.to}
                      variants={{ closed: { opacity: 0, x: 48 }, open: { opacity: 1, x: 0 } }}
                      transition={{ delay: reduceMotion ? 0 : 0.18 + index * 0.07, duration: 0.45 }}
                    >
                      <MagneticItem>
                        <TransitionLink
                          href={link.to}
                          label={link.label}
                          onClick={() => setOpen(false)}
                          className="group flex items-center gap-4 py-1 text-[clamp(2.7rem,7vw,6.5rem)] font-semibold uppercase leading-[0.95]"
                        >
                          <span
                            aria-hidden
                            className={`h-2 w-2 shrink-0 rounded-full bg-inverse-foreground transition-opacity ${pathname === link.to ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
                          />
                          <span className="transition-opacity group-hover:opacity-60">{link.label}</span>
                        </TransitionLink>
                      </MagneticItem>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                className="border-t border-inverse-border pt-6"
                variants={{ closed: { opacity: 0, y: 20 }, open: { opacity: 1, y: 0 } }}
                transition={{ delay: reduceMotion ? 0 : 0.45, duration: 0.4 }}
              >
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium sm:text-sm">
                  {SOCIALS.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-55">
                      {social.label}
                    </a>
                  ))}
                </div>
                <a href="mailto:titi.uxui@gmail.com" className="mt-5 inline-block text-sm transition-opacity hover:opacity-55 sm:text-base">
                  titi.uxui@gmail.com
                </a>
              </motion.div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}