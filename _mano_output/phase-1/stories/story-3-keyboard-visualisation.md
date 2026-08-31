### STORY-3: Keyboard visualisation

#### What and why
The piano keyboard is the visual focus of Explore. A beginner reads a chord, its scale, and the root directly off the keys — strong chord-tone highlighting, subtle scale-note highlighting, and a distinct root marker must all render correctly and stay distinguishable without colour alone.

#### Done when
- The keyboard renders the octave range from the store with pitch-accurate white and black keys.
- Chord tones are strongly highlighted and other scale notes subtly highlighted for the current selection.
- The root note carries a distinct marker (label or pattern, not colour alone).
- Test: Chord, Scale, and Both display modes each show the correct set of highlighted keys.
- Test: the keyboard highlights update immediately (same render pass response) when the store selection changes.
- Note-name labels are optional (toggle off/on 0..n), and octave-range changes re-layout the keys.

#### Not this story
- Playing sounds from the keyboard (audio — `story-5`).
- Inversions, bass-note markers, voicing other than root-position close, scale degrees.
- Anything beyond the Explore keyboard surface.

#### Notes
Non-colour distinction is an explicit product requirement (§10), so the root marker must survive the "colour-free" judgement. The visual layer is non-canonical until `mano ui`; match the design brief when it exists, else keep clean defaults.

#### Implementation Reference
- **Build:** keyboard visualisation component reading `useSelectionStore` + `musicCore` for tone sets; octave-range control
- **UI:** Chord/Scale/Both modes; root-note marker; optional note-name labels outside the keyboard
- **A11y:** non-colour distinction for chord tone / scale note / root per `project-rules.md §Accessibility` and the phase brief §10; keyboard-accessible octave control
- **Rules:** Components — read store, never own the model (`project-rules.md §Components`); Naming — pitch classes via musicCore
- **Do not:** play audio in this story; render any real notes without going through the store/musicCore; invent markers that rely on colour alone

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->