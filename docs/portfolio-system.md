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

The painterly meadow's live weather is a compact, right-aligned white Geist readout at the bottom right: breeze summary above local San Francisco time and wind details. Keep the alternate environment treatments intact.

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

The default rolling painterly meadow is now made entirely of generated grass. A dense baked layer of short blades supports the moving tips; both use the reference image only for root placement and color sampling. Hide the reference image after the blade field is ready, retaining it only as a loading/error/no-JavaScript fallback. The Grass meadow toggle in the prototype picker switches between this grass-only field and the original image with no grass overlay. Both modes retain the cypress. The toggle is on by default, visit-local, and applies only to the rolling painterly scene.

Grass blades are 30% shorter than the initial grass-only study. In rolling grass mode the cypress is raised 8px so its trunk remains legible. On each homepage mount, the brief tree welcome gust sends one outward-traveling wave through the grass, including in already breezy weather. Respect reduced motion and hidden/offscreen playback. Grounded photographers, hikers, and cyclists press down the actual blades at their contact points; a bounded trail recovers over 1.9 seconds, using the existing grass loop and localized redraws of the baked turf. Image-only mode remains unaffected.

The welcome ripple now bends the dense turf as well as the fine blades, with a stronger, narrower traveling pulse. On fine-pointer devices, entering the actual grass silhouette with the cursor or visible Philip activates grass blowing: Philip follows at a closer distance and keeps his blowing expression while the cursor steers a local patch. Direction comes from pointer travel, not pointer speed. The patch bends actual turf blades, eases away on exit, and never activates over the white sky or in image-only mode. Reduced motion, hidden tabs, and the hero handoff deactivate it.

Miniature ground contact sits 4px lower in the ready grass-only meadow, for the photographer and hiker feet and cyclist tires. Apply the inset to terrain tracking so landing, movement, and contact flattening remain aligned; image-only and flat meadow placement stay unchanged.

The current welcome motion supersedes the dramatic ripple: a soft gust crosses the visible viewport from left to right over 3.2 seconds, with a broad 1.45-second rise and release at each location. The tree receives its welcome gust only when that traveling wind reaches its horizontal position. Cursor contact is a small, low-strength brush (38px by 24px falloff) that relaxes when movement stops. Grass no longer activates Philip's blowing expression or closer follow mode; his existing independent behavior remains.

Grass contact patches must never reveal rectangular seams: copy the baked turf at native backing-pixel scale, align replacement clip edges to those same pixels, and redraw rows in their original back-to-front order.

The cypress uses 16 articulated trunk, limb, and smaller bough groups. Boughs inherit their supporting branch's movement with lighter local flex; 768 fine foliage groups respond to the same spatial wind. Smooth mesh weights and interpolated foliage motion keep branch junctions and leaf patches continuous. Keep the existing single renderer loop, visibility suspension, and reduced-motion behavior.

Opened Life photos gently tilt as a complete film print toward a fine mouse pointer (up to 6 degrees, 1400px perspective), returning to neutral on leave, close, resize, or focus loss. The tilt wrapper keeps the existing entrance/exit independent. Touch and reduced-motion views stay still; thumbnails and photo navigation remain unchanged.

Opened Life prints have a restrained laminated sheen that follows the existing pointer tilt, an off-white paper edge, and Permanent Marker captions. Center the caption vertically and horizontally within the entire lower border, with no gap above that border. Keep sheen subtle enough to preserve photo detail and static under reduced motion.

The painterly cypress has no silhouette drop shadow. Its contact and diffuse canopy shade are baked into both grass layers at the rendered trunk position, following the hill contour and responsive layout. Broken shading and a few slightly taller root tufts ground the trunk without covering it; finer crest blades and restrained brightness variation connect the grass texture to the canopy. Interaction redraws reuse these blade colors, preserving the shade without extra overlay shapes or animation loops.

The tree shade must remain visible at large desktop sizes: scale both its width and depth from the rendered canopy width, accounting for the meadow's vertical transform. Use a stronger narrow root contact inside a broad, broken olive shadow, rather than fixed-pixel shading that disappears at larger scales.

Grass wind response uses a shared 65-point damped spring field, interpolated across the meadow, with stronger wind susceptibility and varied blade flexibility. The dense crest animates alongside the fine foreground blades, using bounded redraw strips in the existing loop. Roots stay fixed; tips curve and settle elastically. Cursor brushing remains gentle and motion still pauses offscreen or under reduced motion.

Grass elasticity tuning: retain the spring recovery and moving crest, but keep the ambient bend around half the initial elastic version (wind gain 1.10, blade bend gain 0.95). The welcome gust is softened to 0.8 in the spring field. Avoid the strongly swept-over look.

The painterly weather readout uses Geist at 13–15px for the summary and 12–14px for details. Counteract the meadow's vertical artwork scale on the readout so the typography retains its normal proportions.

Life captions now use the site's Newsreader serif instead of the marker font. Size the opened paper to the photo's natural aspect ratio: auto image dimensions bounded by viewport width and height, with no inner letterbox or cropping. Retain the outer paper border, centered caption, sheen, and tilt.

The homepage “Neel Saswade” name uses upright Newsreader, not italics.
