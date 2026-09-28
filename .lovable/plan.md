# Floating Menu and Curved Navigation Drawer

## Build
- Replace the existing capsule navigation with a persistent circular menu control in the upper-right corner.
- Give the control spring-based magnetic movement and animate its two-line icon between menu and close states.
- Add a full-screen dark navigation drawer that enters from the right with a broad animated SVG curve along its leading edge.

## Navigation and content
- Add large Home, Work, About, and Contact links with staggered entrance and subtle magnetic movement.
- Track the visible page section and show a small active indicator beside the corresponding link.
- Add a minimal lower area with Instagram, Telegram, GitHub, WhatsApp, and the supplied email address.
- Close the drawer after choosing an internal link, clicking the backdrop, or pressing Escape.

## Behavior and validation
- Lock page scrolling only while the drawer is open and restore it reliably on close.
- Preserve keyboard focus, button labels, and reduced-motion behavior.
- Verify opening, closing, curved motion, links, scrolling restoration, mobile layout, and a clean preview build.
