# Progress — Piano Chord Explorer — Phase 4

<!-- mano-progress: v2 -->
<!-- contract: f9aff20ac31d8a13 -->

## Scope

| # | What | Status |
|---|------|--------|
| S1a | Piano sound — Realistic chord tone | done |
| S1b | Piano sound — Realistic scale tone | done |
| S2a | Chord inversions — Inversion selection | done |
| S2b | Chord inversions — Inversion display | done |
| S2b+1 | the chord needs to only be shown once in the middle section | done |
| S2b+2 | Chord notes should be shown the order of the inversion selected | done |
| S2b+3 | we need to higlight the whole key in an accessible way. Just dots do or… | done |
| S2c | Chord inversions — Inversion playback | done |
| S3a | Chord voicings — Voicing selection | done |
| S3a+1 | Let's make showing 3 octave by default | done |
| S3b | Chord voicings — Hand grouping display | done |
| S3c | Chord voicings — Voicing playback | done |
| S4a | Scale display fixes — Scale-only notes panel | done |
| S4a+1 | chords must not be visible in view mode: scale | done |
| S4b | Scale display fixes — Single-pass scale markers | done |

## Exit Criteria

| # | Criterion | Status |
|---|-----------|--------|
| E1a | Piano sound — Select a chord: it plays through the new, more realistic piano sound | met |
| E1b | Piano sound — Play a scale ascending or descending: it also plays through the new, more realistic piano sound | met |
| E2a | Chord inversions — Select a chord with four distinct tones: root position, first, second, and third inversion are all selectable | met |
| E2b | Chord inversions — Select an inversion: the keyboard shows its notes bass to treble from that inversion's bass note, the bass note is visually distinct, and the slash-chord notation and inversion name are shown | met |
| E2b+1 | With an inversion selected, the Notes panel's chord note list is ordere… | met |
| E2c | Chord inversions — Play the selected inversion: the sound matches the notes shown, not the root-position chord | met |
| E3a | Chord voicings — Select the open voicing: the keyboard updates to the open-position note distribution | met |
| E3b | Chord voicings — Select the left/right-hand voicing: the keyboard shows which notes belong to each hand with colour plus a non-colour indicator | met |
| E3c | Chord voicings — Select any inversion together with any voicing: both apply together, on the keyboard and in playback | met |
| E4a | Scale display — Set View mode to scale: the notes panel lists only the scale's notes, not the chord's | met |
| E4a+1 | Set View mode to scale: the keyboard shows no chord-only elements (root… | met |
| E4b | Scale display — Select a chord with scale notes shown: the scale-tone markers appear once, starting from the scale's first visible root note, not in every keyboard section | met |

## Rework

| # | Finding | Status |
|---|---------|--------|
| R1 | Also the web app fails in the browser with the following error: @tonejs… | resolved |

## Row Contracts

### S2b+1
affects: E2b

```text
the chord needs to only be shown once in the middle section
```

### S2b+2
affects: E2b+1

```text
Chord notes should be shown the order of the inversion selected
```

### S2b+3
affects: E2b

```text
we need to higlight the whole key in an accessible way. Just dots do or border aren't enoguhg
```

### S3a+1
affects: E3a

```text
Let's make showing 3 octave by default
```

### S4a+1
affects: E4a+1

```text
chords must not be visible in view mode: scale
```

### E2b+1
```text
With an inversion selected, the Notes panel's chord note list is ordered bass to treble to match the selected inversion, not fixed root-position order
```

### E4a+1
```text
Set View mode to scale: the keyboard shows no chord-only elements (root/chord-tone markers, bass marker, hand-grouping brackets) — only scale markers remain
```

### R1
source: build

```text
Also the web app fails in the browser with the following error:

@tonejs_piano.js?v=68b6568b:1663 Uncaught TypeError: Class extends value undefined is not a constructor or null
```
