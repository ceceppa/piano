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

---

## Phase 2 Review — Aug 31 2026

### Validation

- **Result:** All five Exit Criterion groups (First load, Identification, Selection, Comparison, Playback) confirmed working. The root cue reads as legible on the keyboard. Two issues surfaced: the scale shown for at least one chord is wrong, and scale notes are hard to see on the keyboard.

### Phase checks

| # | Phase promise | Result | What happened |
|---|---|---|---|
| E1a | First load — App opens: the selected chord appears as a prominent screen title, and the keyboard is directly beneath the root/quality controls | passed | Confirmed. |
| E2a | Identification — User glances at the keyboard: the chord root is distinguishable without relying on colour alone | passed | Confirmed; root is legible (previously needs-human, resolved by this review). |
| E3a | Selection — User changes the root note: title, keyboard, scale, and related-chord section update immediately | passed | Confirmed; the update itself works, but the scale content it displays has a separate correctness bug (see Backlog changes). |
| E3b | Selection — User changes the chord quality: title, keyboard, and related-chord section update immediately | passed | Confirmed. |
| E3c | Selection — Root and quality read as dominant; display/context controls read as secondary; no large bordered form card | passed | Confirmed. |
| E4a | Comparison — User sees "Explore [root] chord types" with chords grouped as Core / Colour / Sevenths & extensions | passed | Confirmed. |
| E4b | Comparison — User taps a chord tile: title and keyboard update immediately, and the tile shows a clear selected state | passed | Confirmed. |
| E4c | Comparison — User changes the genre: chord types in "Explore [root] chord types" that suit the genre show a visible, non-colour "recommended" cue; no chord type is hidden, removed, or reordered; choosing "Any" shows no recommendation cue | passed | Confirmed. |
| E5a | Playback — User plays the chord, arpeggiates, and plays the scale from controls directly beneath the keyboard | passed | Confirmed. |
| E5b | Playback — Play chord is the primary action; Arpeggiate and Play scale are visually secondary | passed | Confirmed. |

### Decision

- **Choice:** Yes — the chord-first layout makes the Explore screen a better learning and practice surface worth extending, though the keyboard could be made even clearer by placing it directly under the root-note selector rather than after the full root+quality control block.
- **Why:** All Exit Criterion groups confirmed passing, and the root cue confirmed legible.

### Assumptions

| # | Assumption | Result | What showed this |
|---|-----------|---------|------------------------|
| A1 | The screen remains a single page with no navigation; the chord-first hierarchy works without tab/section chrome. | confirmed | Works, though the human noted the overall UI still feels a bit confusing and flagged it for a later rethink rather than this phase. |
| A2 | A strong non-colour root cue (marker size/shape/weight) keeps the root legible without relying on colour, preserving the accessibility principle. | confirmed | "Root is legible." |

### Backlog changes

- [bug] Audit and fix incorrect chord scales — C augmented shows the wrong notes on the keyboard; other chord/scale pairings may share the same error.
- [refinement] Make scale notes easier to see on the keyboard — separate from the (confirmed working) root-note cue.
- [refinement] Revisit overall Explore screen UI clarity — layout works, but still feels a bit confusing; deferred to a later pass.
- [feature] Show chord and scale notes beneath the keyboard — a notes panel would be easier to reference than reading markers off the keyboard.
- [refinement] Place keyboard directly under the root-note selector — raised while confirming the phase's chord-first-layout decision.

---

## Phase 3 Review — Sep 1 2026

### Validation

- **Result:** All Exit Criteria confirmed met. Two issues surfaced: scale-tone markers repeat identically across every keyboard section, and the notes panel still shows the chord's notes when View mode is set to scale.

### Phase checks

| # | Phase promise | Result | What happened |
|---|---|---|---|
| E1a | Correct chord scales — Select the previously wrong chord (C augmented): the keyboard's scale markers show the correct notes | passed | Confirmed. |
| E1b | Correct chord scales — Select several other chord qualities across different roots: the scale shown matches the correct theoretical scale for each | passed | Confirmed — pairings are correct across the catalogue. |
| E2a | Scale legibility — Select a chord with scale notes shown: the scale-tone markers are visually distinguishable from the root marker and from unmarked keys, without relying on colour alone | passed | Distinguishable, but the markers repeat identically across every keyboard section, which reads as confusing (see Backlog changes). |
| E3a | Notes panel — Select a chord: a panel beneath the keyboard lists the chord's notes | passed | Confirmed. |
| E3b | Notes panel — Set View mode to include the scale: the panel also lists the scale's notes | failed | Panel still shows the chord's notes when View mode is scale; human wants scale notes only in that mode. |
| E3c | Notes panel — Set View mode to chord-only: the panel shows only the chord's notes | passed | Confirmed. |
| E4a | Layout — Open Explore: the keyboard sits directly beneath the root-note selector, with the chord-quality selector still inline next to the root selector | passed | Confirmed. |

### Questions

| # | Question | Answer |
|---|---|---|
| Q1 | Are chord/scale pairings now correct across the catalogue, not just the previously reported case? | Yes. |
| Q2 | Is the scale-note marker distinguishable enough to read at a glance? | Yes, but it repeats across all sections and is confusing — wants it shown once, starting from the scale's first visible root. |

### Decision

- **Choice:** Nothing to decide.

### Assumptions

| # | Assumption | Result | What showed this |
|---|-----------|---------|------------------------|
| A1 | The existing View mode option is the only thing that determines whether scale notes appear in the new notes panel. | accepted | Not directly ruled on; the phase shipped on it and was closed. |

### Backlog changes

- [refinement] Scale markers repeat across every keyboard section — reads as confusing; show once, from the scale's first visible root.
- [bug] Scale-only view still shows chord notes — user wants only the scale's notes when View mode is scale.
- [spec-gap] Open decision: canonical chord-to-scale mapping formulas — tech spec should state the canonical mapping formulas, including the locrian scale.
- [spec-gap] Open decision: diminished chord-scale mapping — tech spec should state the diminished chord's scale mapping and include the diminished scale.
