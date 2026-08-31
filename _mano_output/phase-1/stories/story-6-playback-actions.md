### STORY-6: Chord and scale playback actions

#### What and why
Beyond single keys, the beginner can hear the exact displayed selection as a unit: play the chord, arpeggiate it, or run the scale up and down. Playback must sound precisely what the keyboard shows so hearing matches seeing.

#### Done when
- Play chord sounds the exact displayed selection: correct root, quality, and root-position close voicing of the current keyboard display.
- Arpeggiate plays the displayed chord's tones in sequence (low to high).
- Play scale plays the displayed scale ascending then descending, using the current scale source (chord-root or key) and mode.
- Test: `playChord` is called with the pitch set `musicCore` produces for the current selection.
- Starting a new playback action stops or supersedes any current one; playback state is visible via a non-colour indicator.
- Test: arpeggiate and scale-pattern actions schedule events in the correct ascending/descending order.

#### Not this story
- Metronome, backing tracks, tempo control, or progression playback.
- Playing-style/piano-pattern alternates (legato, arpeggio-style selectors are later).
- Saving favourites, or functionality dissociated from Explore.

#### Notes
- "Chord playback must sound the exact... currently displayed" is an explicit product requirement (§7). 
- Arpeggiate in this phase reuses the voice pool; event scheduling lives in `audioEngine`.
- Rhythmic-feel effects belong to later playing-style stories, not here.

#### Implementation Reference
- **Build:** playback actions in `audioEngine`: `playChord`, `playArpeggio`, `playScale` per `tech-spec.md §Public / integration interface contracts`
- **UI:** Play chord / Arpeggiate / Play scale controls wired to these actions; visible (non-colour) current-state indicator
- **Contract:** exact signatures, voice handles, and stop-supersede semantics in `tech-spec.md §Public / integration interface contracts`
- **A11y:** accessible names/state for playback actions (`project-rules.md §Accessibility`)
- **Rules:** Architecture — audio never computes pitch facts (read `musicCore` output); Testing — unit-test scheduling with mocked AudioContext
- **Do not:** add tempo, metronome, sustain pedal, or style presets in this story

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->