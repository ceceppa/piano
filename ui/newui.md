# Piano Chord Explorer — Explore UI/UX Redesign

## Purpose

Redesign the existing Explore screen for someone who wants to learn a chord, learn a scale, or compare both on a piano keyboard.

The screen must make these tasks immediately understandable:

1. Choose a root note.
2. Choose whether to see a chord, a scale, or both.
3. Choose the chord or scale from a visual Explore list.
4. See the correct notes on the piano.
5. Hear the displayed selection.

The product should feel like a calm piano companion, not a music-software configuration panel.

## Confirmed product decisions

These decisions replace conflicting recommendations from the previous version of this document:

- Keep root selection as visible buttons.
- Show all 12 chromatic roots without requiring a dropdown.
- Remove the top-level Chord quality dropdown completely.
- Choose chords from the Explore chord-types list.
- Choose scales from a parallel Explore scale-types list.
- Provide a visible Chord / Scale / Both view selector.
- Allow chord and scale overlays on the keyboard at the same time.
- Keep inversion selection in the main selection area when a chord is visible.
- Redesign Explore now while mapping future screens and controls.
- Do not add full product navigation until the corresponding screens exist.

## Scope

### Included now

- Explore screen information hierarchy.
- Chord, scale, and combined viewing.
- Root-note selection.
- Inversion selection.
- Chord and scale catalogue selection.
- Piano overlays.
- Chord, scale, and single-note playback.
- Placement of voicing and hand-arrangement controls.
- Responsive and accessible interaction rules.
- A map for backlog features that will affect the UI later.

### Not fully designed now

- Favourites screen.
- Settings screen.
- Practice mode.
- Full progression player.
- Full metronome.
- Harmony-helper workflows.
- Responsive product navigation.

These future areas are mapped so Explore does not need to be redesigned again when they arrive.

## Assessment of the current screen

The current screen has good building blocks: visible root buttons, an interactive piano, inversion controls, playback, and a browsable chord list. The problem is not simply the quantity of features. It is that selection, visualisation, playback, theory, persistent preferences, and advanced musical context all appear with similar weight.

### Keep from the current design

- Direct root-note buttons.
- The piano as the central visual.
- Inline inversion selection.
- Chord-type cards as a direct selection method.
- Separate chord, scale, and combined keyboard views.
- Direct playback for the visible musical content.

### Change from the current design

| Current element | Problem | Revised treatment |
| --- | --- | --- |
| Root buttons | Useful, but unclear accidentals and awkward wrapping reduce readability | Keep all 12 in one responsive chromatic control |
| Chord quality dropdown | Duplicates the chord-card catalogue and adds another selection model | Remove completely |
| View mode inside Advanced | Chord / Scale / Both is a primary user intent, not an advanced option | Move it to the top selection area |
| Scale follows control | Exposes internal state and creates uncertainty about which root is active | Use the visible root as the shared root in Explore |
| Inversion row | Valuable but visually over-weighted | Keep inline, compact, and visible only in Chord and Both modes |
| Voicing and hands | Too much detail for the first task | Move to contextual Chord options |
| Keyboard range | Persistent display preference | Move to future Settings |
| Genre context | Unrelated to identifying a single chord or scale | Move to future Progressions |
| Notes panel | Does not reliably reflect the active view | Make it mode-aware |
| Playback row | Several equal-weight actions and debug-like Ready text | Use context-sensitive primary and secondary actions |
| Explore chord grid | Correct place to choose chords, but currently long and weakly integrated with the selected result | Keep it as the chord selector and improve hierarchy |
| No scale catalogue | A scale must currently be configured indirectly | Add a parallel Explore scale selector |

## Core interaction model

Explore has six pieces of musical state:

| State | Example | Behaviour |
| --- | --- | --- |
| Root | G | Shared by the chord and scale on the Explore screen |
| View | Both | Controls which overlays, information, selectors, and playback actions are visible |
| Chord type | Major sixth | Chosen from Explore G chord types |
| Scale type | Major | Chosen from Explore G scales |
| Inversion | Root position | Applies only to the selected chord |
| Chord arrangement | Close voicing, both hands | Managed in contextual Chord options |

The last selected chord and scale remain in memory when the view changes. Switching from Both to Scale hides the chord without discarding it. Returning to Both restores the previous chord and inversion.

### View behaviour

| View | Keyboard | Main information | Explore lists | Playback |
| --- | --- | --- | --- | --- |
| Chord | Selected chord tones | Chord notes and explanation | Chord types only | Play chord and arpeggio |
| Scale | Selected scale tones | Scale notes and explanation | Scale types only | Play scale ascending/descending |
| Both | Chord and scale overlays together | Separate chord and scale summaries | Chord types followed by scale types | Separate chord and scale actions |

Chord and Scale are not navigation destinations in this phase. They are views of the same Explore workspace.

## Explore page structure

### 1. Header

For the current phase, keep the header minimal:

- Product name: **Piano Chord Explorer**.
- Optional Settings gear only when the Settings screen exists.
- No side navigation or bottom navigation yet.
- No visible LIGHT/DARK text toggle once Settings exists.

Until Settings is built, an existing theme control may remain temporarily, but it should not influence the target mockup.

### 2. Primary intent selector

Place a clearly labelled segmented control near the top:

**Show on piano**

- Chord
- Scale
- Both

Default to Chord for a new user unless product testing shows that Both is a better first-run teaching state. Preserve the user's last selection on later visits.

This control must not be hidden inside Advanced settings. It changes the purpose of the entire page.

### 3. Root-note selector

Use a labelled chromatic button group:

**Root note**

C · C♯/D♭ · D · D♯/E♭ · E · F · F♯/G♭ · G · G♯/A♭ · A · A♯/B♭ · B

Requirements:

- Show all 12 choices without opening a dropdown.
- Keep chromatic order.
- Display enharmonic names together until the user chooses a Sharps or Flats notation preference in Settings.
- Use one selected state with a border, fill, and selection marker; do not rely on colour alone.
- Prevent the final button from wrapping by itself.
- On narrow screens, allow deliberate horizontal scrolling or use a balanced two-row grid.
- Use arrow-key navigation within the group and Home/End shortcuts.
- Changing the root updates the chord notation, scale name, keyboard, explanation, playback labels, and both Explore lists.
- Do not automatically play after a root change unless that preference is enabled later.

The shared root keeps Explore understandable. Learning a chord in a different key context belongs to future progression or harmony workflows rather than this first-level control.

### 4. Inversion selector

Keep inversion close to the root selector in the same top selection region.

Label: **Inversion**

Options for a four-note chord such as G6:

- Root
- 1st
- 2nd
- 3rd

Rules:

- Show the selector in Chord and Both views.
- Hide it completely in Scale view.
- Only show inversions valid for the selected chord.
- Update slash-chord notation and the piano immediately.
- Use compact buttons, not a dropdown.
- Provide a short inline explanation or info action: “Changes which chord note is lowest.”
- Playback must use the exact displayed inversion.
- On mobile, place inversion on its own row below Root note rather than compressing either control.

Inversion remains visible because comparing inversions is a core learning task currently in Phase 4. Voicing and hand arrangement remain one level deeper because they are refinements of an inversion rather than the first selection.

### 5. Current selection summary

Between the selectors and the piano, show a concise summary that adapts to the active view.

Examples:

- Chord: **G6 — G major sixth**
- Scale: **G major scale**
- Both: **G6 with G major scale**

In Both mode, add two visually distinct but quiet state chips:

- Chord: G6
- Scale: G major

Each chip may link the user to its Explore section, but should not open another dropdown.

Include at most one line of beginner-friendly explanation. Avoid stacking separate hero cards for chord and scale.

### 6. Interactive piano

The piano remains the visual centre.

#### Overlay rules

- Root note: warm amber root marker.
- Chord tones: filled blue marker or key treatment.
- Scale-only tones: lighter teal outline, dot, or secondary treatment.
- Notes belonging to both chord and scale: retain the chord treatment and add a small scale marker.
- Every role also needs a shape, label, or marker so meaning is not colour-dependent.
- Include a compact legend whose items change with the selected view.

The legend should show only relevant roles:

- Chord view: Root, Chord note.
- Scale view: Root, Scale note.
- Both view: Root, Chord note, Scale note, Both.

#### Scale-marker rule

Scale tones may repeat over the visible piano range, but scale-degree labels or numbered scale markers must appear only once, starting from the first visible instance of the selected root. Do not repeat scale-degree labels in every keyboard section.

#### Note labels

- Default to labels on selected chord and scale notes only.
- In Both mode, avoid duplicated labels on a note belonging to both.
- The future Settings screen controls Chord/scale notes only, All notes, or Off.
- Click or tap any piano key to play that single note without changing the selected chord or scale.
- A pressed key temporarily overrides its normal visual state, then returns to its overlay state.

#### Hand ranges

Do not show floating hand bars by default. If a left/right-hand arrangement is chosen in Chord options, attach a subtle range overlay to the keyboard and label it clearly.

### 7. Playback actions

Playback changes with the active view.

#### Chord view

- Primary: **Hear G6**
- Secondary: **Play as arpeggio**
- Tertiary: **Chord options**

#### Scale view

- Primary: **Hear G major scale**
- Secondary: **Play descending**
- Optional later action: **Loop scale**

#### Both view

- Primary: **Hear G6**
- Secondary: **Hear G major scale**
- Tertiary: **Chord options**

Do not create a combined chord-plus-scale playback action unless a clear learning exercise requires it.

Rules:

- A new preview stops or replaces the previous preview.
- Highlight piano keys in exact playback order.
- Playback must match the displayed root, chord type, scale, inversion, voicing, and hand arrangement.
- Remove the static Ready label.
- Show status only while loading, playing, paused, or in an error state.
- Keep preview controls local to Explore until the persistent global player is implemented.

### 8. Mode-aware learning information

Replace the current generic Notes panel with a compact section that reflects the view.

#### Chord view example

**Understand G6**

- Notes: G · B · D · E
- “A G major chord with an added sixth.”
- Optional: Show intervals.

#### Scale view example

**Understand G major**

- Notes: G · A · B · C · D · E · F♯
- “A seven-note major scale with a bright, resolved sound.”
- Optional: Show scale degrees.

#### Both view example

**G6 and G major**

- Chord: G · B · D · E
- Scale: G · A · B · C · D · E · F♯
- Shared notes: G · B · D · E
- “Every note in G6 belongs to the G major scale.”

The Scale-only view must never show chord notes. This directly resolves the current bug where the notes panel ignores view mode.

Keep explanations plain and short. The future harmony helper can expand this area without changing the page hierarchy.

### 9. Explore selectors

The Explore lists are the direct chord and scale selectors. They are not merely recommendations below a separate dropdown.

#### Explore chord types

Heading: **Explore G chord types**

Use grouped, selectable cards or chips. Suggested groups:

- Common: G, Gm, G7, Gmaj7.
- Colour: Gsus2, Gsus4, G6, Gadd9.
- Extended: Gm7, G9, and other supported types.

Requirements:

- The selected chord card has an unmistakable selected state and accessible announcement.
- Show readable notation and a one-line explanation.
- Clicking a card updates the chord, title, inversion options, keyboard, information, and playback.
- Preserve the selected scale when the chord changes.
- Keep category labels visible; use chips or buttons for filters if the catalogue grows.
- Avoid another chord-quality dropdown.
- Less-common qualities may live behind an Advanced filter or See all action.
- In Scale view, hide the chord list but retain its selection.

#### Explore scales

Heading: **Explore G scales**

Use the same interaction pattern as chord types. Initial groups may include:

- Common: Major, Natural minor, Harmonic minor.
- Popular: Major pentatonic, Minor pentatonic, Blues.
- Modes and advanced scales: behind an Advanced filter or See all action.

Requirements:

- The selected scale card has the same interaction language as selected chord cards.
- Clicking a scale updates the title, keyboard, scale information, and playback.
- Preserve the selected chord and inversion when the scale changes.
- Avoid a scale dropdown as the primary selection method.
- In Chord view, hide the scale list but retain its selection.

#### Both view layout

In Both view, show both sections below the piano:

1. Explore G chord types.
2. Explore G scales.

To prevent a second clutter problem:

- Initially show the most useful row or current category from each section.
- Keep the selected item visible even if it is outside the default category.
- Use **See all chord types** and **See all scales** to expand or open a focused catalogue.
- Do not show every advanced chord and mode simultaneously.
- Do not place the two full catalogues above the piano.

## Chord options

Keep these contextual controls out of global Settings:

- Voicing: Close or Open.
- Arrangement: Left hand, Right hand, or Both hands.
- Optional reset to the basic arrangement.
- Future playing-style controls when they affect the current playback.

Open Chord options as:

- A compact anchored panel on desktop.
- A bottom sheet on tablet and mobile.

Inversion is not repeated inside this panel because it remains visible in the main selection region.

Changes update the piano and playback immediately. A one-sentence explanation should accompany unfamiliar terms.

## Future Settings screen

Settings contain persistent product preferences, not the current musical selection.

### Display and notation

- Theme: System, Light, Dark.
- Note labels: Selected notes only, All notes, Off.
- Keyboard range: Automatic, 2, 3, or 4 octaves.
- Accidental naming: Automatic, Sharps, Flats.
- Middle-C marker.
- Reduced motion.

### Playback

- Piano sound.
- Master volume.
- Default preview behaviour.
- Play on selection, off by default.
- Sustain or reverb when implemented.

### Accessibility

- Reduced motion.
- Visual playback feedback.
- Shortcut reference.
- Audio-control announcements.
- Contrast preferences if supported.

Do not move inversion, voicing, hand arrangement, root, chord, scale, genre, tempo, metronome state, or backing-track selection into Settings.

## Future product map

The current redesign must anticipate these areas without adding premature navigation.

| Backlog area | Future destination | Explore impact now |
| --- | --- | --- |
| Favourites with filters | Favourites screen | Add favourite actions to chord and scale selections later; do not add a screen now |
| Settings | Settings screen | Remove persistent preferences from Explore once Settings exists |
| Practice mode | Practice screen | Allow current chord or scale to become practice context later |
| Responsive navigation | Side navigation on desktop, bottom navigation on mobile | Add only when at least two real destinations exist |
| Persistent player and compact metronome | App-level playback region | Reserve responsive bottom space; keep current previews local for now |
| Progression playback and transposition | Progressions | Pass root/chord context from Explore when useful |
| Genre and progression-context mode | Progressions | Remove genre from Explore |
| Playing style and rubato | Practice or player details | Expose from Chord options only when preview behaviour needs it |
| Harmony explanations | Understand section | Expand through progressive disclosure |
| Next-chord suggestions | Harmony helper or Progressions | Do not mix them with chord-type selection |
| Better-inversion suggestions | Near the inversion control or Harmony helper | Add a contextual suggestion without replacing manual selection |
| Recently viewed | Future history surface | A small recent section may appear below Explore later, not above the piano |
| Technique explanations | Practice and contextual help | Use short plain-language explanations in Explore |
| Common progressions | Progressions | No progression controls on the current Explore screen |

### Navigation rule

The backlog explicitly says not to add product navigation yet. Follow that rule.

When Favourites, Progressions, Practice, or Settings are actually built:

- Desktop can use a compact side navigation if the number of destinations justifies it.
- Mobile can use bottom navigation for the three or four most frequent tasks.
- Settings remains a gear or secondary destination rather than a primary learning tab.
- Do not show empty, disabled, or coming-soon destinations.

## Detailed user flows

### Flow A — Learn a chord

1. The user opens Explore in Chord view.
2. A useful default such as C major is already selected.
3. They select G from the visible root buttons.
4. The Explore list becomes Explore G chord types.
5. They select the G6 card.
6. The page shows G6 and highlights G, B, D, and E.
7. They press Hear G6.
8. The displayed keys animate and the exact chord sounds.

No dropdown is required.

### Flow B — Learn a scale

1. The user selects Scale in Show on piano.
2. The inversion selector disappears.
3. Explore G scales becomes the active selection area.
4. The user selects Major.
5. The keyboard shows only notes in G major.
6. The information section shows only scale notes and scale information.
7. They press Hear G major scale to hear it in order.

The previously selected chord remains stored but invisible.

### Flow C — Compare a chord with a scale

1. The user selects Both.
2. The selected chord and scale overlays appear together.
3. The legend explains root, chord note, scale note, and shared note.
4. The information section lists chord notes, scale notes, and shared notes separately.
5. The user can hear the chord or scale using separate buttons.
6. Selecting a different chord card preserves the selected scale.
7. Selecting a different scale card preserves the selected chord and inversion.

### Flow D — Compare inversions

1. In Chord or Both view, the user selects 1st inversion.
2. The chord notation updates to slash notation where appropriate.
3. The keyboard changes without moving the rest of the layout.
4. Hear G6 plays the displayed inversion.
5. The user compares Root, 1st, 2nd, and 3rd using the inline buttons.
6. Switching to Scale hides inversion; returning restores it.

### Flow E — Hear an individual note

1. The user taps any on-screen piano key.
2. The note sounds immediately.
3. The pressed state appears briefly.
4. The original chord/scale overlay returns.
5. The selected root, chord, scale, and inversion do not change.

### Flow F — Change root in Both view

1. The user selects A from the root buttons.
2. The selected chord type and scale type remain conceptually the same where supported.
3. G6 becomes A6 and G major becomes A major.
4. Inversion is recomputed for the new root.
5. Both Explore headings and the keyboard update together.
6. Playback remains silent until requested.

### Flow G — Open a future advanced catalogue

1. The user selects See all chord types or See all scales.
2. A focused drawer, modal, or dedicated catalogue displays the full supported set.
3. Category buttons and search help with large catalogues.
4. The user selects an item.
5. The catalogue closes and focus returns to the updated selection summary.
6. The piano and information update without navigating away from Explore.

## Responsive behaviour

### Desktop

- Use a centred one-column workspace around 960–1120px wide.
- Show the 12 root buttons in one line when their labels remain readable.
- Place inversion in the same selection region, typically on a second compact row or aligned beside the root group when space permits.
- Keep the piano, selected summary, and playback visible before the Explore catalogues.
- Show chord and scale catalogue previews sequentially in Both view rather than as two dense full-width grids side by side.

### Tablet

- Use a two-row root layout if dual accidental labels no longer fit.
- Put inversion on its own row.
- Use a bottom sheet for Chord options.
- Reduce the visible piano range instead of shrinking keys below a usable size.

### Mobile

- Keep Show on piano near the top.
- Make the 12-note selector horizontally scrollable with a visible continuation cue, or use a balanced grid. Do not convert it to a dropdown.
- Keep the selected root visible when possible.
- Place inversion on a separate horizontally scrollable segmented row.
- Display approximately 1.5–2 octaves with practical key widths.
- Prioritise the active view's playback action.
- In Both view, stack chord and scale information and catalogue previews.
- Add bottom navigation only when the related screens exist.

## Accessibility

- Meet WCAG 2.2 AA contrast.
- Use at least 44 × 44px pointer targets where practical.
- Give each root button an accessible name, including both enharmonic names where shown.
- Treat the root button group, view selector, and inversion selector as keyboard-operable single-selection groups.
- Provide visible focus states.
- Give piano keys names such as “G4, root, chord and scale note.”
- Announce changes to the selected chord, scale, and inversion without rereading the entire page.
- Do not communicate overlay roles by colour alone.
- Honour reduced motion.
- Provide visual feedback for audio.
- Ensure Scale view removes chord content semantically as well as visually.
- Return focus correctly after closing Chord options or a full catalogue.

## Visual direction

- Warm off-white background and deep charcoal text.
- One calm saturated blue for chord tones and primary actions.
- A related teal or cyan treatment for scale-only tones.
- Warm amber for roots.
- Friendly sans-serif typography.
- Sentence-case labels.
- Strong type hierarchy and generous whitespace.
- Fewer bordered panels; group related controls through spacing.
- 12–16px radii and restrained shadows.
- Avoid tiny monospaced uppercase labels.
- Make the piano the dominant visual, not the control bar or catalogue.

## Immediate implementation order

### Phase 4 alignment

1. Finish inversion buttons, slash notation, and exact inversion playback.
2. Finish open voicing and left/right-hand arrangements inside Chord options.
3. Correct scale-degree markers so they appear once from the first visible root.
4. Correct the Notes/Understand section so Scale view never contains chord notes.
5. Improve piano sound without changing the interface hierarchy.
6. Verify playback always matches the displayed root, chord, scale, inversion, and arrangement.

### Explore clarity redesign

1. Promote Chord / Scale / Both to the primary selection region.
2. Remove the Chord quality dropdown.
3. Keep and rebuild the 12-button chromatic root selector.
4. Make Explore chord cards the only chord-type selector.
5. Add Explore scale cards as the scale-type selector.
6. Add mode-aware selection summaries, overlays, information, and playback.
7. Remove key/mode, keyboard range, and genre controls from the main Explore surface.
8. Validate desktop, tablet, mobile, keyboard, screen-reader, and offline behaviour.

### Later UI work

1. Build Settings and move persistent preferences.
2. Build Favourites and recently viewed.
3. Build Practice.
4. Build Progressions, genre context, transposition, and backing tracks.
5. Add persistent playback and metronome.
6. Add navigation only as these destinations become real.
7. Expand harmony-helper content through progressive disclosure.

## Acceptance criteria

The Explore redesign is complete when:

- All 12 chromatic root notes are directly selectable without a dropdown.
- The Chord quality dropdown no longer exists.
- Chord, Scale, and Both are visible primary modes.
- Chords are selected from Explore chord types.
- Scales are selected from Explore scales.
- Both mode preserves and displays independent chord and scale selections under the shared root.
- Inversion is inline in Chord and Both modes and absent in Scale mode.
- The piano distinguishes root, chord-only, scale-only, and shared notes accessibly.
- Scale-degree markers appear only once from the first visible root.
- Scale view contains no chord notes in either visible or accessibility content.
- Playback matches the exact displayed musical selection.
- Individual piano keys remain playable.
- Voicing and hand arrangement are available through contextual Chord options.
- Persistent preferences and genre controls no longer compete with Explore's primary task.
- The page remains usable on small screens without changing root selection to a dropdown.
- No navigation to unfinished screens is shown.

## Out of scope

- Designing every future screen in detail.
- Supporting different chord and scale roots inside the basic Explore workspace.
- Building a combined chord-plus-scale playback sequence without a defined exercise.
- Adding account, social, analytics, streak, or gamification UI.
- Exposing advanced modes and uncommon chord qualities by default.
