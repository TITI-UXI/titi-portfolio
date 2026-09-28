# Curved route transition rebuild

## Build
- Replace the current transition module with `CurvedTransition.tsx`, mounted globally beside the page content in the root layout.
- Use one fixed dark overlay above all interface layers, a normalized SVG bottom curve, and a centered destination label.
- On internal navigation, prevent the browser jump, show the covered state immediately, update the route behind it, hold for 300ms, then move the complete overlay upward for 800ms with the requested easing.
- Reset the overlay below the viewport after each run so the next click is always ready.

## Navigation coverage
- Export `TransitionLink` and `useCurvedNavigation` from the new module.
- Rebind the drawer, floating navigation, header, route CTAs, and root error links to the new transition.
- Preserve native behavior for email, external links, modifier-clicks, and new tabs.
- Animate browser back/forward navigation without causing a second history update.

## Verification
- Confirm the overlay visibly covers the page before the URL changes.
- Test drawer and floating navigation links, route CTAs, repeated navigation, and browser back/forward.
- Check desktop and the current compact viewport for label placement, curve visibility, route completion, and runtime errors.
