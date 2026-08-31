# Phase Brief — Piano Chord Explorer — Phase 1

## Why This Phase

The whole product is "select something and immediately see and hear the musical result." This phase builds that core interaction on a playable piano keyboard, giving the Explore screen a usable chord–scale–variation core before progressions, favourites, and playback features stack on top.

## Vision

Pick a chord by root and quality, and instantly see it on a piano keyboard with its scale and useful variations, and hear it exactly as displayed. A beginner should land, play C major, and get value without configuring anything.

## Design Principle

Selection is instantly audible and visible: change any selector and the keyboard, labels, and sound update together with no extra step.

## Core Product Principles

- Select something and immediately see and hear the musical result.
- A useful default is always visible on first load.
- Colour is never the only indicator; musical states need non-colour text or motion cues.

## Phase Goal

The user can select a root, chord quality, and key/mode and immediately see the chord, its scale, and common variations on a keyboard and hear the exact displayed chord, scale, and variations.

## Phase Scope

- Root-note selector: all 12 chromatic pitch classes.
- Chord-quality selector with the common catalogue (major, minor, diminished, augmented, sus2, sus4, 6, 7, maj7, m7, 9, add9).
- Key/mode selector (advanced control) that the scale display can follow instead of the chord root.
- Piano keyboard visualisation with strong chord-tone, subtle scale-note, root-note, and bass-note markers; optional note names and scale degrees; Chord/Scale/Both modes; selectable octave range.
- Playable keyboard: each key sounds its note immediately on press; simultaneous presses sound polyphonically.
- Play chord, arpeggiate, and play-scale-up-and-down actions; chord playback matches the exact displayed selection.
- C major as the default first-load selection so the screen is never empty.
- Chord variation list (e.g. A6, A7, Amaj7, A9, Asus2, Asus4, Aadd9) with genre-relevance guidance labels; selecting a variation updates keyboard and playback immediately.
- Major and natural-minor scale support; scale display defaults to the chord root with a key-follow override.
- Musical model keeps key/mode, chord, chord variation, and scale distinct so later concepts (voicing, inversion, genre, performance) extend rather than rework.
- Chord tones, scale notes, root, and bass distinguishable without colour alone.

## Not This Phase

- Chord inversions, open voicings, and left/right-hand arrangements.
- Common progressions, progression playback, transposition, or progression-context modes.
- Playing style and performance controls (articulation, rhythmic feel, chord texture, expression, piano patterns, rubato).
- Backing tracks, metronome, persistent player, or tempo handling.
- Favourites and saving; settings; local backup import/export.
- Music theory helper, practice mode, or navigation across multiple screens.
- Full keyboard-accessibility and announcement sweep; genre playback presets.

## Exit Criteria

1. First load
   - App opens: C major chord, scale, and variations visible on a playable keyboard
2. Selection
   - Change root note: keyboard highlights, chord label, scale, and variations update immediately
   - Change chord quality: chord and scale update immediately
   - Change key/mode: scale display follows the key when the key-follow choice is selected, otherwise the chord root
3. Playback
   - Press or tap a single key: that note sounds immediately
   - Hold multiple keys: they sound together polyphonically
   - Play chord: the exact displayed chord sounds; Arpeggiate: notes roll one at a time; Play scale: scale plays ascending and descending
4. Variations
   - Select a variation (e.g. Asus4): keyboard, chord label, and sound update immediately
5. Accessibility
   - Chord tones, scale notes, root, and bass are each distinguishable without relying on colour alone

## Validation Plan

- **Decision this informs:** Whether the see-and-hear Explore core is compelling enough to build progressions, favourites, and playing-style controls on top.
- **Evidence to gather:** Select a range of roots/qualities/keys, play variations and scales, and confirm the keyboard always matches what is heard; check distinctness without colour.

## Assumption Log

| Assumption | Risk if wrong |
|---|---|
| The musical model keeps chord, scale, key, and variation as separate concepts now, so later voicings/inversions/genre/performance extend rather than rework. | Phase 1 collapses them and later phases force a rework. |
| Genre guidance on variations is curated static labels, not computed from genre logic. | A later genre system duplicates or supersedes the labels. |
| Chord playback uses the currently displayed voicing/inversion state, which in Phase 1 is always a root-position close voicing. | Later voicings/inversions must be AI-aware or reworked. |

## Acknowledged Risks

- Polyphonic input depends on the browser's key and pointer event support; desktop and mobile may differ.
- Making the keyboard polyphonic and fault-tolerant on small screens is fiddly.
- The 12-quality catalogue plus genre labels in one panel could crowd the Explore screen.

## Stated Technical Preferences

Verbatim from the source; not scoped or decided by `mano start`. `mano spec` evaluates these and must flag any override.

- "Platform: Responsive browser application"
- "Initial operating mode: Offline-first, single user, local data"
- "Remain useful without an account or internet connection after installation."
- "Data is stored locally."