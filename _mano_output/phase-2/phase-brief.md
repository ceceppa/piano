# Phase Brief — Piano Chord Explorer — Phase 2

## Why This Phase

Phase 1 proved the see-and-hear Explore loop works, but review showed the screen reads like a settings form: the selected chord is not the subject of the screen, and its root is not instantly legible on the keyboard. This phase re-arranges the existing elements around the chord so a beginner lands on the chord itself, not on configuration.

## Vision

The selected chord is the subject of the screen. A learner should land on "A diminished", understand instantly what they are studying, see it on the keyboard right below, and compare it with related A chord types without pausing to interpret a settings form.

## Design Principle

The chord comes first: the title names it, the keyboard shows it, the playback bar plays it, and the tiles relate it — configuration is demoted to secondary.

## Core Product Principles

- Select something and immediately see and hear the musical result.
- A useful default is always visible on first load — the screen is never empty and no configuration is required before value is demonstrated.
- Colour is never the only indicator; musical states need non-colour text or motion cues.

## Phase Goal

The user can identify the selected chord at a glance, see it on the keyboard immediately, hear it, and compare related chord types — all with minimal configuration steps.

## Phase Scope

1. **Chord identity**
   a. **Root marker** — the chord-root marker on the keyboard becomes unmistakable at a glance (stronger non-colour cue, targeted to the review defect)
   b. **Screen title** — the selected chord becomes a prominent screen title using the full readable name (e.g. "A diminished"); the short symbol stays in controls and chord tiles

2. **Control hierarchy**
   a. **Dominant pair** — root-note and chord-quality controls become the dominant control pair, placed together at the top of the control area
   b. **Secondary controls** — scale-follow, view mode, keyboard range, note names, and genre are demoted to secondary display/context controls with less visual weight
   c. **Lighter Musical Context area** — loses its form-like bordered-card feel: lighter styling, shorter labels, fewer borders, spacing-and-grouping hierarchy
   d. **Genre recommends chord types** — genre highlights chord types in the related-chord section that suit the selected genre; it recommends, it never hides, removes, or reorders a chord type, which is what makes it more than a settings-style equal to root and quality

3. **Keyboard and playback placement**
   a. **Keyboard follows controls** — the keyboard sits directly after the root and quality controls so the selection visibly drives the highlighted keyboard
   b. **Playback beneath keyboard** — playback stays attached directly beneath the keyboard; Play chord is the primary action, Arpeggiate and Play scale are secondary

4. **Explore related chord types**
   a. **Renamed section** — the variations section is renamed "Explore [root] chord types" (e.g. "Explore A chord types")
   b. **Grouped tiles** — related chord types are grouped visually (Core / Colour / Sevenths & extensions) with the chord symbol visually dominant
   c. **Tile grid** — the long single-column variation list is replaced by compact selectable tiles or a responsive grid with a clear selected state

## Not This Phase

- No product navigation (bottom nav / side nav) — destinations are not functional yet, so it stays out (review refinement, recorded as a constraint).
- No new functionality — rearrange and restyle only the elements already present; no playback, engine, persistence, or feature additions.
- No changes to keyboard interaction semantics (pointer/key handling), playback behaviour, or musical-model behaviour.
- No changes to predefined chord/scale/quality catalogues or the genre list.

## Exit Criteria

1. **First load**
   a. App opens: the selected chord appears as a prominent screen title, and the keyboard is directly beneath the root/quality controls
2. **Identification**
   a. User glances at the keyboard: the chord root is distinguishable without relying on colour alone
3. **Selection**
   a. User changes the root note: title, keyboard, scale, and related-chord section update immediately
   b. User changes the chord quality: title, keyboard, and related-chord section update immediately
   c. Root and quality read as dominant; display/context controls read as secondary; no large bordered form card
4. **Comparison**
   a. User sees "Explore [root] chord types" with chords grouped as Core / Colour / Sevenths & extensions
   b. User taps a chord tile: title and keyboard update immediately, and the tile shows a clear selected state
   c. User changes the genre: chord types in "Explore [root] chord types" that suit the genre show a visible, non-colour "recommended" cue; no chord type is hidden, removed, or reordered; choosing "Any" shows no recommendation cue
5. **Playback**
   a. User plays the chord, arpeggiates, and plays the scale from controls directly beneath the keyboard
   b. Play chord is the primary action; Arpeggiate and Play scale are visually secondary

## Validation Plan

- **Decision this informs:** Whether the chord-first layout makes the Explore screen a better learning and practice surface worth extending (predicts how progressing, favouriting, and playing-style work should be laid out).
- **Evidence to gather:** Re-run the Phase-1 review routine with the new layout: change roots and qualities, play and compare chord types, and confirm the selected chord is immediately identifiable and everything updates together without configuration steps.

## Assumption Log

| Assumption | Risk if wrong |
|---|---|
| The screen remains a single page with no navigation; the chord-first hierarchy works without tab/section chrome. | Later phases force a layout rework when navigation and multi-screen coverage arrive. |
| A strong non-colour root cue (marker size/shape/weight) keeps the root legible without relying on colour, preserving the accessibility principle. | If the marker becomes too heavy it crowds the chord-tone/scale markers or reads as a defect instead of a cue. |

## Acknowledged Risks

- Moving the keyboard and controls changes established test and selector expectations; updates needed across keyboard/playback/selector tests.
- Demoting genre and other controls could reduce discoverability of those features for some users.
- Replacing the variation list with tiles could crowd the section on narrow screens.

## Stated Technical Preferences

<!-- Verbatim from the source; not scoped or decided by `mano start`. `mano spec` evaluates these and must flag any override. -->

No technical preferences stated for this phase — layout-only rework on the existing stack.