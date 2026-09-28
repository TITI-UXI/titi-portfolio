# Multilingual Greeting Preloader

## Build
- Add a full-screen dark preloader that cycles through the eight supplied greetings at a fast, even cadence.
- Show a restrained percentage counter progressing from 0% to 100%, ending on “سلام”.
- Animate the overlay upward after completion while an SVG curved lower edge creates the fluid page reveal.

## Integration
- Mount the preloader once at the page level above the portfolio.
- Lock page scrolling while it is visible, then restore the previous scroll setting during exit and cleanup.
- Dispatch a browser event when the reveal completes so the scroll-mask hero can initialize and refresh its scroll measurements at the correct moment.

## Validation
- Verify the greeting order, final 100% state, curved exit, restored scrolling, visible hero, and absence of browser errors.
- Confirm the latest preview build completes successfully.
