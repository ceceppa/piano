# Progress — Piano Chord Explorer — Phase 3

<!-- mano-progress: v2 -->
<!-- contract: 79ba64e1d03e1f7a -->

## Scope

| # | What | Status |
|---|------|--------|
| S1a | Chord/scale correctness — Audit and fix wrong scales | done |
| S2a | Keyboard legibility — Distinguishable scale markers | done |
| S3a | Notes panel — Chord and scale notes beneath the keyboard | done |
| S4a | Layout — Keyboard directly under the root selector | done |

## Exit Criteria

| # | Criterion | Status |
|---|-----------|--------|
| E1a | Correct chord scales — Select the previously wrong chord (C augmented): the keyboard's scale markers show the correct notes | met |
| E1b | Correct chord scales — Select several other chord qualities across different roots: the scale shown matches the correct theoretical scale for each | met |
| E2a | Scale legibility — Select a chord with scale notes shown: the scale-tone markers are visually distinguishable from the root marker and from unmarked keys, without relying on colour alone | met |
| E3a | Notes panel — Select a chord: a panel beneath the keyboard lists the chord's notes | met |
| E3b | Notes panel — Set View mode to include the scale: the panel also lists the scale's notes | met |
| E3c | Notes panel — Set View mode to chord-only: the panel shows only the chord's notes | met |
| E4a | Layout — Open Explore: the keyboard sits directly beneath the root-note selector, with the chord-quality selector still inline next to the root selector | met |

## Rework

| # | Finding | Status |
|---|---------|--------|
| R1 | we need to update the code using the correct updated formulas and also… | resolved |
| R2 | sync diminished chord-scale mapping and add the diminished scale | resolved |
| R3 | Q2 - yes, but I'd show the scale ones tho. Now it repeats across all th… | pending |
| R4 | Actually one exit criteria E3b — partially met: when I select "scale" I… | pending |

## Row Contracts

### R1
source: build

```text
we need to update the code using the correct updated formulas and also adding locrian scale as we mixed them before
```

### R2
source: build

```text
sync diminished chord-scale mapping and add the diminished scale
```
