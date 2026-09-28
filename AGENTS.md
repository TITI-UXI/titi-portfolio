<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the scroll-mask portrait at `/portrait.jpg`; the hero uses a GSAP-driven CSS radial mask for a soft, SSR-safe reveal.
- Coordinate the preloader and scroll-mask with the `tina:preloader-complete` browser event so ScrollTrigger refreshes after the reveal.
- Use `NavigationDrawer` as the sole persistent navigation; keep its destinations aligned with the existing top, work, about, and contact section IDs.
- Route and section navigation must use the global `TransitionLink` curtain so labels, scrolling, and history behavior stay coordinated.
