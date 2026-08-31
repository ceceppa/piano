# Phase Review — Piano Chord Explorer

---

## Phase 1 Review — Aug 12 2026

### Evidence

- **Status:** partial
- **Method:** Not recorded
- **Observed:** Chord-root marker (dot/diamond) not visible enough on the keyboard; layout brief in `_mano_output/phase-1/feedback.md` re-prioritises the screen around the selected chord.

### Decision

- **Outcome:** Not assessed
- **Reason:** Not recorded

### Assumption results

| Assumption | Outcome | Evidence / consequence |
|-----------|---------|------------------------|
| The musical model keeps chord, scale, key, and variation as separate concepts now, so later voicings/inversions/genre/performance extend rather than rework. | confirmed | User confirmed. |
| Genre guidance on variations is curated static labels, not computed from genre logic. | confirmed | User confirmed. |
| Chord playback uses the currently displayed voicing/inversion state, which in Phase 1 is always a root-position close voicing. | confirmed | User confirmed. |

### Backlog changes

- [bug] Chord-root marker is not distinguishable enough on the keyboard — root cue too subtle to identify the studied chord at a glance.
- [refinement] Make the selected chord the prominent screen title — full readable name, short symbol stays in controls/tiles.
- [refinement] Prioritise root note and chord quality controls over display preferences — root/quality dominant; demote scale-follow, view, range, note names, genre.
- [refinement] Reduce the form-like feeling of the Musical Context area — lighter, fewer borders, spacing hierarchy.
- [refinement] Place the keyboard directly after the root and quality controls — selection visibly drives the highlighted keyboard.
- [refinement] Keep playback attached beneath the keyboard with Play chord as the primary action — Arpeggiate/Play scale secondary.
- [refinement] Rename the variations section to 'Explore [root] chord types' — shared-root qualities, not variations of the current chord.
- [refinement] Group related chord types with the chord name visually dominant — Core / Colour / Sevenths & extensions.
- [refinement] Replace the long single-column variation list with compact selectable tiles or a responsive grid — clearer selected state, faster comparison.
- [refinement] Do not add product navigation yet — sidebar/bottom nav deferred until destinations are functional.

### Durable learning

- The root marker must carry visual weight comparable to a keyboard highlight, not a small overlaid shape — colour is already paired with shape (design principle), but the shape itself needs to read at a glance. Review surfaced this as the phase's only defect.
