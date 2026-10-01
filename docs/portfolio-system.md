# Portfolio system

The homepage card feed uses a continuous 32-second linear loop: no snapping, settling, or per-card speed changes. Padding and pause behavior remain unchanged. Shadows stay light, using 3% contact and 5% ambient opacity. This supersedes the earlier 42-second timing below.

The Homepage redesign main mock defaults to After. Its click-controlled horizontal comparison centers the selected 20:13 screen at 76% of the tile width and leaves the other screen peeking at the opposite edge. Before uses the supplied supa_old.png at public/work/homepage-before.png; After uses the separate homepage-final.mp4 recording. The lower-left Before button selects the old screen; lower-right After returns to the redesign. Either mock is also a native button. Use a reversible 450ms transform transition with the shared ease-in-out curve; keyboard activation and reduced motion switch immediately. Pause the recording while Before is selected, offscreen, or the tab is hidden. This supersedes the baked comparison-video behavior below.

Homepage redesign’s lower-right tile shows all ten supplied card PNGs in one continuous upward-scrolling feed. Cards use 80% of the tile width with 10% padding on each side, a 4%-of-width vertical gap, and soft drop shadows. Two identical groups create a seamless 42-second linear loop, moving faster than the previous horizontal row. Pause offscreen, in hidden tabs, on keyboard focus, and on fine-pointer hover. Reduced motion removes the animation and allows vertical scrolling through a single group. The five experimental grid modes and their pickers remain removed. `app/homepage-cards.tsx` and its CSS module own this behavior.

Life captions use authored line breaks from Neel's mockups and a 30ms-per-character reveal. The strip overlaps by 14px; the heading fades only near the first three active prints. Life clicks again open the shared film-matted viewer. Underwallet and Task Valley use the same centered viewer without a film mat; Glean Passport remains an X link. This supersedes the hover-only instruction below.

The About biography is one continuous paragraph beneath Hello!, without an internal paragraph gap. The portrait and its white mat have 2px corners, with a subtle 220ms hover tilt for fine pointers only; reduced motion keeps the resting angle. Side quests descriptions use warm gray #858079.

About's “Recents from life” is now an independent hover contact sheet. Each print expands upward from its bottom edge, retaining its rotation; neighbors remain still. A matching angled caption types beside that print, using Neel's supplied captions. Clicking does nothing and About no longer uses the photo viewer. Keyboard focus shows the complete caption immediately; reduced motion removes transitions and typing. Touch layouts show static captions below scrollable prints. Photography retains its existing modal viewer. This supersedes earlier About viewer and whole-row-hover directions below.

The September 24 About design is implemented in `app/about/about-journal.css`: “Hello!”, two introductory paragraphs, a rounded white portrait mat, right-aligned Resume and social links, an angled “Recents from life” strip, and three Side quests using supplied transparent assets. Glean Passport links to Neel’s supplied X post. Preserve the existing photo viewer and reduced-motion behavior. This design supersedes the earlier one-screen About composition.

The About page uses “Hello,” and “Life” with the homepage ink color. Its resume link reads “CV”. On desktop the Life strip extends slightly beyond the introduction, using responsive card widths and modest overlap; mobile keeps readable cards in a horizontally scrollable strip. Preserve the white film matting and hover lift.

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

At 700px and below, the hero introduction reads “I’m a product designer based in San Francisco. Currently, at Glean. Previously at Snap.” Keep the linked company names and the free-time activity row. Wider layouts retain the full introduction unchanged.

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

Philip's visibility follows the meadow's rendered presence, not the hero section's document bounds. He first spawns only after a fine pointer moves vertically below the rendered “In my free time” label. He disappears once the meadow has dissolved, stays absent throughout Work, and returns when scrolling restores the meadow.

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

The arrival uses the supplied Epidemic Sound “Wind, Gust, Designed Wind Gust, Leaves, Medium Long” MP3 at public/audio/meadow-wind-leaves.mp3. Predecode it and start at 65% volume, 350ms before the traveling gust reaches the tree so the sound builds with the movement. Play at most once per tab session, including homepage remounts and reloads. If autoplay is blocked, a gesture within 1.8 seconds of the cue may join at the corresponding audio offset; later gestures remain silent. Never replay the gust to unlock sound, restart the recording late, or add a separate replay control. Do not synthesize a replacement or layer a hum underneath.

The welcome gust must bend the entire meadow, including its dense interior down to the bottom edge. During the passing pulse, redraw a full-height traveling strip of cached turf even without cursor or character contact. Restore the original turf after the pulse. Tip-only motion does not satisfy this behavior.

The painterly default now includes thousands of fine grass blades sampled from the rolling terrain's opaque green pixels. Roots and colors follow the supplied hill exactly, with perspective-scaled blades and the same image registration. Grass and cypress share a spatial wind field driven by the existing Alamo Square weather observations; the canopy responds with slower branch inertia and finer foliage groups. Keep the white studio grid and existing composition. Grass remains isolated from the flat and alternate art styles. Both renderers suspend animation when paused, offscreen, in a hidden tab, or under reduced motion; the original terrain remains a complete fallback.

The default rolling painterly meadow is now made entirely of generated grass. A dense baked layer of short blades supports the moving tips; both use the reference image only for root placement and color sampling. Hide the reference image after the blade field is ready, retaining it only as a loading/error/no-JavaScript fallback. The Grass meadow toggle in the prototype picker switches between this grass-only field and the original image with no grass overlay. Both modes retain the cypress. The toggle is on by default, visit-local, and applies only to the rolling painterly scene.

Grass blades are 30% shorter than the initial grass-only study. In rolling grass mode the cypress is raised 8px so its trunk remains legible. On each homepage mount, the brief tree welcome gust sends one outward-traveling wave through the grass, including in already breezy weather. Respect reduced motion and hidden/offscreen playback. Grounded photographers, hikers, and cyclists press down the actual blades at their contact points; a bounded trail recovers over 1.9 seconds, using the existing grass loop and localized redraws of the baked turf. Image-only mode remains unaffected.

The welcome ripple now bends the dense turf as well as the fine blades, with a stronger, narrower traveling pulse. On fine-pointer devices, entering the actual grass silhouette with the cursor or visible Philip activates grass blowing: Philip follows at a closer distance and keeps his blowing expression while the cursor steers a local patch. Direction comes from pointer travel, not pointer speed. The patch bends actual turf blades, eases away on exit, and never activates over the white sky or in image-only mode. Reduced motion, hidden tabs, and the hero handoff deactivate it.

Miniature ground contact sits 4px lower in the ready grass-only meadow, for the photographer and hiker feet and cyclist tires. Apply the inset to terrain tracking so landing, movement, and contact flattening remain aligned; image-only and flat meadow placement stay unchanged.

The current welcome motion supersedes the dramatic ripple: a stronger gust begins 500ms after arrival and crosses the visible viewport from left to right over 3.2 seconds, with a broad 1.45-second rise and release at each location. The tree receives its welcome gust only when that traveling wind reaches its horizontal position. Cursor contact is a small, low-strength brush (38px by 24px falloff) that relaxes when movement stops. Grass no longer activates Philip's blowing expression or closer follow mode; his existing independent behavior remains.

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

The homepage “Neel Saswade” name uses 36px italic Newsreader on desktop and 32px on phones, with normal letter spacing and the project titles’ light `--muted` color. The introduction and “In my free time,” row use 20px Newsreader on desktop and 17–18px on phones in warm gray (`--ink`). The introduction wraps naturally at every viewport; do not force a break before “proactivity.”

The About page ends with the Life photo gallery. Do not show an Experience section or employment-history list.

Opened Polaroids have no glimmer or moving sheen overlay. Keep the paper finish, Newsreader caption, and gentle tilt.

The prototype picker includes an opt-in “Quiet sidebar” page layout and the unchanged “Current portfolio” default. Quiet sidebar hides the homepage introduction and header, uses left-side Newsreader navigation to existing destinations, places bike/camera/hiking controls at the top, and shows one selected miniature at a time. Selecting another cancels the previous actor's animation; switching back restores the default photographer. Philip is temporarily suppressed without changing the stored preference. Weather moves to the upper right. The prototype panel is wider for comparing options.

The prototype picker also includes an opt-in “Visitor bike” study. It is deliberately absent from the default portfolio. The study stores one visitor bike configuration in browser-local storage, with a bike name, rider signature, frame, wheels, tires, frame color, and frame decal. Its authored option catalog is the temporary stand-in for future supplied assets: aero, climbing, commuter, vintage, Brompton, gravel, and time trial frames; alloy, 30mm/50mm/60mm carbon, and disc wheels; high-performance, road, chunky gravel, and commuter tires. Keep the study local and non-tokenized until the visual system and public Peloton experience are explicitly promoted.

`/peloton` is currently a local preview only. It shows the current browser's bike beside authored sample bikes and includes the first race feedback loop. Do not present these samples as a real public visitor archive; the D1-backed public Peloton comes after the supplied bike assets and ownership model are approved.

Quiet sidebar matches the original introduction’s responsive text size (clamp(16px, 1.32vw, 19px)) on desktop and mobile, including navigation, both weather lines, work text, and prototype controls. The classic layout retains its existing typography.

Grass readability and performance: skyline blades are 30% longer and slightly narrower; fine moving blades are about 34% longer with fewer samples. Dense interior turf remains cached on its own canvas. A separate canvas draws preselected skyline blades and fine tips on each display frame, and the passing welcome breeze feeds both visible tip layers across the full meadow. Only cursor and character contact patches rebuild the interior, using spatial buckets and the original paint order. Playback changes must not regenerate the terrain. Keep native-pixel restoration, responsive registration, tree shading, and hidden/offscreen/reduced-motion suspension.

The default homepage uses the shared top header with the Neel Saswade wordmark and Work, Photo, and About links while keeping the breeze/time readout tucked into the bottom-right of the meadow. Photo opens the dedicated `/photography` gallery; Play and Resume are intentionally not in the high-level navigation yet. Keep the current introduction, inline hobby words, photographer, meadow, and Philip behavior. Other pages retain their shared header. The quiet layout controls remain opt-in only.

The root layout includes Plausible's cookie-free analytics script for `neelsaswade.com`. Keep the integration lightweight and do not add a consent banner or identify individual visitors. Plausible must be configured for the domain before the dashboard receives data.

The homepage header must preserve the introduction's original desktop vertical position. Above 700px, retain the header's exact layout space (30px top padding plus its responsive 1.05 line height); do not move the introduction upward when changing navigation.

On mobile, the shared header uses the available width instead of forming one left-heavy cluster: the wordmark anchors the left edge and the 14px navigation anchors the right, with 16px top padding and 16px link gaps. Desktop spacing and type remain unchanged.

Top-right weather typography is deliberately smaller than navigation: breeze summary 12–14px, time and wind details 11–12px, responsive on desktop and mobile.

Desktop sidebar navigation follows the supplied Figma reference: 20px Newsreader, 20px line height, and 16px gaps (36px row rhythm). Keep the restored introduction position.


## Inline work sections (current)

The homepage main asset now loops a before/after comparison: old_home.png at the same 20:13 ratio for two seconds, then a 600ms crossfade into the existing trimmed walkthrough. The end fades white and the old screen fades back in on replay. HomepageComparison keeps an outside Before/After label anchored below the mock and pauses playback offscreen or in hidden tabs. Reduced motion shows a static redesigned screen. Preserve the 90% inset, 12px corners, shadow, and right-hand placeholders.

Homepage redesign's main tile uses homepage_Vid_final.mov cropped to 2560×1664 at (26,20), encoded to 1920×1248 at 30fps. Remove the final two seconds (24.1-second output), fade to white over the final 600ms, and fade in from white over 350ms at replay. The entire cropped screen fits at 90% tile width, with 12px corners and a subtle shadow on #ECECEC. Keep its two right placeholders and shared offscreen/reduced-motion video behavior.

Artifacts uses the supplied document left and centered AI edit bar upper right on a 1145×450 composition. The lower-right tile uses individual Gmail, Slack, and Outlook PNGs with baked shadows. Each 5-second turn lifts the front skin modestly from 24cqw to 7cqw over 600ms, holds for 2.3 seconds, returns over 600ms, and shuffles over 600ms. Do not pan farther down to the bottom of the card. Animation pauses offscreen and in hidden tabs; reduced motion keeps a static stack. Preserve copy and dark-tile compatibility.

Dark work tiles is an off-by-default, visit-local prototype picker option. It changes every inline work tile surface to #1C1C1C without changing the page, artwork, video pixels, layout, or motion. The Growth checklist fade uses the same dark color, and Snap captions become light gray. Turning it off restores each original surface; reloading resets it.

The Proactive card motion picker shows a visit-local Flip wheel toggle only in Wheel mode. It mirrors the wheel’s horizontal arc and card rotation, not the artwork or vertical travel. Keep the original left-side center as default; Rolodex and Grid are unaffected.

Wheel cards use an 82%-width, 1229:271 box with contain sizing and no perspective or scaling. The wheel radius is 420cqw at 2.8-degree steps: a broad, shallow arc that reduces triangular outer gaps while preserving separation at the inner ends. Keep the same geometry in either wheel direction. Rolodex is the default, with 80%-width cards to visually match the popup above and proportional 16.35cqw vertical steps. Preserve its intrinsic height, 600px perspective, 12-degree rotateX steps and gentle depth scaling. Never replace Rolodex depth with sideways wheel rotation or apply wheel size changes to it. No Pause button is shown; visibility and reduced-motion suspension remain active.

Proactive Intelligence’s lower-right tile cycles the 18 supplied card PNGs, preserving their baked shadows. Rolodex is the default; Proactive card motion in the prototype picker offers Wheel, Rolodex, and Grid as visit-local alternatives. Wheel and Rolodex settle every 3.4 seconds with 750ms transform transitions; Grid replaces one scattered cell every 1.4 seconds with a 600ms fade. Timers stop offscreen, in hidden tabs, and with reduced motion; reduced motion shows a static composition. No new motion dependency.

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

On screens up to 700px wide, the painterly meadow is anchored to the bottom of the hero, with a reserved landscape area below the copy. The header and hero together fill the first viewport; short screens or enlarged text can grow the hero to avoid overlap. The existing hero-to-Work dissolve remains. Phone type and cypress are smaller; the backpacker remains the default mobile visitor and desktop keeps the photographer. All hobby toggles and reduced-motion static visitors remain available.

The mobile intro block sits 12px below its original responsive offset, with a 30px name. The cypress uses its mobile width token explicitly (216–232px), overriding legacy fixed-width rules. Hide the breeze and time readout at this width; it crosses the grass. Desktop keeps the readout at the bottom right.

The mobile hero-to-Work handoff keeps the scene in the hero's natural scroll position instead of applying the desktop's downward exit translation and scale. Fade the whole scene using the inverse of the existing full-page paper opacity, including its miniature visitors. The mobile Work wrapper stays transparent so no inset rectangle cuts across the landscape. Reuse the existing reversible scroll progress and reduced-motion handling; do not add a second animation loop or change the desktop handoff.

On touch devices, tilting steers the cyclist and backpacker in screen coordinates, with a dead zone and smoothly increasing speed up to 3× normal. The two actors share one orientation listener. iOS permission is requested directly by an activity-button tap, never by the automatic backpacker arrival. Denial and unsupported sensors leave ordinary actor behavior intact. Reduced motion disables tilt. Touch hides Philip's tooltip and actor speech; navigation stays single-label. Opening a photo by touch focuses the labelled dialog instead of Close; keyboard opening still focuses Close with its visible ring. The About greeting is 30px and intro body is 16px on phones.

Mobile Work preserves each desktop composition's visual hierarchy instead of stacking every panel equally. Three-panel projects show the desktop primary frame full-width, followed by the two supporting frames in a compact two-up row. Growth promotes its center video to that primary position. Two-panel and single-panel projects keep their authored sequence at a readable full width.

In Growth's mobile supporting row, crop the tall starter-kit checklist around its actual card content. Remove its desktop top mask and overlay at this breakpoint so the mock remains legible inside the shallow tile; desktop keeps the full-image fade and offset.

Mobile Work compositions have a 12px gap in both directions, including Artifacts. Each panel has a definite 100% width within its grid column, so its aspect ratio and minimum height cannot expand into the neighboring tile. Growth's three onboarding screenshots fit within three equal, shrinkable rows, with 10px inner padding and contained images; the stack must never spill into the summary. Desktop composition spacing and sizing are unchanged.

The mobile Life strip shows the photographs without visible per-photo subtitles. Keep the descriptions available through the existing accessible figure and open-photo labels; desktop retains its hover and keyboard captions.

Do not display a Selected work heading above the projects. Retain the existing opening spacing and an accessible Work heading.

Work preserves scrolling in both directions. On desktop, only the first intentional downward scroll from the hero is captured for a calm 900ms ease-in-out handoff to the first fitting project. Same-gesture momentum is contained in that existing handoff, so multiple wheel inputs do not restart or retarget the animation. Once Work is in view, wheel input remains native and never chooses projects or prevents ordinary scrolling. On touch, the first upward swipe from the top lands with the first project title 24px below the viewport edge over 560ms (immediately for reduced motion). Subsequent swipes remain native without project snapping. Nested controls, horizontal gestures, downward pulls, and pinching are excluded; new interactions and reversals cancel the handoff. Project links retain interruptible centered navigation, and the rail never repositions between projects.

Work metadata keeps a 6px gap between the Glean logo and its text label.

The Work rail uses one shared active dot that glides between labels over 250ms with the shared ease-in-out curve. It follows measured link positions on desktop, retargets smoothly, and moves immediately for reduced motion and focused keyboard navigation.

Proactive Intelligence uses the supplied updated_psychic.mov in its main panel. The encoded MP4 crops the 1454×1040 recording to its white 1416×1000 content at x=20, y=22, matching 708×500 at 2× resolution with no black border. It uses the existing muted, inline looping playback that pauses offscreen and shows an updated content poster for reduced motion. Other panels remain black placeholders.

The homepage paper background is #F5F5F4 across the hero and inline Work, including the grid-fade layer. Video pixels remain part of the supplied asset.

Each complete project (heading, media, and summary) enters once with a 250ms fade and 6px rise using the shared ease-out curve. The existing Reveal observer retains visibility afterward, including when scrolling back. Do not stagger individual media panels or fade projects when they leave view. Reduced motion leaves the composition static. Scroll navigation remains independent of this entrance.

The shared soundscape gives the first portfolio arrival one quiet, session-local cue: a low meditative hum followed by a soft filtered wind swell. It is synthesized in the browser, waits for the first user gesture when autoplay is blocked, and stays silent when reduced motion is preferred.

Project summaries stay left-aligned beneath their media, capped at a readable 68ch measure with `text-wrap: pretty`. Small screens use the available width.

The About Life strip shows one shared caption at the top right of the strip, raised above the reach of an enlarged print so text never overlaps photographs. It types in on fine-pointer hover, appears immediately on keyboard focus, and is hidden on phones and touch layouts. Each print keeps an accessible description.

The shared photo viewer's Previous and Next controls sit at the vertical middle of the screen as plain white circles with simple chevrons and a soft drop shadow.

The inline Work wrapper stays transparent, including the quiet layout. Only the full-page paper layer removes the grid during the meadow handoff; never paint a bounded background on the rising Work container, which would cover the meadow as a rectangular bar.


## Photography

`/photography` is the dedicated photo gallery, reached through Photo in the shared header. Its layout follows the spacious, unframed masonry rhythm of gallery.jessyin.world: five columns on desktop, two on phones, and mixed portrait, square, and landscape proportions. Keep the 24 slots black until photographs arrive. `app/photography/photography-gallery.tsx` owns the slots and focus interaction; its CSS module isolates the layout. A native modal dialog expands the selected photograph from its gallery position into the viewport center over 280ms using the shared ease-in-out curve, then reverses to its slot. Escape, reduced motion, and keyboard activation are immediate. Preserve focus restoration, native modal focus containment, scroll locking, and global Declarative cues.


About's Life photographs reuse the Photography page's centered viewer through `app/photo-viewer.tsx`. Keep the film thumbnails and their resting rotations; on precise-pointer hover or keyboard focus, lift and expand the active print with a restrained transform while keeping neighboring prints in place. Remove all visible photo captions. The enlarged Life view keeps the complete photograph inside a white film-print mat with a slightly deeper bottom border, without pointer tilt or text; Close and Escape restore the original thumbnail and focus. Both galleries share the 280ms reversible transition and reduced-motion/keyboard behavior. This supersedes the earlier opened-Polaroid caption and tilt directions.

The Life strip contains 11 photos. Omit the two-person Cathedral hiking photo (`high-country-friends.JPG`); keep the remaining strip aligned to the About column, with responsive print widths and a little more space after the identity row on desktop.

The Photo page has no visible Photography heading; the gallery follows the shared header directly.


## Searchable photography gallery

The Photo page uses all 141 supplied photographs from the Documents portfolio photos folder. WebP thumbnails and larger viewing copies live in `public/photography`; `app/photography/photos.json` owns dimensions, descriptive alt text, subject/location/style tags, color families, and palettes. The quiet search field uses normalized token matching with synonyms, including bike/bicycle and Japanese/Japan. All search terms must match; clear restores the entire gallery. No tags or category headings are printed over the photos.

Color is the default cluster order. Photography style is an alternative in the Photo prototype picker and the shared meadow prototype picker; the session-local choice carries between pages. Both orderings place similar photos near each other in a shortest-column masonry layout.

Search applies only after a 600ms pause in typing and after the current fall-and-gather sequence finishes. Continuing to type cancels the pending query, including while it waits for motion; composition input waits until composition ends. Keep the previous gallery height through the sequence so departing photos are not clipped by a collapsing page. Visible non-matches fall farther with accelerating sideways drift and 22–30 degrees of rotation over 600–690ms, staying opaque for the first 60% of the fall. Matching photos hold their sampled positions until the last visible fall ends, pause for 180ms, then gather toward the search bar over 600ms. Results arriving from offscreen fade upward by 72px instead of racing across the entire page. Skip the pause when no visible photos fall; clearing and regrouping remain direct. Explicit clear or grouping changes can still retarget from the current translation, rotation, and opacity. This deliberately slower search motion is explicitly requested, including keyboard typing. Snapshot the current animated positions before retargeting, animate only transforms/opacity, and avoid animating offscreen photos. Reduced motion changes results immediately. Hidden results leave the keyboard and accessibility order; announce the result count quietly. The existing shared centered photo viewer is unchanged.

Home, Photo, and About share the warm paper background `#F5F5F4`, including Photo and About viewer backdrops. Scope this color to these pages so case studies retain their white background. Photo uses a plain paper background throughout the gallery, without the studio grid.

The Photo search bar spans the full gallery width and aligns with its left and right edges at every viewport size.

The Photo search field floats without an underline or enclosing border. On arrival its empty, unfocused prompt starts with `type “bikes”`, then cycles through `type “nature”`, `type “city”`, and `type “sunsets”` every four seconds, holding each word for 3.6 seconds before a gentle 400ms crossfade. Opacity blends evenly while a separate, smaller vertical drift uses the shared ease-out curve; the lowercase “type” prefix stays fixed. Keep the accessible label “Search photos.” Focusing shows the static input placeholder; typing hides the suggestions. Pause cycling offscreen, in a hidden tab, or while viewing a photo. Reduced motion keeps `type “bikes”` still.

On Photo page arrival, keep the temporary server column layout hidden until client measurements and the saved grouping resolve before paint. Restoring preferences must never capture positions or trigger the search/reorder animation. Reveal the final gallery with a 200ms opacity-only fade; thumbnails reserve their dimensions and fade in on load, including cached images. Reduced motion makes both reveals immediate.

The Photo search row includes a lightweight sort dropdown aligned to its right edge, with Selected work, Color, and Photography style. It shares the grouping state with the prototype pickers, closes on selection, outside click, or Escape, and keeps visible keyboard focus.

The shared photo viewer keeps the already-loaded thumbnail as a background preview throughout expansion. Reveal the larger image only after decoding succeeds, using a short 160ms opacity fade; keep the preview if loading or decoding fails. The viewing surface uses paper instead of black, and reduced motion reveals the decoded image immediately. This applies to Photo and About without changing their framing or close behavior.

Photo gallery thumbnails stay silent on hover. Mark them with `data-silent-hover="true"` so the shared soundscape skips its automatic hover cue while retaining the standard press/release click feedback. This exception is limited to gallery photos; other controls and About keep their existing cues.

### Field journal prototype

`Field journal` in Meadow + tree is an opt-in, visit-local visual identity. The current painterly scene remains the default. Warm paper replaces the grid; the landscape, people, interest controls, and Philip share olive washes, ochre accents, and a fine charcoal outline. Artwork is authored SVG under `public/alamo-styles/field-journal`; `app/field-journal.css` scopes every override to the chosen environment. The original actor and cursor state machines still own motion, selection, reduced motion, and offscreen behavior. The journal tree registers to its horizon on resize and meadow-height changes. Switching away restores the existing artwork and tree position.

Selected work is the default grouping, also available in both prototype pickers. It leads with the 28 photos Neel selected on September 23, 2026, with the pink umbrella (`087`) first. Keep the foggy peaks (`130`) and black-sand beach (`131`) several gallery rows apart; the beach appears near the end of the selected sequence. `selectedPhotoIds` in the gallery model owns their authored sequence, moving through related subjects and tones. The remaining photos follow by palette similarity with a small preference for matching photography style, creating one continuous gallery. Preserve all 141 photos, search, silent thumbnail hover, and the shared viewer. Restore an explicitly chosen sort within the current session; otherwise start with Selected work.



The glass activity controls stay still on hover, with no rotation, image swap, or fade. Preserve the 48px controls, active illumination, actor toggles, keyboard focus, and shared sound cues.

The root metadata owns the canonical URL, description, favicon, and 1200×630 Open Graph image. Keep the social image dimensions and alt text in sync when the artwork changes. `public/llms.txt`, `public/robots.txt`, and `public/HUMANS.txt` are the crawler and project-credits entry points; keep their links and site URL current.

## Hosting

Cloudflare is the production host for `neelsaswade.com`. The GitHub `main` branch is the production source, and pushing it can publish the site. Development is local and preview-only by default. Do not push to `main`, deploy, or change hosting settings unless Neel explicitly requests publication of the reviewed change. Editing, cleanup, testing, and finishing work do not authorize publishing. Show desktop and mobile previews before any release. For an explicitly authorized release, test the exact reviewed commit before pushing, then verify the matching Cloudflare deployment and live domain. ChatGPT Sites, its `.openai/hosting.json` manifest, packaging plugin, and Git remote are retired and must not be restored.
