# Portfolio agent contract

This file is the operational source of truth for anyone changing the portfolio. Optimize for restraint, continuity, and easy verification.

Use `design.md` as the visual and interaction north star. Use `docs/portfolio-system.md` for architecture and system behavior.

## Product intent

The site should feel personal, calm, editorial, and lightly playful. The work must remain the focus. Prefer the smallest complete change. Do not add explanatory copy, decorative UI, arrows, captions, badges, sections, or animation unless Neel explicitly requests them.

## Non-negotiable defaults

- Navigation is `Work`, `About`, `Play`, `Resume`. Work scrolls to `#work`; Play opens its own lightweight project page; Resume opens the supplied PDF in a new tab.
- There is no archive section, promotional footer, or contact/social cluster.
- The homepage background is white with the subtle studio grid.
- The default environment is the restrained painterly rolling Alamo Square meadow.
- Newsreader is for the homepage name, case-study titles, and editorial display moments. Geist is for navigation, body copy, metadata, controls, labels, and project titles. Geist Mono is only for code-like or ASCII artwork.
- Work is a two-column grid by default. Each project title sits below and outside the tile. One-line descriptions remain available through the prototype picker but are hidden by default. Unfinished projects remain substantial light-gray rounded tiles; never leave title-only empty space.
- The homepage shows six projects total. Glean order: Homepage redesign, Proactive intelligence, Artifacts, Growth. Snap follows with Treasure and NFTs as Lenses.
- Every supplied Glean recording fills its tile edge to edge. Snap phone mockups remain inset and fully visible.
- Case studies use a plain white background, no grid, no top navigation, and a quiet narrative layout.
- Philip is optional, follows only in the hero, disappears after the hero, and must never change expression merely because pointer speed changes.
- The photographer is already present on the meadow when the homepage loads; clicking `photograph SF` replays the drop-and-shoot sequence.
- Every actionable element uses only Cuelume's global Declarative profile: `tick` on hover and the `press`/`release` click pair. Do not add custom cue overrides.

## Architecture map

- `app/page.tsx`: homepage composition only.
- `app/projects.ts`: canonical project content, order inputs, covers, and case-study narratives.
- `app/project-card.tsx`: company grouping and card links.
- `app/project-mockup.tsx`: intentionally minimal work-tile interior.
- `app/hero-meadow.tsx`: owner of environment/prototype state and hero-to-work handoff.
- `app/meadow.tsx`, `app/cypress-tree.tsx`, `app/alamo-weather.tsx`: visual environment primitives.
- `app/smiley-cursor.tsx`: Philip's behavior. Keep this isolated from page content.
- `app/site-header.tsx`: shared navigation.
- `app/case-studies/[slug]/page.tsx`: shared case-study renderer.
- `app/globals.css`: visual implementation. Later declarations win; inspect the final matching rule before editing.
- `tests/rendered-html.test.mjs`: executable product invariants.

## Change protocol

1. Pull or inspect the latest source before editing; concurrent work must not overwrite newer preferences.
2. Identify the single owner component and all matching CSS declarations. Use `rg` and inspect the last declaration in the cascade.
3. Preserve unrelated user changes. Make one surgical patch; avoid broad rewrites.
4. When a preference becomes durable, update this contract or `docs/portfolio-system.md` and add a focused regression assertion.
5. Run `npm test`.
6. For visual or interaction changes, verify the actual rendered page at desktop and mobile. Check computed styles when cascade order matters.
7. Publish the exact tested commit through Sites. Rebase on the latest remote before pushing, then rerun tests.

## Resource and quality rules

- Add no dependency for an effect that CSS or existing code can handle.
- Keep animation calm and interruptible. One animation-frame loop per visible interactive system; stop work when the hero is offscreen.
- Honor reduced motion. Keep keyboard focus visible and controls labeled.
- Use responsive `clamp()` values and existing layout tokens before adding breakpoints.
- Keep generated assets out of React source and store final assets under `public/`.
- Prototype controls may expose alternatives, but prototypes must not silently alter the default experience.

## Definition of done

A change is done only when the requested behavior is visible, unrelated behavior is preserved, tests pass, the relevant viewport is checked, and the deployed version matches the tested commit.
