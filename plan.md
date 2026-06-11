# Interactive Course Concept Explorer Plan

## Direction (v2)

The v1 baseline shipped five working modules, but three of them (dev lifecycle,
web architecture, AI/ML lifecycle) share the same interaction pattern: a row of
step buttons, a progress bar, and a detail panel. v2 gives each module an
interaction model whose *shape matches the concept*:

| Concept | Shape of the idea | v2 interaction model |
| --- | --- | --- |
| AI/ML lifecycle | A continuous cycle | Circular SVG diagram with a token that travels the loop |
| Dev lifecycle | A pipeline that loops via feedback | Horizontal pipeline a "feature ticket" travels, looping back as versions increment |
| Web app architecture | A round trip through layers | Animated request/response journey with the payload transforming at each hop |
| Platform tradeoffs | A responsibility spectrum | Shared-responsibility matrix: on-prem → IaaS → PaaS → SaaS, ownership as example badges |
| AI & ML in libraries | Expert vs. practitioner use cases | Categorized project picker (LIS expert / practitioner) plus risk review |

Decisions confirmed with the user:

- Add the `motion` (framer-motion successor) library for orchestrated animation.
- Redesign all five modules, not just the three lookalikes.
- Primary context is **self-paced study**: favor exploration and
  mobile-friendly layouts over projection-scale visuals.
- **Revised 2026-06-10:** no self-check quizzes anywhere on the site. The
  shared `SelfCheck` component was removed along with the AI/ML "What now?"
  check and the planned web-app failure-diagnosis, platform scenario-card, and
  GenAI risk-triage activities. Modules teach through visualization and
  exploration instead.

## Completed Baseline (v1)

- [x] Project scaffolding: Next.js, Tailwind 4, Biome, shadcn/ui, lucide-react.
- [x] Shared concept model and content in `src/lib/concepts.ts`.
- [x] Concept navigation, icon components, and interactive-module router.
- [x] First-pass interactive modules for all five concepts.
- [x] Course dashboard home page with five concept cards.
- [x] Dynamic route `src/app/concepts/[slug]/page.tsx` with prev/next links,
      `notFound()`, static params, and per-concept metadata.
- [x] `bun run lint` passing on baseline.

## Shared Infrastructure for v2

- [x] Install `motion` and confirm it works with the App Router client
      components (`motion/react` import path).
- [x] Add a small shared `useReducedMotion`-aware animation convention:
  - [x] All autoplaying or traveling animations pause/disable under
        `prefers-reduced-motion`; the same information must be readable
        statically (active-state highlighting still works without motion).
  - [x] Every animated sequence also has manual step controls; autoplay is
        opt-in (a Play button), never on mount.
- [x] ~~Add a shared "self-check" pattern~~ — built, then removed on
      2026-06-10 per user decision: no self-check quizzes on the site.
- [x] Keep all interactive state in component state; no `localStorage`.
- [x] Establish per-module accent palettes (already present) but vary layout
      and rhythm so the five pages no longer feel like recolors of one template.

## Module Redesigns

### 1. AI/ML lifecycle — circular cycle diagram

The defining fix: this must visually *be a cycle*, not a left-to-right row.

- [x] Replace the button-row layout with an SVG ring:
  - [x] Six stage nodes (Frame, Data, Model, Evaluate, Deploy, Monitor)
        positioned around a circle with directional arc arrows between them.
  - [x] The Monitor→Frame arc is visually distinct (dashed or accented) and
        labeled "revise" to show the loop closing — monitoring feeds the next
        iteration rather than ending the project.
  - [x] An animated token (small dot/badge) travels the arc from the previous
        stage to the selected stage; stage nodes are buttons (keyboard
        focusable, `aria-pressed`).
  - [x] A cycle counter ("Iteration 1 → 2") increments when the student
        advances past Monitor back to Frame, reinforcing that real projects go
        around multiple times.
- [x] Detail panel (center of ring on desktop, below on mobile) keeps the
      existing question/detail copy for the subject-heading example.
- [x] ~~Hands-on element — "What now?" scenario check~~ — removed 2026-06-10
      (no self-checks on the site).
- [x] Mobile layout: ring scales down with abbreviated labels, or falls back
      to a vertical loop (top-to-bottom with a return arrow) below ~400px;
      verify legibility either way.

### 2. Development lifecycle — SDLC cycle (IBM seven phases)

- [x] Circular diagram matching the AI/ML interaction pattern (cyan palette).
- [x] Seven IBM SDLC phases: Planning, Analysis, Design, Coding, Testing,
      Deployment, Maintenance — with library catalog renewal example copy.
- [x] Maintenance→Planning loop arc labeled "iterate" (iterative SDLC).
- [x] Sidebar shows actor, IBM-style deliverable, and phase detail per step.
- [x] Hands-on element — "Order the stages" (tap-to-order shuffle activity).
- [x] Animation controls with opt-in Play; token travels the cycle arc.

### 3. Web app architecture — animated request/response round trip

- [x] Replace the six-button row with a layered diagram: Browser → Server →
      App Logic → Database, with the response path returning Browser-ward.
  - [x] Desktop: four layer columns with a packet that animates across on
        the request leg and back on the response leg. Mobile: vertical stack,
        packet travels down then up.
  - [x] The packet's label *transforms at each hop* — `"solar power"` (typed
        search) → HTTP request → validated query → database rows → JSON
        response → rendered result list — making the data-shape changes the
        star of the visual.
  - [x] Play button animates the full round trip; Previous/Next step through
        manually; clicking any layer jumps there. Step copy from v1 is reused.
  - [x] A subtle mock catalog UI in the Browser layer updates with fake
        results when the response completes, so the round trip visibly "lands".
- [x] ~~Hands-on element — "Where did it break?"~~ — removed 2026-06-10
      (no self-checks on the site).
- [x] Enrichment pass (2026-06-10) after "too basic and rough" feedback:
  - [x] Detail panel gains a layer icon badge, a behind-the-scenes mono
        snippet per stop (`GET /catalog/search?q=…`, the SQL the app builds,
        `200 OK · application/json`, …), technology chips per layer
        (HTML/CSS/JS, routing, SQL/indexes), and an "if this layer fails"
        cue that keeps the failure-mode teaching without a quiz.
  - [x] Play now runs the round trip once and stops at the final stop
        (restarting if pressed at the end) instead of looping forever.
- [x] Click-to-explore clarity pass (user: diagram confusing when clicking
      instead of using the buttons):
  - [x] Six numbered stop buttons on the lanes make the journey's order and
        stop count visible and directly selectable.
  - [x] The packet travels through intermediate stops (keyframe path along
        the lanes) instead of flying diagonally on multi-hop jumps.
  - [x] Clicking a layer follows the journey to that layer's next visit
        (predictable rule) instead of threshold-based jumping; a caption under
        the diagram explains both click behaviors.
- [x] Confirm the flow remains readable on small screens (carryover).

### 4. Platform tradeoffs — shared-responsibility hosting spectrum

**Redesigned 2026-06-11** (user decision): the 2×2 ownership × hosting quadrant
treated "cloud" as one thing; the real teaching is the IaaS/PaaS/SaaS
distinction. The quadrant map was replaced by the canonical
shared-responsibility chart, and ownership was demoted from an axis to a
property of the examples.

- [x] Responsibility matrix (desktop): five stack layers (data & policy,
      application, runtime, OS, servers & network) × four hosting models
      (on-premises, IaaS, PaaS, SaaS); each cell reads Library or Vendor so
      the management boundary visibly slides down the stack across columns.
  - [x] Model headers are the selectors; the active column highlights with a
        sliding ring (motion layoutId), inactive columns dim.
  - [x] Mobile: model picker buttons plus the selected model's stack as a
        single labeled column.
- [x] Tradeoff chips respond to the selection: control & customization, staff
      technical effort, vendor dependence, up-front infrastructure cost —
      values chosen so adjacent models differ on at least one row (on-prem vs
      IaaS: vendor + up-front cost; PaaS vs SaaS: control + effort).
- [x] Detail panel per model: full name, plain-language description, fit
      sentence, benefits, watch points, typical providers, and **library
      examples with ownership badges** (open / proprietary / custom code) —
      e.g., SaaS shows both Alma (proprietary) and ByWater-hosted Koha (open).
- [x] "Ownership is a separate choice" strip below the spectrum: compact
      open-vs-proprietary cards plus the orthogonality point (open software
      can be delivered like SaaS).
- [x] "What stays yours" callout: the data & policy row is library-managed in
      every column.
- [x] Updated concept copy in `src/lib/concepts.ts` (summary, definition,
      example, deck label) to the spectrum framing.
- [x] Deleted `platform-quadrant-map.tsx`.
- [x] Confirm tradeoff language avoids implying one universal best choice
      (carryover).

### 5. AI & ML in libraries — field application catalog with risk review

- [x] Replace the project button row with categorized sections:
  - [x] Two groups — LIS expert (reference, patron help) and LIS practitioner
        (daily operations) — each with tappable project chips; selecting one
        opens its detail panel.
  - [x] No comparison plot; projects are organized by professional role, not
        ranked on axes.
- [x] Detail panel keeps value/risks/staff-practice content, but renders risks
      as small severity-tagged chips rather than a plain list.
- ~~Hands-on element — "Risk triage"~~ — dropped 2026-06-10 (no self-checks
  on the site).
- [x] Keep the closing copy about pairing use cases with evaluation habits.
- [x] **Quality/content pass (2026-06-11)** — user direction: quality over
      interactivity; let students explore applications that may work in the
      field.
  - [x] Expanded from five to ten projects (expert: discovery, chat, research
        summaries, readers' advisory, AI literacy instruction; practitioner:
        metadata, transcription & OCR, summarization, accessibility, archival
        description).
  - [x] Each project gained an "In practice" scenario vignette and an "In the
        field" section naming real systems (Primo Research Assistant, JSTOR's
        AI assistant, Elicit, Annif, LC Labs, Whisper, Transkribus, Ivy.ai,
        Springshare AI).
  - [x] Field-readiness rating per project — Established / Emerging /
        Experimental — shown as a badge in the detail panel, a colored dot on
        each picker chip, and a legend under the picker.
  - [x] Named tools and readiness calls need instructor review for course
        accuracy (knowledge-cutoff caveat).
- [x] **Layout pass (2026-06-11)** — user direction: maximize space usage.
  - [x] The two role groups sit side by side in distinctive containers (rose
        for LIS expert, violet for LIS practitioner — tinted backgrounds,
        matching icon badges and active-chip colors).
  - [x] Project chips show full labels instead of abbreviations.
  - [x] The detail panel moved below the groups at full width: header row with
        icon, title, readiness badge, and the value as a lead paragraph; then
        In practice / In the field / Risks / Staff practice as a four-column
        grid on wide screens (two columns on tablets, stacked on mobile).

## Remaining v1 Tasks (still open)

- [x] Update root layout:
  - [x] Replace starter metadata with course-specific metadata.
  - [x] Wrap children in `TooltipProvider`.
  - [x] Preserve `next/font` usage and App Router conventions.
- [x] Refine global styling:
  - [x] Keep shadcn variables intact.
  - [x] Tune page background, text rendering, and layout defaults.
  - [x] Ensure the app does not read as a one-note palette.
- [x] Review and tighten reusable components:
  - [x] Confirm all interactive controls are keyboard accessible (including
        the new SVG ring nodes, quadrant regions, and plot dots).
  - [x] Confirm button text wraps cleanly on mobile.

## Verification Steps

- [x] Run `bun run lint`.
- [x] Run `bun run build`.
- [ ] Start the local dev server with `bun run dev`.
- [ ] Verify the dashboard route in the browser.
- [ ] Verify all five concept routes in the browser:
  - [ ] `/concepts/dev-lifecycle` — ticket travels, artifacts accumulate,
        loop-back increments version, ordering activity works by tap and
        keyboard.
  - [ ] `/concepts/web-app-architecture` — round trip plays once and stops,
        payload labels transform, numbered stops jump correctly, multi-hop
        clicks travel along the lanes, layer clicks go to the next visit.
  - [ ] `/concepts/platform-tradeoffs` — selecting a hosting model slides the
        active-column ring, Library/Vendor cells read correctly per model,
        tradeoff chips update, ownership badges show on examples, mobile
        picker + stack works, copy avoids "one right answer" framing.
  - [ ] `/concepts/ai-ml-lifecycle` — renders as a true cycle, token travels
        arcs including Monitor→Frame, iteration counter increments.
  - [ ] `/concepts/ai-ml-libraries` — all ten project chips select,
        readiness dots match badge colors, detail panel shows value /
        in-practice / in-the-field / risks / staff practice per project.
- [ ] Check `prefers-reduced-motion`: no traveling/auto animations, all
      content still reachable and state changes still visible.
- [ ] Check desktop layout for readable diagrams and no overlapping text.
- [ ] Check mobile layout: ring/pipeline/journey fallbacks, wrapping, tap
      targets, and diagram legibility.
- [ ] Check keyboard navigation and visible focus states on all custom
      SVG/region controls.
- [ ] Confirm refresh resets all interactive state.

## Assumptions

- [ ] Students browse modules in any order, primarily self-paced on their own
      devices; mobile is a first-class layout, not an afterthought.
- [ ] No accounts, backend persistence, analytics, grading, quizzes, or saved
      progress; all interactive state resets on refresh.
- [ ] `motion` is the only new dependency; diagrams remain hand-built React,
      Tailwind, HTML, and SVG (no charting/diagramming library).
- [ ] Existing concept copy in `src/lib/concepts.ts` and module text is sound
      and carries over; v2 changes interaction and visualization, with new
      copy only where the hands-on activities require it.
