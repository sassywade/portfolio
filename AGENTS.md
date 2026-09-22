# Portfolio agent contract

This file is the operational source of truth for anyone changing the portfolio. Optimize for restraint, continuity, and easy verification.

Use `design.md` as the visual and interaction north star. Use `docs/portfolio-system.md` for architecture and system behavior.

## Product intent

The site should feel personal, calm, editorial, and lightly playful. The work must remain the focus. Prefer the smallest complete change. Do not add explanatory copy, decorative UI, arrows, captions, badges, sections, or animation unless Neel explicitly requests them.

## Editorial voice

Write with the restraint of Typehug and the continuity of Torph: make a small space do useful work, and let language change without breaking the reader’s sense of place. Prefer short, concrete sentences and active verbs. Put the human action before the product language. Keep one idea per sentence, remove throat-clearing phrases and stacked qualifiers, and let specific outcomes carry the weight. Headings should be easy to scan and end cleanly; paragraphs should wrap naturally without stranded one-word endings. When a label or status changes, keep its grammatical shape and anchor words stable. Use conversational language that sounds like Neel speaking, with quiet confidence instead of marketing claims. Apply this voice to homepage copy, About copy, project summaries, case studies, captions, metadata, interface states, and any future text added to the portfolio.

## Non-negotiable defaults

- Homepage navigation uses the shared top header with the `Neel Saswade` wordmark and `Work`, `Photo`, and `About`. Keep the current introduction and meadow, with the breeze and time readout at the bottom right of the meadow. Other pages retain the same shared header. Work scrolls to `#work`; Photo opens `/photography`, the dedicated masonry gallery. Play and Resume are not in the high-level navigation yet.
- There is no archive section, promotional footer, or contact/social cluster.
- The homepage background is #F5F5F4 with the subtle studio grid, which fades away before Work.
- The default environment is the restrained painterly rolling Alamo Square meadow.
- Newsreader is for the homepage name, case-study titles, and editorial display moments. Geist is for navigation, body copy, metadata, controls, labels, and project titles. Geist Mono is only for code-like or ASCII artwork.
- Work is an inline editorial sequence with titles and metadata above black media placeholders and summaries below. Preserve the existing Reveal entrance and hero handoff. A sticky project rail tracks the section in view; hide the rail below 1080px instead of showing mobile navigation.
- The homepage shows five major sections: Proactive intelligence, Homepage redesign, Artifacts, Growth, and Web3 at Snap (combining Treasure and NFTs as Lenses). Work links jump to sections rather than individual case-study pages.
- Until new assets arrive, use black rectangles. Split compositions scale from a 1145×500 canvas: 708×500 beside two 417×240 panels with 20px gaps. Single media uses 1145×550; Growth uses three columns and Snap two.
- Case studies use a plain white background, no grid, no top navigation, and a quiet narrative layout.
- Philip is optional, follows only in the hero, disappears after the hero, and must never change expression merely because pointer speed changes.
- The introduction ends with “In my free time” and 48×48 glass-box icon buttons in photography, cycling, backpacking order. Use the approved illuminated artwork while each actor is active, driven by that actor's phase. The photographer is already present on load; clicking its icon replays the drop-and-shoot sequence. Keep accessible labels and visible keyboard focus.
- Every actionable element uses only Cuelume's global Declarative profile: `tick` on hover and the `press`/`release` click pair. Do not add custom cue overrides.

## Architecture map

- `app/page.tsx`: homepage composition only.
- `app/projects.ts`: canonical project content, order inputs, covers, and case-study narratives.
- `app/work-sections.tsx`: homepage project sections; `app/work-nav.tsx`: sticky section navigation.
- `app/project-card.tsx`: legacy card rendering.
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
