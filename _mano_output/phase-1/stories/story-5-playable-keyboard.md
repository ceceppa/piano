### STORY-5: Playable keyboard and polyphonic playback

#### What and why
The on-screen keyboard must be playable, not visualisation-only: pressing a key immediately sounds that note, and held keys sound together polyphonically when the input allows. This is the "hear" half of the core see-and-hear loop.

#### Done when
- Pressing or tapping a keyboard key immediately plays that note (within ~50 ms perceived latency).
- Holding or pressing multiple keys at once sounds them together polyphonically.
- Releasing a key stops only its own note; other held keys keep sounding.
- Keyboard press/release routes through `audioEngine.init()`, creating the shared `AudioContext` on the first user gesture only.
- Test: `noteOn`/`noteOff` with the same MIDI pitch allocate and release a voice correctly (voice pool reused).

#### Not this story
- Playing chords/scales as sequences, arpeggios, or metronome.
- Sustaining/voicing logic beyond per-key oscillator voices.
- Chord playback matching the displayed selection (that wiring arrives with the variation/playback stories).

#### Notes
Depends on the keyboard rendering from `story-3` and the audio engine decision in `tech-spec.md §Key technical decisions` (voice pool, gesture-created `AudioContext`). Autoplay policy is the reason `init()` must come from a user gesture; the public `audioEngine` contract for note playback is in the tech spec.

#### Implementation Reference
- **Build:** `audioEngine` (Web Audio voice pool, `init`, `noteOn(midi)`, `noteOff(midi)`) per `tech-spec.md §Public / integration interface contracts` and `§Key technical decisions`
- **UI:** wire keyboard key events (pointerdown/up, keydown/up) from `story-3`'s keyboard component to `audioEngine`
- **Contract:** exact `noteOn`/`noteOff` signatures and failure behaviour in `tech-spec.md §Public / integration interface contracts`
- **A11y:** accessible names and state announcements for audio controls; non-colour playback state (`project-rules.md §Accessibility`, phase brief §10)
- **Rules:** Architecture — audio never computes intervals; Patterns — Audio, route every audio call through `audioEngine`; Testing — unit-test the voice pool, keep `AudioContext` behind the seam
- **Do not:** create an `AudioContext` before a user gesture; let components build oscillator graphs inline; add sustain/metronome/sequence features

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->