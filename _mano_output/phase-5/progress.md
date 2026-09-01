# Progress — Piano Chord Explorer — Phase 5

<!-- mano-progress: v2 -->
<!-- contract: a1cb472f64723e44 -->

## Scope

| # | What | Status |
|---|------|--------|
| S1a | Primary selection region — View selector | done |
| S1b | Primary selection region — Root selector | done |
| S1c | Primary selection region — Inversion selector | done |
| S1d | Primary selection region — Removed controls | done |
| S2a | Direct chord and scale pickers — Explore chord types | done |
| S2b | Direct chord and scale pickers — Explore scales | done |
| S2c | Direct chord and scale pickers — Both view stacking | done |
| S3a | Selection summary and learning information — Selection summary | done |
| S3b | Selection summary and learning information — Understand section | done |
| S3c | Selection summary and learning information — Intervals and scale degrees | done |
| S3c+1 | when switching to "Scale" underneath Scale degrees let's also show the… | done |
| S4a | Keyboard overlays and playback — Four note roles | done |
| S4b | Keyboard overlays and playback — Legend | done |
| S4c | Keyboard overlays and playback — Playback row | done |
| S4d | Keyboard overlays and playback — Single-note play | done |
| S5a | Responsive and accessible behaviour — Small screens | done |
| S5b | Responsive and accessible behaviour — Keyboard and screen reader | done |
| S5c | Responsive and accessible behaviour — Remembered selections | done |

## Exit Criteria

| # | Criterion | Status |
|---|-----------|--------|
| E1a | First load — Open the app with no saved selection: Chord view is active and a default chord is already shown on the keyboard, with nothing empty | met |
| E2a | Direct selection — Look at the top of the screen: all twelve roots are selectable buttons and there is no chord-quality dropdown anywhere on Explore | met |
| E2b | Direct selection — Choose a chord type from Explore chord types: the title, the inversion options, the keyboard, the Understand section and playback all update | met |
| E2c | Direct selection — Switch to Scale view and choose a scale: the keyboard and Understand section update and the chord list is hidden | met |
| E2c+1 | Expand the scale degrees detail row in Scale or Both view: it also show… | met |
| E2d | Direct selection — Switch back to Chord view: the chord and inversion chosen earlier are still selected | met |
| E3a | Both view — Switch to Both view: the chord and the scale are both marked on the keyboard, and a shared note is distinguishable from a chord-only and a scale-only note by shape, not colour alone | met |
| E3b | Both view — Look below the piano in Both view: both lists are there, chord types first, with every supported option visible in each | met |
| E3c | Both view — Read the Understand section in Both view: it lists the chord notes, the scale notes and the shared notes | met |
| E4a | Scale view stays clean — Switch to Scale view: the Understand section contains no chord notes, both on screen and in what a screen reader announces | met |
| E4b | Scale view stays clean — Look at the selection region in Scale view: the inversion selector is not shown | met |
| E5a | Playback and arrangement — Press the primary playback action in each of the three views: what sounds matches the displayed root, chord or scale, inversion and voicing | met |
| E5b | Playback and arrangement — Open Chord options in Chord view: voicing and hand arrangement are both there, changing either updates the keyboard and playback, and closing returns focus to the control that opened it | met |
| E5c | Playback and arrangement — Tap a single piano key: that note alone sounds and the current selection does not change | met |
| E6a | Small screens and keyboard use — Narrow the window to a phone width: the root selector still shows buttons rather than a dropdown, and every piano key is still reachable and tappable | met |
| E6b | Small screens and keyboard use — Move through the view, root and inversion selectors using only the arrow keys: each moves within its own group and the focused option is clearly visible | met |

## Row Contracts

### S3c+1
affects: E2c+1

```text
when switching to "Scale" underneath Scale degrees let's also show the Scale formula in form of W (whole) H (half). We can calculate this on the fly from the formula we already have
```

### E2c+1
```text
Expand the scale degrees detail row in Scale or Both view: it also shows the scale's step pattern as W (whole) and H (half), matching the existing interval formula (e.g. major = W-W-H-W-W-W-H, natural minor = W-H-W-W-H-W-W).
```

### E6a
reason: Needs a person at a real phone width. The code half is proven: Explore renders no dropdown at any width (there is no select in the app at all, and no width-conditional branch that could add one), the root selector always renders its twelve buttons, and every key of the window renders as its own button. What is left is a layout judgement no test here can make — narrow the window to roughly 375px and check that the root buttons wrap into a readable grid rather than overflowing, that the inversion row scrolls sideways, and that every piano key can actually be reached and tapped by scrolling the keyboard band. The keyboard now scrolls as one track with the black keys pinned to it, and white keys hold a 44px minimum width, so this is a check of that fix rather than of unwritten code.
provenance: human sign-off at review, 2026-09-02
