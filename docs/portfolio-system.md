# Portfolio system

## 1. Experience model

The portfolio has three user-facing destinations:

1. **Work** — the homepage hero and project grid.
2. **About** — a separate, simple personal page.
3. **Resume** — the supplied PDF in a new tab.

The homepage is a layered composition, not a collection of independent effects:

```text
semantic page content
  ├─ navigation
  ├─ editorial introduction
  └─ work grid
hero environment
  ├─ atmosphere and meadow
  ├─ animated cypress and live wind
  ├─ miniature hobby characters
  └─ Philip
prototype layer
  └─ explicit alternatives that never redefine defaults
```

The environment frames the introduction and then yields to the work. It should never delay, obscure, or visually compete with the projects.

## 2. Stable defaults

| Concern | Default |
| --- | --- |
| Environment | Restrained painterly |
| Meadow | Rolling / living |
| Atmosphere | White studio grid |
| Work layout | Two columns |
| Work handoff | Calm dissolve |
| Work placeholders | `#f2f2f2`, rounded, title only |
| Hero highlights | Off |
| Hidden top faces | Off |
| Typography | Newsreader display, Geist interface/body |

Prototype settings are exploratory state. They must remain independent and reversible. The portfolio always loads in its white, painterly default; the explicit ASCII Light/Dark choice may update the full portfolio only for the current visit and must never become the saved default. The Gradient videos experiment swaps all four Glean tile recordings together and is always off on load; Snap tiles are unaffected. Work videos stay paused until their tile enters the viewport, pause after leaving it, and do not autoplay when reduced motion is requested. Project descriptions remain in the page but are hidden by default and can be revealed with the Project subtext toggle.

`ASCII Garden · live` is the authored ASCII-rendered alternative in the Meadow + tree picker. It keeps the painterly scene as the default while reusing the dense cypress, textured rolling field, and paired light/dark palettes from the approved visual references. The garden changes only the environment artwork and palette; navigation, introduction, project, and page typography retain the portfolio's standard Newsreader and Geist system. Its light palette stays on a white grid with no solid meadow fill, and the live prototype hides every scene miniature and decorative character while retaining Philip as the interactive cursor pet. Choosing Dark applies the same dark paper, warm ink, quiet grid, and surface palette across Work, About, Play, and case studies during the current visit; reloading restores the white painterly default. Live wind bends the canopy row by row, deterministically turns edge glyphs over, and accepts Philip's directional gust through the shared cypress event. The hero-to-work handoff remains owned by the existing interaction system.

Philip's visibility follows the meadow's rendered presence, not the hero section's document bounds. He disappears once the meadow has dissolved, stays absent throughout Work, and returns when scrolling restores the meadow.

## 3. Data and rendering ownership

`app/projects.ts` is the content source of truth. Components should render that data rather than duplicating project names, order, links, or metadata. Company grouping lives in `ProjectGrid`; card content lives in `ProjectMockup`; case-study storytelling lives in the shared slug renderer.

The default homepage should remain server-renderable. Client components are reserved for interactions that genuinely need pointer, scroll, time, or weather state.

## 4. Visual language

- White space is structural, not empty decoration.
- Text color is the warm gray system ink (`#65625f` family).
- Grid lines stay subtle and disappear on case-study pages.
- Work tiles are quiet containers for future screenshots. A compact title sits below each tile; one-line descriptions are hidden by default. The homepage shows four Glean projects followed by two Snap projects. Until a real cover is supplied, keep the tile substantial and light gray.
- Project imagery should use `object-fit: contain`; never crop supplied work.
- Use color sparingly for real brand marks and explicit interactive affordances.

## 5. Interaction boundaries

- Hero interactions may react to pointer movement and local weather only while the hero is visible.
- Scrolling down should make the meadow, tree, characters, and Philip give way smoothly while work rises into attention.
- Returning upward reconstructs the same scene without random reflow.
- Philip's state changes are intentional events: following, idle huffing, target interaction, or brief reaction. Pointer speed alone is not a state transition.
- Hobby words release their matching miniature; they remain real buttons with accessible labels.

## 6. Performance and accessibility

- Prioritize legible HTML before enhancement.
- Avoid layout shifts: reserve aspect ratios for project tiles and environment assets.
- Pause offscreen animation and reuse shared listeners/state owners.
- Prefer transform and opacity for movement; avoid blur-heavy or layout-triggering animation.
- Honor `prefers-reduced-motion` with static or short-fade alternatives.
- Every navigation item and interactive word must work by keyboard and retain visible focus.
- A weather failure must leave a complete, calm static scene.

## 7. Regression strategy

Automated checks protect durable intent, not implementation trivia. They should cover:

- route and navigation inventory;
- typography ownership;
- default environment and prototype defaults;
- project names, order, company grouping, and external links;
- placeholder tile visibility and cascade precedence;
- case-study background and structure;
- interaction boundaries and reduced-motion fallbacks.

Visual changes still require rendered verification because source-level assertions cannot prove final layout or CSS cascade behavior.

## 8. Decision discipline

When a new request conflicts with an older experiment, the newest explicit preference wins. Remove superseded behavior rather than stacking another override. Update the system contract when the preference should survive future work.

## Living terrain

The painterly default now includes thousands of fine grass blades sampled from the rolling terrain's opaque green pixels. Roots and colors follow the supplied hill exactly, with perspective-scaled blades and the same image registration. Grass and cypress share a spatial wind field driven by the existing Alamo Square weather observations; the canopy responds with slower branch inertia and finer foliage groups. Keep the white studio grid and existing composition. Grass remains isolated from the flat and alternate art styles. Both renderers suspend animation when paused, offscreen, in a hidden tab, or under reduced motion; the original terrain remains a complete fallback.
