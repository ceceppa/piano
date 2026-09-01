# Phase Brief — Piano Chord Explorer — Phase 5

## Why This Phase

Two reviews in a row have said the Explore screen is confusing — the Phase 2 review flagged it, and the Phase 4 review confirmed that adding inversions and voicings made it worse. The redesign that answers this is already written down in `ux-flow.md` and `design-brief.md`; this phase builds it.

## Design Principle

Each control region asks the person for one kind of choice, and the answer is visible on the keyboard and audible straight away.

## Core Product Principles

- Select something and immediately see and hear the musical result.
- A useful default is always visible on first load — the screen is never empty and no configuration is required before value is demonstrated.
- Colour is never the only indicator; playback and musical states need non-colour text or motion indicators.
- Musical concepts stay distinct: key/mode, chord, variation, voicing, inversion, genre, performance.

## Phase Goal

A person can pick a root, a chord type and a scale type directly on Explore, in one clear region, and see and hear the result without hunting for the control that did it.

## Phase Scope

1. **Primary selection region**
   a. **View selector** — a person chooses Chord, Scale or Both from a visible control near the top, and that choice sets what the whole screen shows
   b. **Root selector** — all twelve chromatic roots are directly selectable buttons, never a dropdown, and one root drives both the chord and the scale
   c. **Inversion selector** — inversion sits in the same tier as the view and root controls in Chord and Both views, and does not appear in Scale view
   d. **Removed controls** — the chord-quality dropdown, the key/mode control, the keyboard-range control and the genre control no longer appear on Explore

2. **Direct chord and scale pickers**
   a. **Explore chord types** — the grouped chord-type list becomes the only way to choose a chord type; choosing one updates the title, the inversion options, the keyboard, the information section and playback, and keeps the selected scale
   b. **Explore scales** — a parallel list chooses the scale type from the scales the app already supports; choosing one keeps the selected chord and inversion
   c. **Both view stacking** — in Both view both lists sit below the piano, chord types first, with every supported option visible in each

3. **Selection summary and learning information**
   a. **Selection summary** — one line names what is currently selected in the active view, adding the slash-chord symbol and inversion name when an inversion is chosen
   b. **Understand section** — replaces the Notes panel: the current chord's or scale's notes plus one short plain sentence about it; Scale view shows no chord content, on screen or to a screen reader; Both view adds a shared-notes row
   c. **Intervals and scale degrees** — an optional detail row expands inside that section without moving the person off the page

4. **Keyboard overlays and playback**
   a. **Four note roles** — the keyboard tells root, chord-only, scale-only and shared notes apart by shape as well as colour
   b. **Legend** — a compact key beside the piano names only the roles the active view actually uses
   c. **Playback row** — one primary action for the current view, one secondary action that changes with the view, and a Chord options control that opens voicing and hand arrangement in Chord and Both views
   d. **Single-note play** — tapping any key still sounds that note alone and changes nothing about the current selection

5. **Responsive and accessible behaviour**
   a. **Small screens** — the root and inversion selectors scroll or wrap instead of collapsing into dropdowns, and the piano stays usable without the removed range control
   b. **Keyboard and screen reader** — view, root and inversion each behave as one single-select group under the arrow keys, and a selection change is announced without re-reading the page
   c. **Remembered selections** — the chord, inversion and scale a person last chose survive switching between views

## Not This Phase

- Key and mode selection anywhere in the product — it leaves Explore now and comes back when a screen owns it.
- Genre selection and genre-based guidance.
- A Settings screen, and the keyboard-range and note-name preferences that belong on it.
- New scale types — the picker ships with the scales the app already supports, and nothing is added to the catalogue.
- An Advanced or See-all catalogue for less common chord qualities and modes; every supported option stays visible.
- Harmony-helper content beyond the single plain sentence in the Understand section — no chord function in the key, no diatonic labelling, no next-chord suggestions.
- Navigation to Favourites, Metronome, Practice or Progressions, and the screens themselves.

## Exit Criteria

1. **First load**
   a. Open the app with no saved selection: Chord view is active and a default chord is already shown on the keyboard, with nothing empty

2. **Direct selection**
   a. Look at the top of the screen: all twelve roots are selectable buttons and there is no chord-quality dropdown anywhere on Explore
   b. Choose a chord type from Explore chord types: the title, the inversion options, the keyboard, the Understand section and playback all update
   c. Switch to Scale view and choose a scale: the keyboard and Understand section update and the chord list is hidden
   d. Switch back to Chord view: the chord and inversion chosen earlier are still selected

3. **Both view**
   a. Switch to Both view: the chord and the scale are both marked on the keyboard, and a shared note is distinguishable from a chord-only and a scale-only note by shape, not colour alone
   b. Look below the piano in Both view: both lists are there, chord types first, with every supported option visible in each
   c. Read the Understand section in Both view: it lists the chord notes, the scale notes and the shared notes

4. **Scale view stays clean**
   a. Switch to Scale view: the Understand section contains no chord notes, both on screen and in what a screen reader announces
   b. Look at the selection region in Scale view: the inversion selector is not shown

5. **Playback and arrangement**
   a. Press the primary playback action in each of the three views: what sounds matches the displayed root, chord or scale, inversion and voicing
   b. Open Chord options in Chord view: voicing and hand arrangement are both there, changing either updates the keyboard and playback, and closing returns focus to the control that opened it
   c. Tap a single piano key: that note alone sounds and the current selection does not change

6. **Small screens and keyboard use**
   a. Narrow the window to a phone width: the root selector still shows buttons rather than a dropdown, and every piano key is still reachable and tappable
   b. Move through the view, root and inversion selectors using only the arrow keys: each moves within its own group and the focused option is clearly visible

## Validation Plan

### Questions

- **Q1.** Is Explore actually clear now, or does the "a bit confusing" feedback from the Phase 2 and Phase 4 reviews still stand?
- **Q2.** Does removing key, mode, genre and the keyboard-range control from Explore take away anything you were really using?
- **Q3.** With only the two scales the app already supports, does the Explore scales list read as a real catalogue or as a placeholder?

### Try

- Pick a root, then a chord type, then a scale, moving through all three views, and notice whether you ever have to hunt for the control that changes something. (Q1)
- Use the app for one real chord-learning session and note every moment you reach for a control that is no longer there. (Q2)
- Open Scale view and then Both view and judge whether the scale list looks finished enough to be worth using. (Q3)

## Assumption Log

| ID | Assumption | Risk if wrong |
|---|---|---|
| A1 | The scale picker is a deliberately narrowed version of the deferred "Additional scales, modes, chord qualities and genres" item: more scales extend this list rather than change how it is grouped or filtered | The redesign has to be reopened to fit the larger catalogue, and the grouping decided here gets thrown away |
| A2 | Removing the keyboard-range control does not make the piano unusable on a small screen, because horizontal scrolling already covers it | Small-screen users lose a way to reach notes outside the visible range, and the deferred "Piano usability on small screens" item becomes a regression fix instead of an improvement |
| A3 | Showing every chord type and every scale at once stays readable in Both view because the current catalogue is small | Both view stacks two long lists under the piano and reintroduces the clutter this phase exists to remove |
| A4 | Key and mode selection can be absent from the whole product until a later screen owns it | Someone who used key or mode to choose a scale has no replacement in the meantime |

## Acknowledged Risks

- The redesign moves nearly every part of Explore at once, so behaviour confirmed in Phase 4 — inversions, voicings, scale markers, piano sound — can regress while the layout around it changes.
- The Understand section needs one short plain sentence for every supported chord type and scale; written badly they make the screen wordier rather than clearer.
- Both view carries the most information of the three modes and is the most likely to still feel busy after the redesign.
