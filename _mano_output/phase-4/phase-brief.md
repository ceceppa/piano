# Phase Brief — Piano Chord Explorer — Phase 4

## Why This Phase

Chords and scales already display and play correctly; this phase makes them controllable and makes the playback sound like a real piano instead of the current, irritating tone.

## Vision

The user picks an inversion or voicing the same way they already pick a root note or chord quality, hears it play back instantly through a piano that finally sounds like a piano, and the two small scale-display glitches from last phase are gone.

## Design Principle

A new inversion or voicing feels like a variation of the currently selected chord, not a new mode — the keyboard stays the single visible source of truth for what's selected.

## Core Product Principles

- Select something and immediately see and hear the musical result.
- Musical concepts stay distinct: key/mode, chord, variation, voicing, inversion, genre, performance.
- Colour is never the only indicator; playback and musical states need non-colour text or motion indicators.

## Phase Goal

The user can select any valid inversion together with any voicing for the current chord and see and hear it applied on the keyboard.

## Phase Scope

1. **Piano sound**
   a. **Realistic chord tone** — chord playback uses a more realistic piano sound in place of the current one
   b. **Realistic scale tone** — the existing scale ascending/descending playback uses the same realistic sound
2. **Chord inversions**
   a. **Inversion selection** — the user picks root position, first, second, or third inversion (and further for chords with five or more distinct tones)
   b. **Inversion display** — the keyboard shows the inversion's notes bass to treble, marks the bass note distinctly, and shows slash-chord notation (e.g. A/C♯) and the inversion name
   c. **Inversion playback** — playing the chord plays exactly the selected inversion, not the root position
3. **Chord voicings**
   a. **Voicing selection** — the user picks close, open, or left/right-hand voicing, independently of and combinable with any inversion
   b. **Hand grouping display** — the keyboard shows which notes belong to which hand using colour plus a non-colour indicator
   c. **Voicing playback** — playing the chord plays exactly the selected voicing and inversion combination
4. **Scale display fixes**
   a. **Scale-only notes panel** — with View mode set to scale, the notes panel lists only the scale's notes
   b. **Single-pass scale markers** — scale-tone markers appear once on the keyboard, starting at the scale's first visible root note, instead of repeating in every section

## Not This Phase

- Genre-specific voicing styles — this phase ships close/open/left-right-hand voicing only, independent of genre.
- Any expansion of the chord, scale, or genre catalogue beyond what already ships.
- Automatic inversion or movement suggestions (the harmony-helper "better inversions" capability) — this phase ships manual selection and display only.
- Progression-level playback, backing tracks, or the metronome — untouched by this phase.

## Exit Criteria

1. **Piano sound**
   a. Select a chord: it plays through the new, more realistic piano sound
   b. Play a scale ascending or descending: it also plays through the new, more realistic piano sound
2. **Chord inversions**
   a. Select a chord with four distinct tones: root position, first, second, and third inversion are all selectable
   b. Select an inversion: the keyboard shows its notes bass to treble from that inversion's bass note, the bass note is visually distinct, and the slash-chord notation and inversion name are shown
   c. Play the selected inversion: the sound matches the notes shown, not the root-position chord
3. **Chord voicings**
   a. Select the open voicing: the keyboard updates to the open-position note distribution
   b. Select the left/right-hand voicing: the keyboard shows which notes belong to each hand with colour plus a non-colour indicator
   c. Select any inversion together with any voicing: both apply together, on the keyboard and in playback
4. **Scale display**
   a. Set View mode to scale: the notes panel lists only the scale's notes, not the chord's
   b. Select a chord with scale notes shown: the scale-tone markers appear once, starting from the scale's first visible root note, not in every keyboard section

## Validation Plan

### Questions

- **Q1.** Does the new piano sound feel meaningfully more realistic, and less irritating, than the current one?
- **Q2.** With inversion and voicing controls added, does Explore still feel usable, or does it deepen the "a bit confusing" feedback from the Phase 2 review?

### Try

- Listen to chord and scale playback across several chords and compare against how the current sound feels today.
- Walk through selecting different inversions and voicings on Explore and judge whether the added controls read clearly.

## Assumption Log

| ID | Assumption | Risk if wrong |
|---|---|---|
| A1 | Every voicing (close, open, left/right-hand) is valid in combination with every inversion, with no combination excluded | If some combination is musically invalid for a given chord, the implementer needs a fallback this brief does not define |
| A2 | Colour plus a non-colour indicator is enough to distinguish left/right-hand grouping on the existing single keyboard, without a separate two-row layout | If it isn't legible enough, the keyboard's visual structure may need a bigger change than this phase scoped for |
| A3 | Voicing in this phase is deliberately genre-independent (close/open/left-right-hand only); genre-specific voicing is a separate, later capability | If genre-specific voicing lands later, the voicing model built here needs to extend rather than be reworked |

## Acknowledged Risks

- Swapping the piano sound engine touches every existing playback path; timing or latency regressions are possible.
- Two new selector controls land on a screen already flagged as "a bit confusing" — `mano ux` and `mano ui` need to actively address clarity, not just add controls.

## Stated Technical Preferences

<!-- Verbatim from the source; not scoped or decided by `mano start`. `mano spec` evaluates these and must flag any override. -->

- "we need to add @tonejs/piano for a more realisting piano sound as the current one is irritating"
- "Everything, all sounds needs to go via tonejs"
