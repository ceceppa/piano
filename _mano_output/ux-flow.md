# UX Flow — Piano Chord Explorer

Phase-1 scope is a single screen. There is no navigation between screens this phase; the Explore screen is the whole product. Later phases (favourites, metronome, settings, progressions) will add screens and a nav structure, but none of that exists yet.

## Screens

### Explore

**How it's accessed:** This is the first and only screen. The app opens straight onto it with a useful default (C major) so nothing is empty on first load.

**How the user gets back:** Not applicable — there are no other screens this phase.

**What the user sees (top to bottom):**
- Header: app title, the current chord name (e.g. "C", "Am7"), and a light/dark theme switch.
- Controls: root-note selector, chord-quality selector, an "Advanced: key / mode" control (collapsed until opened), a "Scale follows" choice (chord root or selected key), a view-mode choice (chord / scale / both), and an octave-range control.
- Piano keyboard spanning the screen width, with keys marked to show the chord root, chord tones, and scale notes. On small screens the keyboard band scrolls horizontally.
- Playback bar: Play chord, Arpeggiate, Play scale, and a reading of playback state ("Ready" / "Playing…" / Stop while playing).
- Variation panel: a list of variations of the current root (e.g. C6, C7, Cmaj7, C9, Csus2, Csus4, Cadd9), each labelled with a short genre-guidance note (e.g. "Common in Blues") and highlighted when it is the current selection.

**What the user can do:**
- Change the root note.
- Change the chord quality.
- Open the advanced control and change the key root or mode.
- Choose whether the scale follows the chord root or the selected key.
- Switch the view between chord only, scale only, or both.
- Change the octave range the keyboard shows.
- Play the chord, arpeggiate it, or play the scale up and down.
- Tap or hold keys to hear individual notes (simultaneous presses sound together where the device allows).
- Select a variation to make it the current chord.
- Toggle light/dark theme.

**What happens on action:**
- Every selector change updates the keyboard highlights, the chord label, the scale, and the variations immediately — there is no separate "apply" step. The selection and the sound always reflect the same chord.
- Playing the chord sounds exactly the chord shown; arpeggiate rolls the same notes one at a time; play scale ascends then descends. Starting a new playback supersedes the previous one.
- Selecting a variation replaces the current quality (the root stays fixed), re-highlights the keyboard, and plays the new chord without any confirmation step.
- Changing the theme re-colours the whole screen instantly.

**Primary actions:** The screen is built around one loop — *choose a chord, immediately see and hear it*. Within that loop there are two action clusters: selection (root, quality, key) and playback (play chord, arpeggiate, play scale). They belong to the same job, so they stay on one screen by design; each cluster is visually separate so ownership is obvious.
