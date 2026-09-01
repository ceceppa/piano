# UX Flow — Piano Chord Explorer

Phase-1 scope is a single screen. There is no navigation between screens this phase; the Explore screen is the whole product. Later phases (favourites, metronome, settings, progressions) will add screens and a nav structure, but none of that exists yet.

## Screens

### Explore

**Revision note (ux-gap, phase-4 review Q2):** the description below replaces the previous Explore flow. Inversion and voicing landed in phase-4 on top of a screen already flagged "a bit confusing" in the Phase 2 review, and the review confirmed it was still confusing afterward. This revision follows the confirmed product decisions in `ui/newui.md`: the chord-quality dropdown, the "Advanced: key/mode" control, "Scale follows", the octave-range control, and genre context are removed from Explore — root, chord type, and scale type are chosen directly, and key/mode/genre move to a later, not-yet-built screen (Progressions).

**How it's accessed:** This is the first and only screen. The app opens straight onto it with a useful default (C major, Chord view) so nothing is empty on first load.

**How the user gets back:** Not applicable — there are no other screens this phase.

**What the user sees (top to bottom):**
- Header: app title and a light/dark theme switch. No other navigation — Settings, Favourites, Practice, and Progressions don't exist yet, so nothing links to them.
- Primary selection row: a Chord / Scale / Both view choice, a 12-note chromatic root selector (shared by chord and scale — there is one root, not two), and an inversion selector (Root, 1st, 2nd, 3rd, … — only as many options as the current chord quality has). Inversion is present only in Chord and Both views.
- Selection summary: a mode-aware line naming the current selection ("G6", "G major scale", or "G6 with G major scale"), plus, in Both view, small separate chord and scale indicators.
- Piano keyboard spanning the screen width, with keys marked for root, chord tone, scale-only tone, and a notes belonging to both; tapping any key plays that note alone.
- Understand section: the current chord's or scale's notes and a one-line plain-language explanation; in Both view it also lists which notes are shared. Scale view never shows chord notes here, in what's visible or in what assistive tech reads.
- Playback row: a primary "Hear [chord/scale]" action, one mode-aware secondary action (arpeggiate for a chord, play descending for a scale), and — Chord and Both view only — a "Chord options" control that opens voicing and hand-arrangement choices.
- Explore chord types: the direct chord-type picker for the current root (Chord and Both views).
- Explore scales: the direct scale-type picker for the current root (Scale and Both views). In Both view it appears below Explore chord types.

**What the user can do:**
- Switch between Chord, Scale, and Both view.
- Change the root note — updates chord and scale together, since they share one root.
- Pick an inversion (Chord and Both view only).
- Pick a chord type from Explore chord types (Chord and Both view).
- Pick a scale type from Explore scales (Scale and Both view).
- Open Chord options and pick a voicing (Close, Open, Left/Right hands), independently of and combinable with the inversion (Chord and Both view only).
- Play the current chord or scale, or its mode-aware secondary action (arpeggiate / play descending).
- Tap any piano key to hear that single note without changing the current selection.
- Toggle light/dark theme.

**What happens on action:**
- Switching the view shows or hides the view-specific selectors, Explore lists, Understand rows, and playback actions for that mode. The chord and the scale you last had selected stay remembered even while hidden — switching Both → Scale hides the chord without discarding it, and switching back to Both (or Chord) restores the exact chord and inversion you had.
- Changing the root updates the chord notation, the scale name, the keyboard, the Understand section, the playback labels, and both Explore lists together — it does not start playback on its own.
- Selecting a chord type updates the chord, the inversion options, the keyboard, the Understand section, and playback; the currently selected scale is preserved.
- Selecting a scale type updates the keyboard, the Understand section, and playback; the currently selected chord and inversion are preserved.
- Selecting an inversion re-orders the keyboard's bass-to-treble marking, updates the slash-chord notation and inversion name in the selection summary, and re-voices playback — the root and chord type do not change.
- Opening Chord options and changing voicing or hand arrangement updates the keyboard and playback immediately, independently of whatever inversion is selected; closing the panel (its own close control, an outside tap, or Escape) returns focus to the Chord options control that opened it.
- Playing the current chord or scale sounds exactly what's displayed — root, chord or scale, inversion, and voicing together; a new playback replaces whatever was already playing.
- Tapping a piano key plays that note alone; the key's normal overlay returns immediately after, and the current root, chord, scale, and inversion do not change.
- Changing the theme re-colours the whole screen instantly.

**Keyboard and screen-reader behaviour:**
- The view selector, root selector, and inversion selector are each a single-select keyboard group: arrow keys move the selection within the group, Home/End jump to its first/last option.
- Changing the selected chord, scale, or inversion is announced without re-reading the whole page.
- On narrow screens, the root selector and the inversion selector each scroll horizontally or wrap to a second row rather than becoming a dropdown; inversion moves to its own row below the root selector.

**Primary actions:** The screen is still built around one loop — *choose a root and a chord and/or scale, immediately see and hear it*. Four clusters carry that loop: shared selection (view, root), per-mode selection (chord type, scale type, inversion), contextual arrangement (voicing and hand grouping, one step deeper in Chord options since it refines a chord already chosen), and playback. Each cluster is a separate step so a person is never asked to weigh more than one kind of decision at a time.
