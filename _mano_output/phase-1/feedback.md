# Piano Chord Explorer — Layout Improvement Brief

## Goal

Make the Explorer easier to use as a learning and practice tool.

The selected chord must be the subject of the screen. Every visible element should either:

* Explain the selected chord.
* Let the user hear or play it.
* Help the user compare it with related chord types.
* Control how it is displayed on the keyboard.

Do not add new functionality in this pass. Rearrange and restyle only the elements already present.

## Main UX problem to solve

The current screen makes the user configure several settings before they can properly study or play a chord:

> Configure → inspect keyboard → find playback → scroll to chord types.

The intended experience should instead be:

> Select a chord → see it immediately → hear or play it → compare related chord types.

The current `Musical Context` card reads like a settings form. It gives root note, quality, scale, range, genre and display preferences equal visual importance, even though users primarily want to learn the selected chord.

## Recommended information hierarchy

1. Selected chord.
2. Root note and chord quality.
3. Keyboard visualisation.
4. Playback.
5. Related chord types.
6. Secondary display and context preferences.

## Recommended layout

```text
[ Piano Chord Explorer ]                         [ Light ]

A diminished
──────────────────────────────────────────────────────────
[ Root note: C C♯ D ... A ... B ]  [ Quality: diminished ]

[ View: Chord | Scale | Both ]     [ Scale: chord root ]
[ Range: 2 octaves ] [ Note names ] [ Genre: Pop ]
──────────────────────────────────────────────────────────
                    LARGE PLAYABLE KEYBOARD
──────────────────────────────────────────────────────────
[ Play chord ] [ Arpeggiate ] [ Play scale ]   Ready

Explore A chord types
[ A ] [ Am ] [ Adim ] [ Aaug ] [ Asus2 ] [ Asus4 ]
[ A6 ] [ A7 ] [ Amaj7 ] [ Am7 ] [ A9 ] [ Aadd9 ]
```

## Changes

### 1. Make the selected chord the screen title

Replace the small `Adim` subtitle under `Piano Chord Explorer` with a prominent selected-chord heading.

Example:

```text
Piano Chord Explorer
A diminished
```

Use the full readable name in the heading. The shorter symbol, `Adim`, can remain in controls and chord-type tiles.

### 2. Prioritise root note and chord quality

Keep `Root note` and `Chord quality` as the dominant controls.

Place them together at the top of the control area:

```text
Root note: [ C ] [ C♯ ] [ D ] ... [ A ] ... [ B ]
Quality:   [ diminished ▼ ]
```

They define what the user is studying. They should be easier to notice than display preferences.

### 3. Demote secondary controls

Keep all current options, but visually group them as secondary display/context controls:

* Scale follows.
* View mode.
* Keyboard range.
* Show note names.
* Genre context.

They should use less visual weight than root note and chord quality.

`Genre context` should act as a recommendation filter for related chord types. It should not visually compete with the definition of the selected chord.

### 4. Reduce the form-like feeling of Musical Context

Avoid one large bordered card with many stacked labels and controls.

Instead:

* Use a lighter control area.
* Keep labels short.
* Use fewer borders.
* Use spacing and grouping to establish hierarchy.
* Make the root and quality controls visually stronger than all other controls.

The interface should feel like an instrument-learning workspace, not an admin form.

### 5. Bring the keyboard closer to chord selection

Place the keyboard directly after the root and quality controls.

The selected chord should visibly cause the highlighted keyboard state. Avoid a large block of settings separating selection from the result.

### 6. Keep playback attached to the keyboard

Keep the controls directly beneath the keyboard:

```text
[ Play chord ] [ Arpeggiate ] [ Play scale ]   Ready
```

Make `Play chord` the primary action.

Treat `Arpeggiate` and `Play scale` as secondary actions.

### 7. Rename the variations section

Replace:

```text
Variations of Adim
```

With:

```text
Explore A chord types
```

`A`, `Am`, `Adim`, `A7`, and `Amaj7` are not variations of `Adim`. They are different chord qualities sharing the root note A.

This wording gives learners the correct mental model.

### 8. Group related chord types

Keep the same chord items, but group them visually:

```text
Core
A · Am · Adim · Aaug

Colour
Asus2 · Asus4 · A6 · Aadd9

Sevenths & extensions
A7 · Amaj7 · Am7 · A9
```

The current descriptions can remain, but the chord name should be visually dominant.

### 9. Replace the long single-column list

Do not present every A chord type as one equally weighted vertical row.

Use compact selectable tiles or a responsive grid. Each tile should:

* Show the chord symbol prominently.
* Show the short explanatory label more quietly.
* Clearly show the selected state.
* Update the title and keyboard immediately when pressed.

This makes comparison quicker and reduces scrolling fatigue.

### 10. Do not add product navigation yet

Do not add a permanent sidebar for Explore, Favourites and Metronome until those are functional destinations.

At the current stage, it would consume space and make the tool feel more complex without improving the chord-learning task.

## Visual direction

Use the AI mockup as reference for:

* Clear hierarchy.
* Generous whitespace.
* Strong selected-chord title.
* Calm section boundaries.
* A persistent connection between chord, keyboard and playback.

Do not copy its full structure directly. Retain the existing controls and keyboard capabilities, but arrange them around the selected chord rather than around configuration.

## Success criteria

A user should be able to do the following without pausing to interpret the interface:

1. Identify the chord currently being studied.
2. Change its root note or quality.
3. See its notes on the keyboard immediately.
4. Hear the chord or its scale.
5. Compare it with other chord types using the same root.
6. Understand that genre changes recommendations, rather than redefining the chord.

