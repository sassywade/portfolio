# Portfolio design direction

## North star

The portfolio should feel like a quiet afternoon in Alamo Square: personal, warm, observant, and a little unexpected. It is an editorial product-design portfolio first and a playful environment second.

**Quiet on arrival. Playful on discovery. Simple everywhere.**

The work must always be the clearest and most substantial part of the site. The meadow, cypress, weather, miniature characters, and Philip create personality, but they never become the product.

## Design principles

### 1. Always strive for simplicity

Every element needs a reason to exist. Prefer one clear gesture over several explanatory ones. Do not add arrows, captions, badges, ornamental copy, extra navigation, social clusters, or decorative sections unless they solve a real problem Neel has identified.

When something feels wrong, first adjust scale, spacing, hierarchy, or removal. Do not immediately add another component.

### 2. Let the work speak for itself

Project cards are large, quiet stages for screenshots. Their default state is a light-gray rounded tile with a modest title and no supporting caption, arrow, color wash, or invented graphic. Supplied work should be shown fully with `object-fit: contain`, never cropped for drama.

The work grid uses two columns on desktop and one column when space becomes tight. The rhythm should feel generous but not sparse: company label, a deliberate pause, then substantial cards with consistent gaps.

### 3. Treat Alamo Square as a place, not a theme park

The default hero uses the restrained painterly rolling meadow and one Monterey cypress. The landscape should feel majestic, grounded, and atmospheric. It can breathe with real San Francisco wind, but it should not bounce, spring, or call attention to its implementation.

The tree must always visibly meet the meadow. Weather copy belongs on the landscape near the tree and may follow the hill's contour, as though it is part of the scene.

### 4. Reward curiosity without demanding it

Interactive words, miniature hobby characters, and Philip are optional discoveries. The main introduction remains complete without them. Interactions should be understandable after one encounter, easy to leave, and never required to reach the work.

Philip is a lazy companion rather than a cursor replacement. His personality comes from lag, pauses, huffing, target interactions, and brief reactions—not from constantly changing expression based on pointer speed.

### 5. Motion should feel calm and physical

Use motion to clarify relationships: the meadow yields as the work rises, the tree responds to wind, and characters land on the landscape. Prefer transforms and opacity with soft easing. Avoid springy text entrances, abrupt side swaps, squashing, or perpetual decorative movement.

The transition from hero to work should feel like the landscape dissolves or recedes while the project tray rises into attention. It should shorten the perceived distance to the work, not create another scene to watch.

## Visual language

### Typography

- **Newsreader**: homepage name, case-study titles, large editorial statements, and rare pull quotes.
- **Geist Sans**: navigation, body copy, links, project titles, company labels, metadata, buttons, and controls.
- **Geist Mono**: only code-like readouts or deliberate ASCII artwork.

Typography should feel low-key and human. Avoid oversized navigation and project titles. Hierarchy comes from typeface, spacing, and placement before it comes from dramatic scale.

### Color

- Primary text: warm gray around `#65625f`.
- Page: white.
- Homepage grid: very subtle neutral lines.
- Placeholder cards: quiet light gray around `#f2f2f2`.
- Brand color appears only in authentic marks or intentional links, such as Glean indigo and Snap yellow.
- Meadow and cypress provide the dominant natural color; interface chrome stays neutral.

Case studies use a plain white background with no studio grid.

### Shape and texture

- Rounded corners are soft and restrained, not bubbly.
- Borders are rare and low contrast.
- Shadows are used only when needed to separate a real object, such as a phone mockup, from its card.
- Natural texture belongs in the meadow and tree. Interface surfaces remain clean.

### Spacing and scale

Whitespace is structural. It should create calm, not make related content feel disconnected.

- The hero occupies the first viewport without exposing work before scrolling.
- Once scrolling begins, work should approach quickly through the hero-to-work handoff.
- Project cards should be visually dominant, with consistent aspect ratios and enough space to read as individual pieces.
- Company labels are clear Geist headings, separated from their grid by a deliberate but compact gap.
- The Snap section ends with real breathing room rather than colliding with the viewport edge.

## Page patterns

### Navigation

The navigation is exactly `Work`, `About`, and `Resume`.

- Work scrolls to the homepage project section.
- About opens the separate About page.
- Resume opens the supplied PDF in a new tab.

Keep it quiet, static, and free of decorative hover animation. Use clear color and focus feedback only.

### Homepage hero

The introduction is a compact Newsreader-led editorial block. It states who Neel is, what he works on, and what he does outside work. Interactive words may have subtle affordances, but highlighting is off by default.

The meadow and cypress sit in front of the page as one responsive hero environment. They disappear after the hero and materialize again when returning upward.

### Work grid

The grid is grouped by company. Glean appears first, followed by Snap. Cards contain only:

1. A concise title at the top.
2. The supplied project graphic, shown fully.

Until a graphic exists, the card remains a substantial gray placeholder. Never collapse a placeholder into a title floating in empty page space.

### Case studies

Case studies are quiet, image-led narratives influenced by the clarity of Natalie Almosa and the structured storytelling of Caleb Wu without copying either site literally.

- Plain white canvas; no homepage grid.
- No redundant top navigation inside the case study.
- Newsreader title and concise Geist metadata.
- Clear progression through context, problem, process, decisions, outcome, and reflection.
- Large media with consistent framing and honest placeholder states.
- Navigation should support reading without becoming a visual centerpiece.

### About

The About page uses the same restraint as the homepage: editorial introduction, personal imagery, and only the information Neel wants to share. It should feel like another chapter of the same site, not a separate brand.

The Life photographs enter once as a quiet contact sheet. Hover and keyboard focus may lift an individual print slightly, while opening a photo uses a short fade and small positional transition. Closing must be just as composed, restore focus to the originating print, and collapse to a static presentation for reduced motion. Do not animate the biography, experience rows, or photographs merely to keep the page busy.

## Interaction quality bar

- Everything works without motion before enhancement is applied.
- Pointer effects are disabled for coarse pointers and simplified for reduced motion.
- Interactive words and controls are keyboard accessible with visible focus.
- Animation stops when its scene is offscreen.
- No interaction may obscure text, block navigation, crop work, or delay access to projects.
- Sound is subtle, purposeful, and never required for feedback.

## Anti-patterns

Do not introduce:

- title-only project layouts with invisible card surfaces;
- captions, arrows, color washes, or marketing copy on project tiles;
- large promotional footers or secret-footer spectacles;
- springy page text or nav animation;
- multiple competing visual styles enabled by default;
- cropped supplied screenshots;
- decorative UI added merely to make an area feel less empty;
- interactions that follow the pointer so aggressively they feel broken;
- homepage grid lines on case-study pages.

## Final test

Before shipping a change, ask:

1. Is the work still the clearest thing on the page?
2. Did this become simpler or merely busier?
3. Does the playful behavior feel discovered rather than announced?
4. Does every supplied image remain fully visible?
5. Does the site still feel calm without animation?
6. Would removing anything improve it?

If the answer to the last question is yes, remove that thing first.
