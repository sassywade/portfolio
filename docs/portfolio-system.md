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

### Editorial voice

Portfolio copy follows a Typehug- and Torph-inspired rule: short, concrete sentences; active verbs; one idea at a time; intentional line endings; and continuity when text changes state. Lead with the human action, cut throat-clearing phrases, and use specific outcomes instead of broad claims. Keep headings scannable and paragraphs conversational. When a label or status changes, preserve its grammatical shape and anchor words so the interface feels coherent. This applies to new homepage, About, project, case-study, caption, metadata, and interface-state copy.

- White space is structural, not empty decoration.
- Text color is the warm gray system ink (`#65625f` family).
- Grid lines stay subtle and disappear on case-study pages.
- Work tiles are quiet containers for future screenshots. A compact title sits below each tile; one-line descriptions are hidden by default. The homepage shows four Glean projects followed by two Snap projects. Until a real cover is supplied, keep the tile substantial and light gray.
- Project imagery should use `object-fit: contain`; never crop supplied work.
- Use color sparingly for real brand marks and explicit interactive affordances.

## 5. Interaction boundaries

- Hero interactions may react to pointer movement and local weather only while the hero is visible.
- Scrolling down should make the meadow, tree, characters, and Philip give way smoothly while work rises into attention.
- Direct navigation to `/#work` starts at Work without replaying the meadow handoff; scrolling back toward the hero restores the normal transition.
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

Opened Life photos gently tilt as a complete film print toward a fine mouse pointer (up to 3 degrees, 2000px perspective), returning to neutral on leave, close, resize, or focus loss. The tilt wrapper keeps the existing entrance/exit independent. Touch and reduced-motion views stay still; thumbnails and photo navigation remain unchanged.

Opened Life prints have a restrained laminated sheen that follows the existing pointer tilt, an off-white paper edge, and Permanent Marker captions. Center the caption vertically and horizontally within the entire lower border, with no gap above that border. Keep sheen subtle enough to preserve photo detail and static under reduced motion.

The painterly cypress has no silhouette drop shadow. Its contact and diffuse canopy shade are baked into both grass layers at the rendered trunk position, following the hill contour and responsive layout. Broken shading and a few slightly taller root tufts ground the trunk without covering it; finer crest blades and restrained brightness variation connect the grass texture to the canopy. Interaction redraws reuse these blade colors, preserving the shade without extra overlay shapes or animation loops.

Keep the original painterly cypress artwork and silhouette. Its bark has only a slight contrast reduction to sit with the meadow. Smaller boughs and foliage respond visibly to the shared wind, with locally phased leaf motion and a steady trunk; retain the existing visibility and reduced-motion suspension.

The tree shade must remain visible at large desktop sizes: scale both its width and depth from the rendered canopy width, accounting for the meadow's vertical transform. Use a stronger narrow root contact inside a broad, broken olive shadow, rather than fixed-pixel shading that disappears at larger scales.

Grass wind response uses a shared 65-point damped spring field, interpolated across the meadow, with stronger wind susceptibility and varied blade flexibility. The dense crest animates alongside the fine foreground blades, using bounded redraw strips in the existing loop. Roots stay fixed; tips curve and settle elastically. Cursor brushing remains gentle and motion still pauses offscreen or under reduced motion.

Grass elasticity tuning: retain the spring recovery and moving crest, but keep the ambient bend around half the initial elastic version (wind gain 1.10, blade bend gain 0.95). The welcome gust is softened to 0.8 in the spring field. Avoid the strongly swept-over look.

The painterly weather readout uses Geist at 13–15px for the summary and 12–14px for details. Counteract the meadow's vertical artwork scale on the readout so the typography retains its normal proportions.

Life captions now use the site's Newsreader serif instead of the marker font. Size the opened paper to the photo's natural aspect ratio: auto image dimensions bounded by viewport width and height, with no inner letterbox or cropping. Retain the outer paper border, centered caption, sheen, and tilt.

The homepage “Neel Saswade” name uses upright Newsreader, not italics.

The About page ends with the Life photo gallery. Do not show an Experience section or employment-history list.

Opened Polaroids have no glimmer or moving sheen overlay. Keep the paper finish, Newsreader caption, and gentle tilt.

The prototype picker includes an opt-in “Quiet sidebar” page layout and the unchanged “Current portfolio” default. Quiet sidebar hides the homepage introduction and header, uses left-side Newsreader navigation to existing destinations, places bike/camera/hiking controls at the top, and shows one selected miniature at a time. Selecting another cancels the previous actor's animation; switching back restores the default photographer. Philip is temporarily suppressed without changing the stored preference. Weather moves to the upper right. The prototype panel is wider for comparing options.

The prototype picker also includes an opt-in “Visitor bike” study. It is deliberately absent from the default portfolio. The study stores one visitor bike configuration in browser-local storage, with a bike name, rider signature, frame, wheels, tires, frame color, and frame decal. Its authored option catalog is the temporary stand-in for future supplied assets: aero, climbing, commuter, vintage, Brompton, gravel, and time trial frames; alloy, 30mm/50mm/60mm carbon, and disc wheels; high-performance, road, chunky gravel, and commuter tires. Keep the study local and non-tokenized until the visual system and public Peloton experience are explicitly promoted.

`/peloton` is currently a local preview only. It shows the current browser's bike beside authored sample bikes and includes the first race feedback loop. Do not present these samples as a real public visitor archive; the D1-backed public Peloton comes after the supplied bike assets and ownership model are approved.

Quiet sidebar matches the original introduction’s responsive text size (clamp(16px, 1.32vw, 19px)) on desktop and mobile, including navigation, both weather lines, work text, and prototype controls. The classic layout retains its existing typography.

Grass readability and performance: skyline blades are 30% longer and slightly narrower; fine moving blades are about 34% longer with fewer samples. Dense interior turf remains cached on its own canvas. A separate canvas draws preselected skyline blades and fine tips on each display frame. Only cursor and character contact patches rebuild the interior, using spatial buckets and the original paint order; the passing welcome breeze reads through the skyline and moving tips. Playback changes must not regenerate the terrain. Keep native-pixel restoration, responsive registration, tree shading, and hidden/offscreen/reduced-motion suspension.

The default homepage uses the shared top header with the Neel Saswade wordmark and Work, Photo, and About links while keeping the breeze/time readout tucked into the bottom-right of the meadow. Photo opens the dedicated `/photography` gallery; Play and Resume are intentionally not in the high-level navigation yet. Keep the current introduction, inline hobby words, photographer, meadow, and Philip behavior. Other pages retain their shared header. The quiet layout controls remain opt-in only.

The homepage header must preserve the introduction's original desktop vertical position. Above 700px, retain the header's exact layout space (30px top padding plus its responsive 1.05 line height); do not move the introduction upward when changing navigation.

Top-right weather typography is deliberately smaller than navigation: breeze summary 12–14px, time and wind details 11–12px, responsive on desktop and mobile.

Desktop sidebar navigation follows the supplied Figma reference: 20px Newsreader, 20px line height, and 16px gaps (36px row rhythm). Keep the restored introduction position.


## Inline work sections (current)

The Growth starter-kit image fades from transparent at its own top edge to fully opaque at 20% image height. Keep this mask attached to the translated image so its lowered position cannot expose a hard horizontal crop; retain its size and offset.

Proactive Intelligence’s upper-right tile uses updated_pop_UI.png with its baked drop shadow, centered at 86% tile width on #ECECEC with clipped overflow and 12px corners. The wider image includes shadow padding, making the visible popup only slightly larger. Preserve the Docs and email fragments around the complete Slack draft; keep the main video and lower-right black placeholder unchanged.

The Growth starter-kit mock sits slightly lower: translate its image downward by 5% of its own height. Keep its size, horizontal inset, tile, and top fade unchanged.

Growth's right panel now uses the supplied cropped UI.png checklist, at 94% panel width with a 6% left inset and its top aligned to the tile. Preserve its baked shadow and bottom profile. A static 18%-height top gradient fades from the #ECECEC tile to transparent before reaching the checklist text. This replaces the empty right panel; the original and alternate center videos remain unchanged.

Growth's left 271×500 panel now stacks the supplied onboarding screens in order: Welcome, Extension, Bookmark. Keep the complete 980×592 PNGs and their baked shadows at 90% panel width, vertically centered as a group on #ECECEC. The right panel stays empty in the same gray until its assets arrive. Preserve the centered video and its prototype toggle.

The first prototype-picker control is Alternate Growth video, off on each page reload. It swaps only the center Growth video and poster, leaving the original as the default. The alternative crops alt_growth.mov inside its border at x=20, y=16, 1556×1380, encoded to 1126×1000. Both versions reuse offscreen pause and reduced-motion posters. The choice is visit-local and never saved.

Growth uses a centered 563×500 video between two 271×500 black placeholders on the 1145×500 canvas, with proportionally scaled 20px gaps. This supersedes the equal-column Growth layout below. The supplied growth_animation.mov is cropped inside its border (1556×1380 at x=8, y=8) and encoded at 1126×1000. Reuse muted inline playback, offscreen suspension, and a content poster for reduced motion.

On desktop with a fine pointer and normal motion, the first downward wheel gesture from the top of the homepage lands on Proactive Intelligence using the existing 450ms centered navigation. Capture only that gesture and its same-direction momentum until a 140ms input pause; never let it skip the first project. Upward reversal, keyboard, pointer, touch, resize, and preference changes interrupt immediately. Subsequent project scrolling retains intensity-aware native travel. Reduced motion and touch remain native.

The two Snapchat image panels use #ECECEC; the surrounding homepage paper remains #F5F5F4.
All four Snapchat phones share one nonshrinking size derived from the full composition: height min(24cqw, 440px), width at 576:1156. The media wrapper is their shared inline-size container. No panel-specific width cap or height override may shrink Treasure independently of the Lens. Contain preserves the original artwork; keep all four tops and bottoms aligned.
The Snapchat Work metadata logo and label are vertically centered with an 8px gap and no baseline transform on the logo.

The homepage now presents five major project sections in this order: Proactive intelligence, Homepage redesign, Artifacts, Growth, and Web3 at Snap. This supersedes the card-grid defaults above. `featuredWork` in `app/projects.ts` owns their copy, order, and media layouts. `WorkSections` renders titles and metadata above black placeholders, with summaries below. `WorkNav` uses same-page anchors and marks the section at the reading position; its desktop rail stays within Work and is hidden below 1080px when the left navigation no longer fits. Existing Reveal entrances and hero handoff remain unchanged. Split layouts scale from 1145×500, with a 708×500 main panel, two 417×240 panels, and 20px gaps. A single-panel layout uses 1145×550. Growth has three equal panels and Snap two unequal panels. Await new assets; do not reinsert previous covers or recordings. Legacy case-study URLs redirect to matching homepage anchors.

The desktop Work rail starts level with the first mockup, below the Selected work label and project heading. Its sticky resting offset matches the 90px section anchor offset plus the responsive heading line and 26px media gap, rather than a viewport-height percentage. Hide the rail below 1080px.

The Work rail keeps that single CSS sticky offset across every project. Never recalculate its position from the active project's height; only the active indicator moves between labels.
The rail's selected label and dot use dark charcoal #43413e; unselected labels use lighter warm gray #999691. Hover uses the selected charcoal without changing layout.

The desktop Work navigation uses 14px Geist and appears once per visit after the first mockups reach 55% of viewport height. Links fade and rise 6px over 600ms with a 150ms initial delay and 50ms stagger. Deep links show navigation immediately; reduced motion uses only a short fade. Smaller screens have no project navigation rail.

All inline Work media placeholders have a 12px corner radius at every viewport size.

The homepage studio grid fades away with the meadow handoff, using the existing dissolve progress to fade in a plain paper layer behind page content. It is fully gone before Proactive Intelligence; all Work sections sit on plain paper. Scrolling back restores the hero grid. Reduced motion follows the existing immediate handoff, and no extra animation loop is added.

Do not display a Selected work heading above the projects. Retain the existing opening spacing and an accessible Work heading.

Work preserves native wheel scrolling in both directions. On desktop, the first downward scroll from the hero always lands on the first fitting project over a calm 900ms ease-in-out handoff. After that opening gesture, native momentum pauses for 140ms before the next fitting project may center over 560ms. The capture radius scales down with peak gesture speed: gentle input captures within 56% of the project spacing (capped at 60% of the viewport), while strong input captures only within 20% (capped at 20% of the viewport). A gentle gesture beginning within 80px of a center and traveling at least 18% toward its neighbor commits to that neighbor. Normalize pixel, line, and page wheel units; reset intent on pauses and reversals. No wheel event is blocked and there is no per-gesture project limit. New wheel, keyboard, touch, pointer, resize, or preference input cancels assistance immediately. Upward escape above the first center freely reaches the hero; tiny adjustments, tall sections, nested scrollers, zoom, and reduced motion remain native. Touch uses proximity snapping with normal pass-through. Project links retain interruptible centered navigation, and the rail never repositions between projects.

Work metadata keeps a 6px gap between the Glean logo and its text label.

The Work rail uses one shared active dot that glides between labels over 250ms with the shared ease-in-out curve. It follows measured link positions on desktop, retargets smoothly, and moves immediately for reduced motion and focused keyboard navigation.

Proactive Intelligence uses the supplied updated_psychic.mov in its main panel. The encoded MP4 crops the 1454×1040 recording to its white 1416×1000 content at x=20, y=22, matching 708×500 at 2× resolution with no black border. It uses the existing muted, inline looping playback that pauses offscreen and shows an updated content poster for reduced motion. Other panels remain black placeholders.

The homepage paper background is #F5F5F4 across the hero and inline Work, including the grid-fade layer. Video pixels remain part of the supplied asset.

Each complete project (heading, media, and summary) enters once with a 250ms fade and 6px rise using the shared ease-out curve. The existing Reveal observer retains visibility afterward, including when scrolling back. Do not stagger individual media panels or fade projects when they leave view. Reduced motion leaves the composition static. Scroll navigation remains independent of this entrance.

The shared soundscape gives the first portfolio arrival one quiet, session-local cue: a low meditative hum followed by a soft filtered wind swell. It is synthesized in the browser, waits for the first user gesture when autoplay is blocked, and stays silent when reduced motion is preferred.

Project summaries stay left-aligned beneath their media and span the full mockup composition width, with normal text wrapping and no character-based width cap. Small screens use the available width.

The inline Work wrapper stays transparent, including the quiet layout. Only the full-page paper layer removes the grid during the meadow handoff; never paint a bounded background on the rising Work container, which would cover the meadow as a rectangular bar.


## Photography

`/photography` is the dedicated photo gallery, reached through Photo in the shared header. Its layout follows the spacious, unframed masonry rhythm of gallery.jessyin.world: five columns on desktop, two on phones, and mixed portrait, square, and landscape proportions. Keep the 24 slots black until photographs arrive. `app/photography/photography-gallery.tsx` owns the slots and focus interaction; its CSS module isolates the layout. A native modal dialog expands the selected photograph from its gallery position into the viewport center over 280ms using the shared ease-in-out curve, then reverses to its slot. Escape, reduced motion, and keyboard activation are immediate. Preserve focus restoration, native modal focus containment, scroll locking, and global Declarative cues.


About's Life photographs reuse the Photography page's centered viewer through `app/photo-viewer.tsx`. Keep the film thumbnails and their resting rotations, but remove hover/focus movement and all visible photo captions. The enlarged view contains only the complete photograph on plain paper, with no film border, pointer tilt, or text; Close and Escape restore the original thumbnail and focus. Both galleries share the 280ms reversible transition and reduced-motion/keyboard behavior. This supersedes the earlier opened-Polaroid caption and tilt directions.

The Life strip contains 11 photos. Omit the two-person Cathedral hiking photo (`high-country-friends.JPG`); keep the remaining strip centered through its content-sized desktop layout.

The Photo page has no visible Photography heading; the gallery follows the shared header directly.


## Searchable photography gallery

The Photo page uses all 141 supplied photographs from the Documents portfolio photos folder. WebP thumbnails and larger viewing copies live in `public/photography`; `app/photography/photos.json` owns dimensions, descriptive alt text, subject/location/style tags, color families, and palettes. The quiet search field uses normalized token matching with synonyms, including bike/bicycle and Japanese/Japan. All search terms must match; clear restores the entire gallery. No tags or category headings are printed over the photos.

Color is the default cluster order. Photography style is an alternative in the Photo prototype picker and the shared meadow prototype picker; the session-local choice carries between pages. Both orderings place similar photos near each other in a shortest-column masonry layout.

Search settles after 170ms of typing. Visible non-matches fall downward with a small rotation over roughly 460–535ms; retained photos move toward their new positions over 560ms. This deliberately slower search motion is explicitly requested, including keyboard typing. Snapshot the current animated positions before retargeting, animate only transforms/opacity, and avoid animating offscreen photos. Reduced motion changes results immediately. Hidden results leave the keyboard and accessibility order; announce the result count quietly. The existing shared centered photo viewer is unchanged.

Home, Photo, and About share the warm paper background `#F5F5F4`, including Photo and About viewer backdrops. Scope this color to these pages so case studies retain their white background.

The Photo search bar spans the full gallery width and aligns with its left and right edges at every viewport size.

The empty, unfocused Photo search field rotates “Search bikes,” “Search city,” and “Search sunsets” every three seconds, with 200ms fades and small vertical slides. Keep the accessible label “Search photos.” Focusing shows the static input placeholder; typing hides the suggestions. Pause cycling offscreen, in a hidden tab, or while viewing a photo. Reduced motion keeps “Search bikes” still.

On Photo page arrival, keep the temporary server column layout hidden until client measurements and the saved grouping resolve before paint. Restoring preferences must never capture positions or trigger the search/reorder animation. Reveal the final gallery with a 200ms opacity-only fade; thumbnails reserve their dimensions and fade in on load, including cached images. Reduced motion makes both reveals immediate.
