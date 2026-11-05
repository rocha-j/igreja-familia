# Scroll-driven animation / scrollytelling for a React 19 + Vite + framer-motion church site (2026)

## Which approach fits a React/Vite site already using framer-motion and rAF-written CSS variables?

### Takeaway
Stay with framer-motion (motion) `useScroll`/`useTransform` for anything needing JS logic, and use native CSS `animation-timeline` as a progressive enhancement for simple reveals/parallax. GSAP ScrollTrigger is not needed for a small content site; it adds a second animation engine. (Recommendation is inference; see below.)

### Cited Findings
- Motion's `useScroll` returns scrollX/scrollY and scrollXProgress/scrollYProgress motion values; `target` and `offset` options measure progress through a specific element — [Motion docs](https://motion.dev/docs/react-scroll-animations)
- Motion uses the browser's native `ScrollTimeline` where possible for hardware acceleration and falls back to JavaScript otherwise; native `ViewTimeline` support was described as "coming" — [Motion docs](https://motion.dev/docs/react-scroll-animations)
- `whileInView`/`useInView` use a pooled IntersectionObserver (low overhead) — [Motion docs](https://motion.dev/docs/react-scroll-animations)
- Bundle: the `motion` component is ~43kb and not tree-shakeable; `LazyMotion` + `m` gets initial render to just over 5kb, with `domAnimation` adding 24kb and `domMax` 38kb. The page gave no size for `useScroll`/`scroll()` — [Motion bundle docs](https://motion.dev/docs/react-reduce-bundle-size)
- GSAP including ScrollTrigger and bonus plugins is now free (incl. commercial), README references 3.15 — [GSAP README](https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md)
- Native CSS API: `animation-timeline` with `scroll()`/`view()` or named timelines (`scroll-timeline`, `view-timeline`, `timeline-scope`), `animation-range`; JS interfaces `ScrollTimeline`/`ViewTimeline`. The spec is still a W3C draft — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)

### Inferences
- Since the site already ships framer-motion, `useScroll` + `useTransform` adds near-zero marginal bundle cost, whereas GSAP+ScrollTrigger would add a second engine (a third-party blog claims ~40KB gzip, unverified and from a competitor).
- Writing CSS variables from rAF is a main-thread approach; for pure transform/opacity effects, moving them to `animation-timeline` (or `useTransform` bound to style, which avoids React re-renders) is lighter. Keep rAF/JS only for effects that need computed logic.
- Suggested split: native CSS for reveals, progress bars, simple parallax (with `@supports` guard); `useScroll` for pinned/sequenced scrollytelling and anything needing state.

### Gaps
- No official GSAP gzip size found; "GSAP 4" claim in a third-party blog (Feb 2026) not confirmed by official sources.
- No size figure for `useScroll` alone.

## Current browser support and recommended fallback

### Takeaway
As of Oct 2026 all three engines support CSS scroll-driven animations; web.dev lists it Baseline Newly available because Firefox 159 enabled it by default. Safari/iOS support dates to Safari 26 (Sept 2025). Older Safari/Firefox users still need a fallback.

### Cited Findings
- "Firefox 159 enables scroll-driven animations by default" and "With support in Chrome, Safari, and now Firefox 159, scroll-driven animations are Baseline Newly available" — [web.dev, New to the web platform in October (2026)](https://web.dev/blog/web-platform-10-2026)
- Chrome/Edge 115 shipped it (July 2023); Chrome's article badges list Firefox 159 and Safari 26 — [Chrome for Developers](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- Safari 26 shipped it Sept 2025; threaded (off-main-thread) scroll-driven animations added in 26.4; bug fixes in 26.5 — secondary source [buildmvpfast](https://www.buildmvpfast.com/blog/css-scroll-driven-animations-replace-js-2026) (not a primary WebKit note). Apple WWDC25 session 233 covers it — [Apple](https://developer.apple.com/videos/play/wwdc2025/233/?time=2628)
- Chrome-documented: scroll-driven animations can run off the main thread; animate transform (e.g. scaleX) not width — [Chrome for Developers](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- Feature detection: `@supports (animation-timeline: scroll())` / the MDN example uses `@supports not (scroll-timeline: --x)` — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)
- Polyfill exists (flackr/scroll-timeline), used on the demo site — [scroll-driven-animations.style](https://scroll-driven-animations.style/), polyfill: https://github.com/flackr/scroll-timeline

### Inferences
- Because iOS Safari is tied to the OS version, iOS < 26 users (and Firefox < 159) remain; a content site should make the default (non-supported) state a fully visible, static layout, and apply animation only inside `@supports (animation-timeline: view())`. Alternatively, the framer-motion `useScroll` path is the JS fallback (Motion already falls back to JS).
- Polyfill is heavier and main-thread; probably unnecessary for decorative effects.

### Gaps
- Sources conflict on versions: some blogs say Firefox 123/133 or flag-only in Firefox 152 (June 2026), Safari 17.4/18.x/"19"; web.dev (Oct 2026) and Chrome docs are the most authoritative and agree on Firefox 159/Safari 26. caniuse page did not render data; verify there.
- Exact iOS Safari version mapping was not independently confirmed (assumed same as Safari 26).

## Proven patterns (pinned sections, clip-path reveals, parallax), performance, and accessibility

### Takeaway
Animate only transform/opacity (and clip-path sparingly), use `view()` timelines with `animation-range` for reveals, `position: sticky` for pinning, and gate motion by `prefers-reduced-motion`. Evidence found is thin on mid-range phone benchmarks.

### Cited Findings
- Demo patterns on the reference site: image reveal effects (as entering scrollport), fly-in/fly-out list, parallax backgrounds, reverse-scrolling columns, cover card to fixed header, stacking cards — [scroll-driven-animations.style](https://scroll-driven-animations.style/)
- `animation-range` named ranges: cover, entry, exit, entry-crossing, exit-crossing, contain; e.g. `entry 25% cover 50%`; ranges use the untransformed box — [Chrome for Developers](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- Syntax note: `animation-timeline` must come after the `animation` shorthand (shorthand resets it) — [Apple WWDC25 via search summary](https://developer.apple.com/videos/play/wwdc2025/233/?time=2628)

### Inferences
- Pinned sections: use `position: sticky` inside a tall wrapper and drive progress via `view-timeline`/`scroll()` or `useScroll({target, offset})`; avoids JS pinning (what GSAP pin does with spacers).
- Clip-path reveals: `clip-path: inset()` animation is not always compositor-accelerated; prefer transform/opacity or limit area on mid-range phones (general knowledge, not verified by a cited source).
- Reduced motion: wrap in `@media (prefers-reduced-motion: no-preference)` and use framer-motion `MotionConfig reducedMotion="user"` (already in site per git log); content must remain readable without animation. No cited source found for this; it is standard practice (MDN example suggests nothing on this).
- Touch-safe: avoid scroll-hijacking; keep scroll native.

### Gaps
- No cited benchmarks for mid-range phones; no sources found for clip-path compositing behavior, MDN/Chrome pages did not cover prefers-reduced-motion in the fetched portions (MDN fetch truncated at 100k of 131k characters).
