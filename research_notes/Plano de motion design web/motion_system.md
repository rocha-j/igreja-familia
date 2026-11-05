# Motion design systems and motion tokens for a small React site (warm, calm church brand), as of Nov 2026

## 1. What duration/easing scales and naming conventions are recommended? (Material 3, Carbon, Atlassian, Apple)

### Takeaway
Mature systems share one shape: a small named duration scale (about 6 steps in Carbon, 16 in M3, 2 bands in Atlassian), 3 to 4 easing curves split by role (standard, entrance/decelerate, exit/accelerate), and a rule that frequent micro-feedback is under about 150ms while larger or entering elements take 250-400ms. Exits are faster than entrances. Apple publishes no numeric tokens, only principles. For a calm brand, adopt a productive-style scale and keep any expressive tier rare.

### Cited Findings
- Carbon defines two styles: productive (efficient, subtle, for task completion) and expressive (vibrant, reserved for significant moments such as opening a new page or alerts) — [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/)
- Carbon easing, productive: standard `cubic-bezier(0.2, 0, 0.38, 0.9)`, entrance `cubic-bezier(0, 0, 0.38, 0.9)`, exit `cubic-bezier(0.2, 0, 1, 0.9)`. Expressive: standard `cubic-bezier(0.4, 0.14, 0.3, 1)`, entrance `cubic-bezier(0, 0, 0.3, 1)`, exit `cubic-bezier(0.4, 0.14, 1, 1)` — [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/)
- Carbon duration tokens (name = speed band + index): `duration-fast-01` 70ms (buttons, toggles), `fast-02` 110ms (fades), `moderate-01` 150ms (small expansions), `moderate-02` 240ms (expansions, toasts, system messages), `slow-01` 400ms (large expansions, important notifications), `slow-02` 700ms (background dimming) — [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/)
- Carbon usage rules: standard easing for elements visible throughout the motion; exit easing for removed elements (closing modal, toast); larger distance or scale needs longer duration; micro-interactions about 90-120ms, ease-out on user input — [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/)
- Carbon principles: purposeful, responsive, meticulous, unobtrusive ("reduce or remove motion that users frequently notice"), adaptive (reduced/static alternatives, subtle motion is missed on small screens) — [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/)
- Atlassian principles: Human (subtle, rhythmic, organic, warm rather than mechanical), Clarity, Accessible, Performant — [Atlassian motion](https://atlassian.design/foundations/motion)
- Atlassian duration bands: interactions 50-150ms (hover, press; list-item hover at 50ms); transitions 150-400ms (entering, exiting, moving; larger elements longer). Examples: dropdown entrance 150ms, modal entrance 250ms — [Atlassian motion](https://atlassian.design/foundations/motion)
- Atlassian easing: ease-out bold `cubic-bezier(0, 0.4, 0, 1)` (panels/flags entering); ease-in-out bold `cubic-bezier(0.4, 0, 0, 1)` (scaling modals, repositioning); ease-in practical `cubic-bezier(0.6, 0, 0.8, 0.6)` (exits); ease-out practical `cubic-bezier(0.4, 1, 0.6, 1)` (popups, hover background fades) — [Atlassian motion](https://atlassian.design/foundations/motion)
- Atlassian rules: ease-out for entrance, ease-in for exit; exit faster than entrance; start motion immediately on interaction; keep high-frequency interactions under 150ms; one focal point, avoid competing simultaneous animations; never make users wait on blocking animation; ask whether removing the motion would lose information or context — [Atlassian motion](https://atlassian.design/foundations/motion)
- Atlassian naming: semantic tokens bundle duration + easing + properties (example `motion.popup.enter`) and should be used before base tokens; still early access behind a feature flag for a limited set of components — [Atlassian motion](https://atlassian.design/foundations/motion)
- Atlassian motion properties vocabulary: scale, fade, slide, color — [Atlassian motion](https://atlassian.design/foundations/motion)
- Material 3 (values from a third-party Rust port of the M3 tokens, not the official page, which did not fetch): easing `standard` (0.2, 0, 0, 1), `standard-accelerate` (0.3, 0, 1, 1), `standard-decelerate` (0, 0, 0, 1), `emphasized-accelerate` (0.3, 0, 0.8, 0.15), `emphasized-decelerate` (0.05, 0.7, 0.1, 1); `emphasized` is a path curve in the spec and is approximated by the standard curve in that port — [hydrolysis-m3 tokens.rs](https://docs.rs/crate/hydrolysis-m3/latest/source/src/theme/motion/tokens.rs)
- Material 3 durations in the same source: short1-4 = 50/100/150/200ms, medium1-4 = 250/300/350/400ms, long1-4 = 450/500/550/600ms, extra-long1-4 = 700/800/900/1000ms (naming = band + index 1-4) — [hydrolysis-m3 tokens.rs](https://docs.rs/crate/hydrolysis-m3/latest/source/src/theme/motion/tokens.rs)
- A search summary notes a different "expressive" M3 curve `cubic-bezier(0.05, 0.7, 0.1, 1.0)` versus the older emphasized `(0.2, 0, 0, 1)`; sources conflict and no official spec page was retrieved — [search results incl. M3 skill page](https://www.skills.lc/shelbeely/Shelbeely-Agent-skills/shelbeely-shelbeely-agent-skills-skills-material-design-3-motion-skill-md)
- Apple HIG Motion: add motion purposefully; make motion optional (not the only way to communicate important information); feedback motion should be realistic and follow gestures; brief, precise feedback feels lightweight; generally avoid motion on frequent UI interactions; let people cancel motion and never make them wait for it; avoid sustained oscillation around 0.2 Hz (visionOS) — [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion.md)
- Apple HIG gives no millisecond tokens or easing values on this page; system springs are used instead — [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion.md)
- Springs (Motion library for React): options stiffness, damping, mass, plus duration-based `visualDuration` and `bounce` (default 0.25; 0 = critically damped; negative = overdamped without overshoot). `MotionConfig` sets shared defaults. `visualDuration` eases coordination with time-based animations. Avoid `damping: 0` — [Motion docs](https://motion.dev/docs/react-transitions)

### Inferences
- Suggested token structure for the site (derived from the above): `--motion-duration-{instant 70, fast 120, base 200, moderate 280, slow 400, slower 600}`, `--motion-ease-{standard, enter, exit}`, then semantic tokens (`--motion-hover`, `--motion-press`, `--motion-reveal`, `--motion-route`) that reference the base tokens, following Atlassian's semantic-over-base layering and Carbon's band + index naming.
- Good calm defaults: enter `cubic-bezier(0, 0, 0.38, 0.9)` or Atlassian ease-out bold; exit about 60-70% of the entrance duration with the Carbon exit curve; use critically damped springs (bounce 0 to 0.1) so nothing overshoots, matching the "warm, organic, not mechanical" tone.
- A single expressive tier (Carbon-style, 400-700ms) should be limited to hero entrance and rare moments; everything task-like stays productive.
- Using Carbon-like tokens avoids any need for per-component timing choices; keep to 2 curve families and 5-6 durations.

### Gaps
- Official M3 token page (m3.material.io easing-and-duration) returned only a title; M3 values above are from a secondary port and the exact M3 Expressive curve/spring token set was not verified. Note M3 Expressive's spring-based "motion physics" tokens (spatial/effects, fast/default/slow) were not retrieved.
- Choreography/stagger numeric rules (per-item delay, total cap) were not found in primary sources fetched; Carbon/Atlassian pages summarized did not give stagger values.

## 2. View Transitions API with react-router 7 and support status

### Takeaway
Same-document View Transitions are Baseline-level (about 93% global usage; Chrome 111, Safari 18, Firefox 144). React Router 7 supports them either via the legacy `viewTransition` prop on Link/NavLink/Form/navigate (works with any React) or, recommended in current docs, React's `<ViewTransition>` component (React/React DOM 19.3+), but the two must not be combined. Always add a reduced-motion override.

### Cited Findings
- Same-document transitions are triggered with `document.startViewTransition(callback)`; cross-document transitions opt in with `@view-transition { navigation: auto; }` on both pages and need same-origin — [Chrome Developers](https://developer.chrome.com/docs/web-platform/view-transitions)
- Chrome's page lists same-document support: Chrome/Edge 111, Firefox 144, Safari 18; cross-document: Chrome/Edge 126, Safari 18.2, not Firefox. Page has no as-of date — [Chrome Developers](https://developer.chrome.com/docs/web-platform/view-transitions)
- caniuse (single-document): global usage 93.17%; Chrome/Edge 111+, Safari and iOS Safari 18+, Firefox 144+ (disabled by default in 143), Opera 97+, Samsung Internet 23+; unsupported: Safari 17.6 and below, Firefox 142 and below, Opera Mini, IE — [caniuse](https://caniuse.com/view-transitions)
- React Router docs: recommended approach is wrapping the `<Outlet />` area in React's `<ViewTransition>` in a persistent layout route; requires React and React DOM 19.3 or later; React Router wraps router state updates in `React.startTransition` by default so Link, NavLink, Form, useNavigate and useSubmit work without config — [React Router view transitions](https://reactrouter.com/how-to/view-transitions)
- Legacy (labelled deprecated in the docs but still working, including older React): `viewTransition` prop on `<Link>`, `<NavLink>`, `<Form>`, `navigate(to, { viewTransition: true })`, `useViewTransitionState(href)`, NavLink `isTransitioning` render prop and `transitioning` class; default gives a cross-fade; named shared elements via `view-transition-name` — [React Router view transitions](https://reactrouter.com/how-to/view-transitions)
- Caveats: do not enable both systems at once (can interrupt animations); keep React Transitions on (no `useTransitions={false}`), avoid `flushSync`; Back/Forward may not animate because React skips view transitions for synchronous popstate; unsupported browsers navigate normally — [React Router view transitions](https://reactrouter.com/how-to/view-transitions)
- Reduced-motion snippet from the docs: `@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }` — [React Router view transitions](https://reactrouter.com/how-to/view-transitions)
- React `<ViewTransition>`: props `name`, `enter`, `exit`, `update`, `share`, `default` (value "auto", "none", class string, or object keyed by transition type); triggers only from `startTransition`, `<Suspense>` reveals (waits up to 500ms for fonts and visible images) and `useDeferredValue`; plain setState does not animate; style via `::view-transition-old(.class)` / `::view-transition-new(.class)`; React does not disable animations for reduced motion, you must do it in CSS; docs examples pin 19.3 canary builds so stability should be checked — [React docs: ViewTransition](https://react.dev/reference/react/ViewTransition)

### Inferences
- For a small site: if the project is on React 19.2 or older, use the legacy `viewTransition` prop (or `startViewTransition` around navigation) and set durations via `::view-transition-old(root)` / `::view-transition-new(root)` using the site tokens (about 200-300ms cross-fade, small 8-12px translate at most). Upgrade path is the `<ViewTransition>` wrapper once on React 19.3.
- A project using Framer/Motion route fade-ins (as the repo recently added) should pick one route-transition mechanism, not stack View Transitions on top of `AnimatePresence`/fade-in.
- Because Firefox cross-document support is absent and Back/Forward may not animate, treat transitions as progressive enhancement only.

### Gaps
- Exact React version where `<ViewTransition>` becomes stable (non-canary) and whether the repo's React version qualifies not verified here.
- React Router 7 minimum minor version for the new docs behavior not stated in the fetched page.
- Chrome docs summary lacked guidance on `view-transition-name` conflicts, types API (`view-transition-types`), and `::view-transition` performance pitfalls.

## 3. Microinteraction patterns (feedback, hover, press, loading), kept subtle and meaningful

### Takeaway
Primary sources agree: microinteractions should be fast (about 50-150ms), start immediately, use ease-out, communicate state or cause and effect rather than decorate, avoid repeating on high-frequency actions, and always have a no-motion fallback.

### Cited Findings
- Carbon: give immediate feedback, ease-out on input, micro-interactions about 90-120ms; buttons/toggles 70ms, fades 110ms — [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/)
- Atlassian: hover and press 50-150ms (list hover 50ms), popup and hover background fades use ease-out practical; avoid simultaneous competing animations — [Atlassian motion](https://atlassian.design/foundations/motion)
- Apple: brief, precise feedback feels lightweight; avoid motion on frequent interactions; let people skip/cancel; supplement visual feedback with other channels (haptics/audio, so on the web, text/icon/color change too) — [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion.md)
- Atlassian reduced motion: motion off and changes instant; avoid flashing, rapid oscillation, large sweeping motion; ensure the UI is fully usable with all motion disabled — [Atlassian motion](https://atlassian.design/foundations/motion)
- Carbon: adaptive principle, provide reduced/static alternatives; subtle motion is easily missed on small screens — [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/)
- Motion library: `MotionConfig` for shared defaults; physics springs retain gesture velocity for natural feedback, duration-based springs are simpler — [Motion docs](https://motion.dev/docs/react-transitions)

### Inferences
- Concrete subtle recipe: hover = color/background/underline fade 120ms ease-out (gate with `@media (hover: hover)` to avoid sticky touch hover); press = `scale(0.97-0.98)` or slight darken at 70-100ms, release 120ms; focus-visible = instant ring (no animation needed); copy/confirm feedback (e.g. Pix copy) = swap label/icon with 120-200ms fade and hold about 1.5-2s, announce through `aria-live`; loading = skeleton or static text with slow opacity pulse (1.5-2s period, finite or low amplitude), no spinners for under about 300ms waits; reveal on scroll = 12-16px translate + fade at 400ms enter curve, once only, no stagger beyond about 60-80ms per item and about 5 items total cap.
- Animate only `transform` and `opacity` (plus color) for performance; avoid layout properties; that matches Atlassian's "Performant" principle.
- Calm-brand guideline: no bounce/overshoot, no parallax, no looping decorative motion; prefer opacity and gentle translate; keep one focal animation per viewport.
- Stagger numbers above are my own design suggestions, not drawn from a cited source.

### Gaps
- No fetched primary source gave numeric stagger/choreography rules or loading-indicator timing thresholds (e.g. 300ms spinner delay); those figures are inferences.
- NN/g, Google web.dev, or Josh Comeau-style microinteraction sources were not consulted within the research budget.
