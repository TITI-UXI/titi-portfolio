# Curved labeled page transitions

## Goal
Create one global, reusable transition system that covers navigation with a dark curved curtain, shows the destination name at center, then reveals the loaded page without blocking input afterward.

## Implementation
- Replace the existing transition with `src/components/portfolio/PageTransition.tsx`, mounted once at the application root.
- Animate a fixed, non-interactive dark canvas and SVG curved edge with GSAP:
  - rise from below the viewport and morph the curve into a flat covered state;
  - fade in the centered `• Route` label;
  - update the route while fully covered and hold for roughly 550ms;
  - slide/fade the label upward, then pull the curtain above the viewport.
- Add a typed `TransitionLink` and transition hook beside the component.
  - Preserve modifier-clicks, external links, email links, and new-tab behavior.
  - Skip redundant transitions when the destination is already active.
  - Support both full routes and same-page section links.
  - Short-circuit animation for reduced-motion users.
- Replace internal links in the drawer, fixed navigation, header, page CTAs, and error/not-found actions with `TransitionLink`.
- Remove duplicate transition interception from smooth scrolling while preserving Lenis section scrolling and history updates.
- Listen for browser back/forward navigation globally, derive the destination label from the new URL, and run a guarded transition so rapid clicks cannot lock the interface.

## Technical details
- Keep route changes on TanStack Router; no second routing system.
- Use refs and GSAP transforms/path morphing for compositor-friendly motion.
- Keep the overlay `aria-hidden`, fixed, and `pointer-events-none`; route links retain normal accessible link semantics.
- Keep the existing semantic dark theme token aligned to the requested `#141516` canvas.

## Verification
- Check direct navigation to Home, Work, About, and Contact from drawer and CTA links.
- Check same-page section links and browser Back/Forward.
- Confirm the centered label matches the destination, the curtain releases after every navigation, and there are no layout jumps or console/runtime errors.
- Check desktop and mobile viewport behavior.
