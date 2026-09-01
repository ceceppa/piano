# Phase Brief — Piano Chord Explorer — Phase 3

## Why This Phase

Phase 2 review confirmed the chord-first Explore layout works but surfaced a data-correctness bug and two legibility gaps; fixing them keeps the tool trustworthy before more capability is layered on.

## Design Principle

Correct and legible beats new: nothing else ships until what's on screen is right and easy to read.

## Core Product Principles

- Colour is never the only indicator; playback and musical states need non-colour text or motion indicators.
- Musical concepts stay distinct: key/mode, chord, variation, voicing, inversion, genre, performance.

## Phase Goal

Every chord on the Explore screen shows its correct scale, and that scale is easy to read at a glance.

## Phase Scope

1. **Chord/scale correctness**
   a. **Audit and fix wrong scales** — every chord/scale pairing on Explore is checked against the correct theoretical scale and fixed where wrong, not just the previously reported case
2. **Keyboard legibility**
   a. **Distinguishable scale markers** — scale-tone markers on the keyboard are easy to tell apart from the root marker and from unmarked keys, without relying on colour alone
3. **Notes panel**
   a. **Chord and scale notes beneath the keyboard** — a panel under the keyboard lists the selected chord's notes, and lists the scale's notes too whenever the existing View mode option is set to include the scale
4. **Layout**
   a. **Keyboard directly under the root selector** — the keyboard moves to sit directly beneath the root-note selector; the chord-quality selector stays inline with the root selector rather than moving below the keyboard

## Not This Phase

- The broader "Explore screen still feels a bit confusing" rethink flagged in the Phase 2 review — deferred to a later pass, not addressed by this phase's layout tweak.
- Any new musical content (genres, progressions, additional scales/qualities) — this phase only fixes and clarifies what's already on Explore.

## Exit Criteria

1. **Correct chord scales**
   a. Select the previously wrong chord (C augmented): the keyboard's scale markers show the correct notes
   b. Select several other chord qualities across different roots: the scale shown matches the correct theoretical scale for each
2. **Scale legibility**
   a. Select a chord with scale notes shown: the scale-tone markers are visually distinguishable from the root marker and from unmarked keys, without relying on colour alone
3. **Notes panel**
   a. Select a chord: a panel beneath the keyboard lists the chord's notes
   b. Set View mode to include the scale: the panel also lists the scale's notes
   c. Set View mode to chord-only: the panel shows only the chord's notes
4. **Layout**
   a. Open Explore: the keyboard sits directly beneath the root-note selector, with the chord-quality selector still inline next to the root selector

## Validation Plan

### Questions

- **Q1.** Are chord/scale pairings now correct across the catalogue, not just the previously reported case?
- **Q2.** Is the scale-note marker distinguishable enough to read at a glance?

### Try

- Step through a spread of chord qualities and roots on Explore and check the notes panel against each chord's correct scale, to answer Q1.
- View a chord with scale overlay on and judge whether the scale markers read clearly without relying on the root cue, to answer Q2.

## Assumption Log

| ID | Assumption | Risk if wrong |
|---|---|---|
| A1 | The existing View mode option is the only thing that determines whether scale notes appear in the new notes panel. | The panel could show the wrong notes for the current view, or need a separate control the phase didn't scope. |

## Acknowledged Risks

- The scale audit may not catch every wrong pairing in one pass; a chord/scale error could still slip through.
- Moving the keyboard directly under the root selector changes the screen's visual flow; it could interact with how the quality selector reads next to it.
