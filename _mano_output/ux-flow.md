# UX Flow — Piano Chord Explorer

Phase-1 scope is a single screen. There is no navigation between screens this phase; the Explore screen is the whole product. Later phases (favourites, metronome, settings, progressions) will add screens and a nav structure, but none of that exists yet.

## Screens

### Explore

**How it's accessed:** This is the first and only screen. The app opens straight onto it with a useful default (C major) so nothing is empty on first load.

**How the user gets back:** Not applicable — there are no other screens this phase.

**What the user sees (top to bottom):**
- Header: app title, the current chord name (e.g. "C", "Am7"), a slash-chord label when the current inversion moves the bass off the root (e.g. "C/E"), the inversion's plain name (e.g. "1st inversion") shown next to it whenever it isn't root position, and a light/dark theme switch.
- Controls: root-note selector, chord-quality selector, an "Advanced: key / mode" control (collapsed until opened), a "Scale follows" choice (chord root or selected key), a view-mode choice (chord / scale / both), and an octave-range control.
- Arrangement: an inversion selector (Root position, 1st, 2nd, 3rd, … — only as many options as the current chord quality actually has) and a voicing selector (Close, Open, Left/Right hands). Sits directly beside the chord-quality selector, since choosing an arrangement is part of choosing *this exact chord*, not a separate step.
- Piano keyboard spanning the screen width, with keys marked to show the chord root, chord tones, and scale notes, plus the bass note of the current voicing (its own distinct marker, since inversions move the bass away from the root) and, for the Left/Right-hands voicing, which keys belong to which hand. On small screens the keyboard band scrolls horizontally; the visible octave range extends downward on its own if a Left/Right voicing's bass note would otherwise fall off the bottom.
- Playback bar: Play chord, Arpeggiate, Play scale, and a reading of playback state ("Ready" / "Playing…" / Stop while playing).
- Variation panel: a list of variations of the current root (e.g. C6, C7, Cmaj7, C9, Csus2, Csus4, Cadd9), each labelled with a short genre-guidance note (e.g. "Common in Blues") and highlighted when it is the current selection.

**What the user can do:**
- Change the root note.
- Change the chord quality.
- Open the advanced control and change the key root or mode.
- Choose whether the scale follows the chord root or the selected key.
- Switch the view between chord only, scale only, or both.
- Change the octave range the keyboard shows.
- Pick an inversion for the current chord.
- Pick a voicing (Close, Open, or Left/Right hands) for the current chord, independently of the inversion — any inversion works with any voicing.
- Play the chord, arpeggiate it, or play the scale up and down.
- Tap or hold keys to hear individual notes (simultaneous presses sound together where the device allows).
- Select a variation to make it the current chord.
- Toggle light/dark theme.

**What happens on action:**
- Every selector change updates the keyboard highlights, the chord label, the scale, and the variations immediately — there is no separate "apply" step. The selection and the sound always reflect the same chord.
- Playing the chord sounds exactly the chord shown, in the exact inversion and voicing currently selected; arpeggiate rolls the same notes one at a time; play scale ascends then descends. Starting a new playback supersedes the previous one.
- Changing the inversion re-orders the keyboard's bass-to-treble marking, updates the slash-chord label and inversion name in the header, and re-voices playback — the root note and quality selection do not change.
- Changing the voicing re-spaces the marked keys (or splits them by hand for Left/Right) and re-voices playback, independently of whatever inversion is selected; switching chord quality to one with fewer inversions than currently selected drops the inversion back to the highest one that quality still supports.
- Selecting a variation replaces the current quality (the root stays fixed), re-highlights the keyboard, and plays the new chord without any confirmation step.
- Changing the theme re-colours the whole screen instantly.

**Primary actions:** The screen is built around one loop — *choose a chord, immediately see and hear it*. Within that loop there are two action clusters: selection (root, quality, key, inversion, voicing — arrangement is part of choosing the chord, not a separate job) and playback (play chord, arpeggiate, play scale). They belong to the same job, so they stay on one screen by design; each cluster is visually separate so ownership is obvious.
