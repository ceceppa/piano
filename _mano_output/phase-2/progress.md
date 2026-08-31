# Progress — Piano Chord Explorer — Phase 2

<!-- mano-progress: v2 -->
<!-- contract: 80229ee433c511cd -->

## Scope

| # | What | Status |
|---|------|--------|
| S1a | Chord identity — Root marker | done |
| S1b | Chord identity — Screen title | done |
| S2a | Control hierarchy — Dominant pair | done |
| S2b | Control hierarchy — Secondary controls | done |
| S2c | Control hierarchy — Lighter Musical Context area | done |
| S2d | Control hierarchy — Genre recommends chord types | done |
| S3a | Keyboard and playback placement — Keyboard follows controls | done |
| S3b | Keyboard and playback placement — Playback beneath keyboard | done |
| S4a | Explore related chord types — Renamed section | done |
| S4b | Explore related chord types — Grouped tiles | done |
| S4c | Explore related chord types — Tile grid | done |

## Exit Criteria

| # | Criterion | Status |
|---|-----------|--------|
| E1a | First load — App opens: the selected chord appears as a prominent screen title, and the keyboard is directly beneath the root/quality controls | met |
| E2a | Identification — User glances at the keyboard: the chord root is distinguishable without relying on colour alone | met |
| E3a | Selection — User changes the root note: title, keyboard, scale, and related-chord section update immediately | met |
| E3b | Selection — User changes the chord quality: title, keyboard, and related-chord section update immediately | met |
| E3c | Selection — Root and quality read as dominant; display/context controls read as secondary; no large bordered form card | met |
| E4a | Comparison — User sees "Explore [root] chord types" with chords grouped as Core / Colour / Sevenths & extensions | met |
| E4b | Comparison — User taps a chord tile: title and keyboard update immediately, and the tile shows a clear selected state | met |
| E4c | Comparison — User changes the genre: chord types in "Explore [root] chord types" that suit the genre show a visible, non-colour "recommended" cue; no chord type is hidden, removed, or reordered; choosing "Any" shows no recommendation cue | met |
| E5a | Playback — User plays the chord, arpeggiates, and plays the scale from controls directly beneath the keyboard | met |
| E5b | Playback — Play chord is the primary action; Arpeggiate and Play scale are visually secondary | met |

## Row Contracts

### E2a
reason: Root marker now uses the design-brief's canonical values (18px diamond, the largest of the three key markers, 2px stroke, non-colour shape/border), which directly addresses the phase-1 review defect. Whether it now reads as "unmistakable at a glance" is a perceptual judgement this session has no rendered-browser or screenshot capability to make honestly — it needs a human to open the app and look.
provenance: human sign-off at review, 2026-08-31
