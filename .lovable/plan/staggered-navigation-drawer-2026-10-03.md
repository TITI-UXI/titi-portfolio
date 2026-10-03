# Staggered Navigation Drawer

## Build
- Keep the current circular magnetic trigger, menu layout, typography, routes, active indicator, and social links unchanged.
- Replace the single sliding drawer background with four full-height grayscale curtain slices, followed by the existing `#1c1d20` content panel.
- Sequence the slices from right to left with short incremental delays, then reveal the navigation content.

## Motion
- Use Framer Motion variants with the requested 0.75-second easing and 0.05–0.06-second stagger.
- Reveal navigation links upward with a 30px fade-in stagger after the content panel arrives.
- Reverse both the links and curtain slices on close before the drawer unmounts.
- Preserve the existing reduced-motion, Escape key, backdrop close, focus, and scroll-lock behavior.

## Validation
- Verify opening and closing visually, link ordering and active dot, route navigation, backdrop/Escape closing, and desktop/mobile layouts.
- Confirm the preview remains error-free.

## Technical details
- The active file is `src/components/portfolio/NavigationDrawer.tsx`; there is no `src/components/layout/NavigationDrawer.tsx` in this project.
- The layered panels will use absolute positioning behind the final content layer, keeping the existing navigation component mounted globally.
