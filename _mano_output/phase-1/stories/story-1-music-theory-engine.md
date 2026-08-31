### STORY-1: Music theory engine

#### What and why
The theory engine is the single source of musical truth on the screen. A beginner who picks e.g. `A` + `maj7` must see the right notes, the right scale, and the right variations without the UI or the audio layer ever computing an interval itself — so the engine is pure, deterministic, and fully unit-tested before anything visual depends on it.

#### Done when
- Test: `chordTones` returns the correct pitch classes for every supported quality (e.g. C major → C, E, G; A maj7 → A, C♯, E, G♯; A7 → A, C♯, E, G).
- Test: `scaleTones` returns the correct pitch classes for both scale types across a full-octave range (e.g. C major and A natural-minor spellings).
- `noteName`/`chordName` return sharp spellings (e.g. "C", "C♯", "A", "Am", "A7", "Amaj7", "A♯").
- Test: `variationsFor` returns all catalogue qualities for a root except the supplied current quality, in catalogue order.
- Test: `rootPositionVoice` returns MIDI notes in the default C3–B4 band with inversion `0` for a given chord.
- The module has no DOM, audio, React, or network usage (pure feature module).

#### Not this story
- Any UI, selectors, playback, or audio.
- Voicings beyond root-position close, inversions, or scale-degree computation.

#### Notes
Depends on `story-0` for the runnable project and test runner. Interval data is defined canonically in `tech-spec.md §Data model`; the engine reads it from its own catalogue. This is the module `mano stories` and later stories reference for all pitch/interval facts.

#### Implementation Reference
- **Build:** `musicCore` pure TypeScript module — `PitchClass` (0–11), `ChordQuality` (major, minor, diminished, augmented, sus2, sus4, 6, 7, maj7, m7, 9, add9), `ScaleType` (major, naturalMinor)
- **Contract:** `chordTones(root, quality)`, `scaleTones(root, scaleType)`, `rootPositionVoice(chord)`, `variationsFor(root, currentQuality)`, `chordName(root, quality)` — exact signatures, inputs, and failure behaviour in `tech-spec.md §Public / integration interface contracts`
- **Data:** interval patterns and sharp-naming rules in `tech-spec.md §Data model`
- **Rules:** Folder Structure (musicCore is pure TS, no React/audio/DOM), Naming (sharp pitch-class labels), Architecture (theory never touches audio/UI), Testing (unit-test all 12 qualities + both scales) — `project-rules.md`
- **Do not:** place audio or React code in this module; stretch to flat spellings or notation config (deferred)

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->