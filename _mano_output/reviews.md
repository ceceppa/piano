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

---

## Phase 4 Review — Sep 2 2026

### Validation

- **Result:** All Exit Criteria confirmed. The new piano sound feels realistic and no longer irritating. Explore's inversion and voicing controls still read as confusing, deepening the "a bit confusing" feedback from the Phase 2 review — a new UI/UX reference has been provided for the next design pass.

### Phase checks

| # | Phase promise | Result | What happened |
|---|---|---|---|
| E1a | Piano sound — Select a chord: it plays through the new, more realistic piano sound | passed | Confirmed. |
| E1b | Piano sound — Play a scale ascending or descending: it also plays through the new, more realistic piano sound | passed | Confirmed. |
| E2a | Chord inversions — Select a chord with four distinct tones: root position, first, second, and third inversion are all selectable | passed | Confirmed. |
| E2b | Chord inversions — Select an inversion: the keyboard shows its notes bass to treble from that inversion's bass note, the bass note is visually distinct, and the slash-chord notation and inversion name are shown | passed | Confirmed. |
| E2b+1 | With an inversion selected, the Notes panel's chord note list is ordered bass to treble to match the selected inversion, not fixed root-position order | passed | Confirmed. |
| E2c | Chord inversions — Play the selected inversion: the sound matches the notes shown, not the root-position chord | passed | Confirmed. |
| E3a | Chord voicings — Select the open voicing: the keyboard updates to the open-position note distribution | passed | Confirmed. |
| E3b | Chord voicings — Select the left/right-hand voicing: the keyboard shows which notes belong to each hand with colour plus a non-colour indicator | passed | Confirmed. |
| E3c | Chord voicings — Select any inversion together with any voicing: both apply together, on the keyboard and in playback | passed | Confirmed. |
| E4a | Scale display — Set View mode to scale: the notes panel lists only the scale's notes, not the chord's | passed | Confirmed. |
| E4a+1 | Set View mode to scale: the keyboard shows no chord-only elements (root/chord-tone markers, bass marker, hand-grouping brackets) — only scale markers remain | passed | Confirmed. |
| E4b | Scale display — Select a chord with scale notes shown: the scale-tone markers appear once, starting from the scale's first visible root note, not in every keyboard section | passed | Confirmed. |

### Questions

| # | Question | Answer |
|---|---|---|
| Q1 | Does the new piano sound feel meaningfully more realistic, and less irritating, than the current one? | Yes — "is perfect now." |
| Q2 | With inversion and voicing controls added, does Explore still feel usable, or does it deepen the "a bit confusing" feedback from the Phase 2 review? | Still confusing — deepens the Phase 2 feedback. A new UI/UX reference has been provided (ui/newui.md, ui/newone.jpeg) for the next design pass. |

### Decision

- **Choice:** Nothing to decide.

### Assumptions

| # | Assumption | Result | What showed this |
|---|-----------|---------|------------------------|
| A1 | Every voicing (close, open, left/right-hand) is valid in combination with every inversion, with no combination excluded | confirmed | User confirmed at review. |
| A2 | Colour plus a non-colour indicator is enough to distinguish left/right-hand grouping on the existing single keyboard, without a separate two-row layout | confirmed | User confirmed at review. |
| A3 | Voicing in this phase is deliberately genre-independent (close/open/left-right-hand only); genre-specific voicing is a separate, later capability | confirmed | User confirmed at review. |

### Backlog changes

- [ux-gap] Explore controls still confusing after inversion/voicing additions — Q2 answer: controls still read as confusing, deepening the Phase 2 feedback; new UX reference authored at ui/newui.md.
- [ui-gap] New Explore UI/UX visual reference for redesign — new visual design reference (ui/newone.jpeg) provided to guide a redesign of the confusing Explore controls.

---

## Phase 5 Review — Sep 2 2026

### Validation

- **Result:** All Exit Criteria confirmed, including E6a by human sign-off. Explore now reads as clear ("oh yeah"). Removing genre and note-name display did take away something the human was using, though it's acceptable deferred to a future Settings screen. The scale list reads as a real catalogue, but should show every scale already defined in `scales.ts`.

### Phase checks

| # | Phase promise | Result | What happened |
|---|---|---|---|
| E1a | First load: Chord view active, default chord shown, nothing empty | signed off | |
| E2a | All twelve roots are buttons, no chord-quality dropdown | signed off | |
| E2b | Choosing a chord type updates title, inversion options, keyboard, Understand section and playback | signed off | |
| E2c | Switching to Scale view and choosing a scale updates keyboard and Understand section, hides chord list | signed off | |
| E2c+1 | Expanding the scale degrees row shows the W/H step pattern | signed off | |
| E2d | Switching back to Chord view keeps the earlier chord and inversion selected | signed off | |
| E3a | Both view marks chord and scale on keyboard; shared note distinguishable by shape, not colour alone | signed off | |
| E3b | Both view shows both lists below the piano, chord types first, every option visible | signed off | |
| E3c | Both view's Understand section lists chord notes, scale notes and shared notes | signed off | |
| E4a | Scale view's Understand section has no chord notes, on screen or to a screen reader | signed off | |
| E4b | Scale view hides the inversion selector | signed off | |
| E5a | Primary playback action in each view matches the displayed root/chord/scale, inversion and voicing | signed off | |
| E5b | Chord options show voicing and hand arrangement, update keyboard/playback, return focus on close | signed off | |
| E5c | Tapping a single key sounds that note alone, selection unchanged | signed off | |
| E6a | Root selector shows buttons at phone width, every piano key reachable and tappable | passed | Confirmed at real phone width, per Row Contract's proven code half plus human layout check. |
| E6b | View, root and inversion selectors each move within their own group via arrow keys, focus visible | signed off | |

### Questions

| # | Question | Answer |
|---|---|---|
| Q1 | Is Explore actually clear now, or does the "a bit confusing" feedback from the Phase 2 and Phase 4 reviews still stand? | Yes — "oh yeah." |
| Q2 | Does removing key, mode, genre and the keyboard-range control from Explore take away anything you were really using? | Yes — genre and note-name display are needed, but can wait for a later Settings screen. |
| Q3 | With only the two scales the app already supports, does the Explore scales list read as a real catalogue or as a placeholder? | Real catalogue, but the picker needs to show every scale already defined in `scales.ts`. |

### Decision

- **Choice:** Nothing to decide.

### Assumptions

| # | Assumption | Result | What showed this |
|---|-----------|---------|------------------------|
| A1 | The scale picker is a deliberately narrowed version of the deferred "Additional scales, modes, chord qualities and genres" item | confirmed | User confirmed at review. |
| A2 | Removing the keyboard-range control does not make the piano unusable on a small screen | confirmed | User confirmed at review. |
| A3 | Showing every chord type and every scale at once stays readable in Both view | confirmed | User confirmed at review. |
| A4 | Key and mode selection can be absent from the whole product until a later screen owns it | confirmed | User confirmed at review. |

### Backlog changes

- [bug] Explore scales list missing scales already in scales.ts — Q3 answer: picker should show every scale scales.ts already defines.
- [refinement] Hear button should toggle to Stop instead of separate Playing/STOP state — Play button itself should become Stop while sounding, reverting to Play when the sound ends.
