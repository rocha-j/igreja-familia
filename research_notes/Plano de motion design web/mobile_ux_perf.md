# Mobile-first immersive web UX: scroll-snap, gestures, performance, accessibility, deployment (as of 2026)

## 1. Scroll-snap mandatory with nested horizontal tracks on iOS Safari / Android Chrome (100dvh, address bar, overscroll)

### Takeaway
Use `mandatory` only when every snap child fits in the scroller; otherwise `proximity`. On iOS, nested/root snapping has open WebKit bugs (including after browser chrome collapses), so test on real devices. Prefer `svh`/`lvh` or a stable container height over naive `100dvh`, and use `overscroll-behavior` on inner tracks.

### Cited Findings
- `mandatory` always snaps; tradeoff is it can trap users if content is larger than expected. `proximity` lets the browser decide. — [MDN scroll snap basics](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap/Basic_concepts)
- MDN warns: never use `mandatory` if a child's content overflows the parent, since overflowing content cannot be scrolled into view. A child with `scroll-snap-align: none` (the default) under `mandatory` is unreachable. — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap/Basic_concepts)
- `scroll-snap-stop: always` prevents flicks skipping sections but makes quick navigation harder. Use `scroll-padding` so fixed headers/docks do not cover snapped content. — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap/Basic_concepts)
- `100vh` on mobile is "correct" only when browser UI is retracted. `svh` = UI expanded (stable), `lvh` = UI retracted (stable), `dvh` switches dynamically between them. — [web.dev viewport units](https://web.dev/blog/viewport-units)
- Secondary source rule of thumb: `svh` when content must never hide behind browser UI, `lvh` for max space with overlap tolerated, `dvh` to track toolbar state. Units said to be Baseline in all current engines (secondary, verify on MDN). — [web.dev](https://web.dev/blog/viewport-units); [modern-css.com](https://modern-css.com/mobile-viewport-height-without-100vh-hack/)
- `overscroll-behavior`: `contain` stops scroll chaining but keeps bounce; `none` stops both. `overscroll-behavior-y: none` on body suppresses pull-to-refresh-style bounce. Set on inner scrollers per container. MDN marks it "Limited availability" (not Baseline; per-browser table not read). — [MDN overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
- WebKit bug reports (search-result summaries, not read in full): percentage-width snap items under mandatory cause scroll position jumps after DOM changes (iOS 11 era, report 173830); nested vertical scroller during unfinished horizontal snap can freeze horizontal snapping; root-level snapping bug where programmatic scrolling fails after browser UI collapses, reportedly fixed in iOS 26 by one comment but a maintainer reproduced it in iOS 26.4 (March 2026). — [WebKit 173830](https://bugs.webkit.org/show_bug.cgi?id=173830); [WebKit 245722](https://bugs.webkit.org/show_bug.cgi?id=245722)

### Inferences
- For a vertical `y mandatory` page with horizontal `x` tracks inside: give each section `scroll-snap-align: start`, avoid sections taller than the snap viewport (text zoom/small phones/landscape), and use `proximity` or `min-height` + non-snapping tall sections as fallback.
- Use `svh` for min-height of full-screen sections (stable, no resize-jank on snap), reserve `dvh` for elements that must track the visible area; add a `100vh` fallback before it.
- Avoid percentage-based snap item widths or reflow after load (fonts/images without dimensions) in mandatory scrollers given the jump bug.
- Set `overscroll-behavior-x: contain` on horizontal tracks to prevent edge-swipe chaining/back-gesture surprises (not verified to affect iOS edge back swipe).

### Gaps
- No primary source found specifically tying `dvh` to iOS scroll-snap bugs; no confirmed current iOS/Android Chrome behavior matrix for nested snapping. Needs real-device testing.
- Per-browser support of `overscroll-behavior` (Safari status) not retrieved.

## 2. Gesture conflicts: embedded iframes/maps vs scroll

### Takeaway
An embedded map captures one-finger swipes (scroll trap). The Maps JS API solves it with `gestureHandling: cooperative` (two fingers for map). `overscroll-behavior` does not apply to the iframe element itself.

### Cited Findings
- Google introduced `cooperative` gesture handling so one-finger touch pans the page and two-finger gestures control the map; in an iframe, `auto` resolves to cooperative. — [Google Maps Platform blog](https://maps-apis.googleblog.com/2016/11/smart-scrolling-comes-to-mobile-web-maps.html); [Earth Engine docs](https://developers.google.cn/earth-engine/apidocs/ui-map-setgesturehandling?hl=hi)
- `overscroll-behavior` has no effect on `<iframe>` elements; inside the framed document it must be set on both `html` and `body`. — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)

### Inferences
- For a plain `<iframe>` Maps embed (no JS API), common workarounds are a tap-to-activate overlay (`pointer-events: none` on the iframe until tapped) or a static map image/link out. Not sourced here.
- Keep a swipe gutter or place maps in a non-snap section so users can scroll past.

### Gaps
- No source found on pointer-events/click-to-activate overlays or whether the Maps Embed iframe supports cooperative gestures. Not verified.

## 3. WCAG criteria for scroll-triggered motion and safeguards

### Takeaway
2.3.3 Animation from Interactions (AAA) covers motion triggered by user interaction (scroll parallax); 2.2.2 Pause, Stop, Hide (A) covers auto-starting motion over 5 s. Honor `prefers-reduced-motion` (technique C39/SCR40) and provide a pause control for looping animation.

### Cited Findings
- 2.3.3 (Level AAA, added WCAG 2.1) applies when user interaction triggers non-essential animation; "essential" means removal would fundamentally change information/functionality. Techniques: C39 (CSS `prefers-reduced-motion`), SCR40 (JS). — [W3C Understanding 2.3.3](https://w3c.github.io/wcag/understanding/animation-from-interactions.html)
- 2.2.2: moving/blinking/scrolling content that starts automatically, lasts over 5 s, and runs alongside other content needs pause/stop/hide; auto-updating content has no 5 s exception; a single shared control is recommended. Failures include F16 (unessential scrolling content without pause). — [W3C Understanding 2.2.2](https://w3c.github.io/wcag/understanding/pause-stop-hide.html)
- Same animation can fail both criteria. A blanket `animation: none !important` can break functional animations such as spinners; suppress only meaningful motion. Automated tools can detect the media query but not judge essentiality (vendor blog, lower reliability). — [W3C 2.3.3](https://w3c.github.io/wcag/understanding/animation-from-interactions.html); [TestParty guide](https://testparty.ai/blog/wcag-animation-interactions-guide)

### Inferences
- Safeguards: `@media (prefers-reduced-motion: reduce)` replaces parallax/large translate/scale/auto-looping with fades or static; loops (pulses, marquees) get pause or finite iterations (<=5 s); optional in-page "reduce motion" toggle; avoid large-area movement, zoom, and scroll-linked parallax, which are the typical vestibular triggers. Also relevant (not researched here): 2.3.1 three flashes.
- AAA is not usually legally required but is best practice; 2.2.2 (A) is mandatory for conformance.

### Gaps
- Did not retrieve WCAG 2.3.1 or W3C vestibular-specific guidance (e.g., a11y project/WebAIM/web.dev motion articles); vestibular specifics are inference.

## 4. Performance budgets and measurement for animation-heavy pages

### Takeaway
INP good <= 200 ms at the 75th percentile (field). Animate `transform`/`opacity` only (compositor). Measure with field data (CrUX/PSI, web-vitals) plus DevTools Performance and Lighthouse (lab proxy TBT).

### Cited Findings
- INP: good <= 200 ms, needs improvement 200-500 ms, poor > 500 ms, assessed at p75 on mobile and desktop separately. Counts click/tap/keyboard; scrolling, hovering and zooming are not counted. Lab tools may not report INP without interaction; TBT is a rough proxy; `web-vitals` `onINP` does not cover iframes. — [web.dev INP](https://web.dev/articles/inp)
- Secondary sources: animate `transform`/`opacity` (compositor) rather than layout properties such as height/width/top/left, which cause reflow and add presentation delay after interactions. — [corewebvitals.io](https://www.corewebvitals.io/state-of-cwv/inp)

### Inferences
- Because scrolling is excluded from INP, scroll-driven animation hurts mostly via main-thread jank/dropped frames and LCP/CLS (hero images, fonts), not INP directly; tap handlers (dock navigation, carousels) are what INP measures.
- Practical budget for a small static site: LCP <= 2.5 s, CLS <= 0.1 (standard CWV thresholds, from knowledge, not fetched), small JS, `will-change` sparingly, test on mid-range Android with CPU 4x throttling.

### Gaps
- No primary source fetched for LCP/CLS thresholds, Lighthouse scoring weights, or DevTools Performance panel workflow; no numeric animation-specific budget (e.g., frame time) found.

## 5. Device-based redirect (phone to /m) without hurting SEO or accessibility

### Takeaway
Google supports separate mobile URLs via bidirectional annotations: desktop page `rel="alternate"` (with `media`) to mobile; mobile page `rel="canonical"` to desktop. Redirect on entry only, to the matching URL, and let users switch. On GitHub Pages only client-side redirects are possible (no server headers).

### Cited Findings
- Google: desktop URL is canonical; keep 1-to-1 mapping; redirects should match the declared alternates; use `Vary: User-Agent` for UA-based redirects; 301 vs 302 does not matter to Google. — [Google separate URLs (via search summary)](https://developers.google.com/search/mobile-sites/mobile-seo/separate-urls?hl=fr); [mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing). Note: direct fetch of the current Google doc returned 404; details are from search summaries and the older-dated pages.
- Mueller (Jan 2021): mobile-first indexing needs no annotation changes for separate URLs; redirecting each device type to its matching version helps. — [SEJ](https://www.searchenginejournal.com/googles-john-mueller-clears-confusion-about-mobile-first-index/392852/)
- One guide: redirect only on the entry page so users can still choose a version. Source is marketing content, lower reliability. — [digitalthriveai](https://www.digitalthriveai.com/en-ca/resources/technical-seo/redirect-mobile-devices/)

### Inferences
- GitHub Pages cannot send `Vary` or server redirects; use a small inline JS in `<head>` (feature/viewport based `matchMedia('(max-width: 768px)')` plus `pointer: coarse` rather than UA sniffing), `location.replace()` to avoid history trap, skip if user chose desktop (`sessionStorage`/query flag), and provide visible "desktop/mobile version" links. Include `<noscript>`/link fallbacks so keyboard/screen-reader/no-JS users can reach both.
- Alternative lower-risk option: one responsive URL (no redirect). Mobile is Google's primary index, so duplicate-content risk is the main downside of /m; canonical to desktop mitigates.

### Gaps
- Current Google separate-URLs page not fetched successfully; exact `media` value and any 2025-26 changes unverified. No source on Googlebot treatment of JS redirects for device switching.

## 6. GitHub Pages SPA deployment

### Takeaway
GitHub Pages serves `404.html` for unknown deep routes, so SPAs use the 404-redirect trick or HashRouter; better to ship real files for important pages.

### Cited Findings
- rafgraph/spa-github-pages: a `404.html` redirects to root carrying the path; a snippet in `index.html` (loaded before app script) restores the route. Project pages need base path adjustment. Repo notes Google changed ~2019 and no longer follows redirects in `404.html`, advising a robots.txt/other way to get pages indexed. — [rafgraph/spa-github-pages](https://www.github.com/rafgraph/spa-github-pages); [pjnalls/pages-404-fix](https://www.github.com/pjnalls/pages-404-fix)

### Inferences
- A `/m/` route could be a real static `m/index.html` (generated at build) instead of relying on 404 fallback, which also keeps it crawlable (returns 200, not 404).

### Gaps
- Real-device testing tools (BrowserStack, Safari Web Inspector remote debugging, Chrome remote debugging via USB) were not researched; no sources collected on that part of the objective.
