# Technical Specification — Piano Chord Explorer

## Current Technical Summary

| | |
|---|---|
| Runtime / framework | Vite + React + TypeScript, single-page client app, no server |
| Language | TypeScript |
| Data / storage | In-memory React state (zustand); no persistence this phase |
| Main interfaces | `musicCore` (theory engine + inversions/voicings), `audioEngine` (`@tonejs/piano` sampled playback) |
| Testing | Vitest for the theory engine; oxlint via existing `.oxlintrc.json` |
| Key constraints | Offline-first, zero runtime network deps (piano samples self-hosted, not fetched from a third-party host); audio must start from a user gesture; colours never sole indicator |

## Tech stack

- **Vite + React + TypeScript** — responsive browser application per the stated platform (`"Platform: Responsive browser application"`). No SSR, no router needed for a single Explore screen.
- **Tone.js + `@tonejs/piano`** — sampled acoustic piano instrument for chord, inversion, voicing, and scale playback, per the stated preference (see `## Stated Technical Preferences` in the phase brief). Replaces the previous native-oscillator voice pool. The sample set is self-hosted under the app's own static assets rather than the library's default remote host, so playback keeps working offline after install (§Out of Scope).
- **zustand** — one lightweight store for the selection model and view state, so keyboard, variation panel, and playback controls all react without prop drilling.
- **oxlint** — already configured at the project root (`.oxlintrc.json`, react/typescript/oxc plugins); kept as the linter.
- **Vitest** — unit tests for the pure music-theory functions.

## Project Scaffold

```bash
node _mano/scripts/scaffold.js run --name piano-chord-explorer -- npm create vite@latest {target} -- --template react-ts
```

## Libraries & dependencies

| Category | Decision | Why | Install |
|----------|----------|-----|---------|
| Framework | React + Vite (TS template) | smallest complete SPA for a playable keyboard | via scaffold above |
| State | zustand | shared reactive selection across components | `npm install zustand@latest` |
| Audio | Tone.js + `@tonejs/piano`, samples self-hosted | realistic piano timbre (stated preference); self-hosting keeps it offline-first | `npm install tone@latest @tonejs/piano@latest` |
| Testing | Vitest + jsdom | pure theory engine unit tests | `npm install -D vitest@latest jsdom@latest` |
| Lint | oxlint | already pinned in `.oxlintrc.json` | `npm install -D oxlint@latest` |

## Data model

| Entity | Fields | Notes |
|--------|--------|-------|
| PitchClass | `value` 0–11 (C=0 … B=11), `label` ("C"…"B", sharps for accidentals), `flatLabel` (the flat spelling for the five accidentals — "D♭", "E♭", "G♭", "A♭", "B♭" — and empty for the seven naturals) | all 12 chromatic roots are directly selectable. The root buttons show both spellings stacked, so the flat spelling needs its own field; sharps stay canonical everywhere in code |
| ChordQuality | `id`, `formula: IntervalFormula[]` (scale-degree notation, e.g. `1, b3, 5`; see §Interval formula notation), `suffix`, `name: string` (full readable name), `description: string`, `genreGuide: string[]`, `genres: GenreId[]` | catalogue = major, minor, diminished, augmented, sus2, sus4, 6, 7, maj7, m7, 9, add9. `description` is one short plain sentence about the chord itself with no genre reference; the chord tiles and the Understand section both read it. `genreGuide` and `genres` are genre guidance, which Explore no longer shows — they stay as catalogue data for a later genre-aware surface. See the table below for `name` and `genres` values. |
| GenreId | `'Any' \| 'Pop' \| 'Rock' \| 'Jazz' \| 'Blues' \| 'Classical'` | canonical genre catalogue and the single source for `ChordQuality.genres`. Explore has no genre control, so nothing on Explore reads it |
| ScaleType | `id`, `formula: IntervalFormula[]` (see §Interval formula notation), `name: string` (readable name, e.g. "Natural minor"), `description: string` (one short plain sentence), `selectable: boolean` | full catalogue in §Scale catalogue below. `selectable` is `true` for `major` and `naturalMinor` only — those are the two the scale picker offers. The other four stay in the catalogue with no picker entry; nothing is added to or removed from the catalogue. `locrian` and `diminished` are two distinct 7-note/8-note scales, never the same entry |
| Selection | `root: PitchClass`, `quality: QualityId`, `scaleType: ScaleTypeId`, `viewMode: 'chord'\|'scale'\|'both'`, `inversion: number`, `voicingType: 'close'\|'open'\|'leftRight'` | defaults on first load: root C, quality `major`, scaleType `major`, viewMode `chord`, inversion `0`, voicingType `close` — the app opens showing a C major chord, never an empty screen. One root drives both the chord and the scale. `quality`, `scaleType`, and `inversion` are independent fields that `viewMode` only shows or hides, so a hidden chord or scale is remembered and returns unchanged when its view does. `inversion` and `voicingType` vary independently (any voicing combines with any inversion). When `quality` changes and `inversion >= validInversionCount(newQuality)`, `inversion` clamps to `validInversionCount(newQuality) - 1`. There is no key, scale-follow, or genre field: those controls are not part of Explore. |
| Voicing | `type: 'close'\|'open'\|'leftRight'`, `inversion: number` (0 = root position; valid range `0…validInversionCount(quality)-1`), `notes: { midi: number; hand?: 'left'\|'right' }[]` (ascending bass→treble; bass = `notes[0]`; `hand` set only for `leftRight`) | computed by `musicCore.voice` (§Voicing algorithms); replaces the phase-1 always-root-position placeholder now that inversions/voicings ship |
| DisplayRange | `startMidi`, `endMidi` | fixed 3-octave window from C3, `startMidi` 48 to `endMidi` 83, with no range control for the person to change. Both **effective** bounds are derived, not stored: `effectiveStartMidi = Math.min(startMidi, lowestVoicedMidi)` and `effectiveEndMidi = Math.max(endMidi, highestVoicedMidi)`, computed fresh from the current `Voicing.notes` on every render and never persisted. The window therefore always contains every note of the displayed voicing, and relaxes and tightens as the inversion or voicing changes with no explicit "revert" step to implement. Narrow screens scroll horizontally rather than shrinking keys |

**Interval formula notation.** `ChordQuality.formula` and `ScaleType.formula` both use the standard scale-degree formula, not raw semitone counts: `"1"` is the root, degrees `2`–`7` and `9` are counted on the major scale, and a single leading `b` or `#` marks a degree lowered or raised one semitone from its major-scale position (e.g. minor triad = `1, b3, 5`; dominant 7th = `1, 3, 5, b7`). This is the convention most theory references and musicians already use, and it reads as self-checking — a wrong degree or missing accidental is visible on sight, unlike a raw semitone array.

| Degree | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9 |
|---|---|---|---|---|---|---|---|---|
| Semitones from root | 0 | 2 | 4 | 5 | 7 | 9 | 11 | 14 |

`degreeToSemitone(token: IntervalFormula)` looks up the bare degree in the table above, then applies −1 per leading `b` or +1 per leading `#`; `chordTones`/`scaleTones` sum the result with the root, mod 12. An unrecognised degree or accidental throws, matching `intervalsFor`'s existing unknown-id behaviour.

**Chord quality — `name` and `genres` values (this phase).** `name` is the full readable word(s) used in the screen title (e.g. root "A" + name "diminished" → "A diminished"). `genres` is the structured tag set `isRecommendedForGenre` reads; it replaces parsing the free-text `genreGuide`, and an empty list is a valid outcome — that quality simply never shows a "Recommended" cue.

| id | name | genres |
|---|---|---|
| major | major | `[]` |
| minor | minor | `[Pop, Rock]` |
| diminished | diminished | `[Jazz]` |
| augmented | augmented | `[]` |
| sus2 | suspended 2nd | `[Rock]` |
| sus4 | suspended 4th | `[Rock]` |
| 6 | sixth | `[Jazz]` |
| 7 | dominant seventh | `[Blues]` |
| maj7 | major seventh | `[Jazz]` |
| m7 | minor seventh | `[Jazz]` |
| 9 | dominant ninth | `[Jazz]` |
| add9 | added ninth | `[]` |

**Scale catalogue.** Every catalogue scale, in the notation from §Interval formula notation:

| id | name | formula | selectable |
|---|---|---|---|
| major | Major | `1, 2, 3, 4, 5, 6, 7` | yes |
| naturalMinor | Natural minor | `1, 2, b3, 4, 5, b6, b7` | yes |
| augmented | Augmented | `1, b3, 3, 5, #5, 7` | no |
| locrian | Locrian | `1, b2, b3, 4, b5, b6, b7` | no |
| mixolydian | Mixolydian | `1, 2, 3, 4, 5, 6, b7` | no |
| diminished | Diminished | `1, 2, b3, 4, b5, b6, 6, 7` | no |

**Chord-scale mapping.** `chordScaleType(quality)` returns the one `ScaleTypeId` whose scale contains every one of that quality's own chord tones on the same root. Explore no longer derives the scale from the chord — the person picks it (`Selection.scaleType`) — so nothing on Explore calls this. It stays as a pure lookup, and as the record of which scale actually fits each quality.

*Replaced the key/mode plus scale-follow selection model with a directly chosen `Selection.scaleType` in phase-5.*

| QualityId | ScaleTypeId | Why |
|---|---|---|
| major, sus2, sus4, 6, maj7, add9 | major | major third or no third; every chord tone is diatonic to major |
| minor, m7 | naturalMinor | minor third with a natural (not flattened) seventh; every chord tone is diatonic to natural minor |
| diminished | diminished | the 8-note diminished (whole-half octatonic) scale is the conventional chord-scale for a diminished quality and contains the triad's own `1, b3, b5`. `locrian` (the unrelated 7-note mode built on the major scale's 7th degree) also contains those three tones but is a different scale in its own right — it stays in the catalogue as `locrian`, not as this mapping's target |
| augmented | augmented | neither major (no ♯5) nor natural minor (no major 3rd) contains `{root, 3rd, ♯5}`; the augmented (symmetric hexatonic) scale does — confirmed against the phase-2 backlog's recorded correct notes for C augmented (`C, D♯, E, G, G♯, B`) |
| 7, 9 | mixolydian | dominant (flattened-7th) chords; `major` has a natural 7th so cannot contain the chord's own ♭7 |

## Keyboard note roles

One key carries one role. The keyboard, the legend beside it, and the Understand section all read the same set, so the role is a shared contract rather than a keyboard-local detail. Roles are decided in this order — the first that matches wins:

| Role | A key has it when | Views that use it |
|---|---|---|
| `root` | the key sounds the selected root: in Chord and Both view it is the voicing's own note whose pitch class is `Selection.root`; in Scale view it is the first visible key of that pitch class, which is where the scale band starts | all three |
| `shared` | the key is both a chord note and a scale note | Both only |
| `chord` | the key is one of the current voicing's exact notes | Chord and Both |
| `scale` | the key's pitch class is in `scaleTones(root, scaleType)`. Marked once per pitch class, inside the one-octave band that starts at the first visible root, rather than repeating in every octave | Scale and Both |
| `plain` | none of the above | all three |

Chord view marks no scale notes. Scale view carries no chord content at all — no chord, shared, bass, or voiced-note marking and no hand-grouping strip — in what is drawn and in what assistive technology reads.

## Public / integration interface contracts

| Surface | Exact operation | Inputs & defaults | Result / failure | Canonical mapping / ownership |
|---------|-----------------|-------------------|------------------|-------------------------------|
| `musicCore` | `chordTones(root: PitchClass, quality: ChordQuality)` | — | `PitchClass[]`; unknown quality → throws | `quality.formula` parsed via `degreeToSemitone` (§Interval formula notation), summed with root, mod 12 |
| `musicCore` | `scaleTones(root: PitchClass, scaleType: ScaleTypeId = 'major')` | — | `PitchClass[]` | `scaleType.formula` parsed via `degreeToSemitone`, summed with root, mod 12 |
| `musicCore` | `sharedTones(root: PitchClass, quality: QualityId, scaleType: ScaleTypeId)` | — | `PitchClass[]`, in chord-tone order | the pitch classes present in both `chordTones` and `scaleTones` for the same root. One source for the keyboard's `shared` role and the Understand section's shared-notes row, so the two can never disagree |
| `musicCore` | `chordScaleType(quality: QualityId)` | — | `ScaleTypeId` | pure lookup, canonical mapping in §Chord-scale mapping; no Explore consumer now that the scale is chosen directly |
| `musicCore` | `scaleName(scaleType: ScaleTypeId)` | — | string ("Major", "Natural minor", "Mixolydian", …) | `ScaleType.name`; the readable name on a scale tile |
| `musicCore` | `scaleLabel(root: PitchClass, scaleType: ScaleTypeId)` | — | string (e.g. "G major", "G natural minor") | PitchClass `label` + `scaleName` lower-cased, space-joined. Correct for all six scales — it must not fall back to "major" for the four the picker does not offer |
| `musicCore` | `rootPositionVoice(chord)` | `chord: {root, quality}` | `number[]` MIDI notes in a default band around C3 | equivalent to `voice(chord, 0, 'close').map(n => n.midi)`; kept for existing callers |
| `musicCore` | `validInversionCount(chord: ChordRef)` | — | `number` (root position + every inversion) | `intervalsFor(chord.quality).length` — distinct chord tones |
| `musicCore` | `voice(chord: ChordRef, inversion: number, type: VoicingType = 'close')` | `inversion` clamped to `[0, validInversionCount(chord)-1]` | `VoicedNote[]`, ascending bass→treble | §Voicing algorithms below |
| `musicCore` | `inversionName(inversion: number)` | — | string ("Root position", "1st inversion", "2nd inversion", …) | ordinal of `inversion`; `0` → "Root position" |
| `musicCore` | `slashChordLabel(chord: ChordRef, inversion: number)` | — | string \| `null` | `null` when `inversion === 0`; else `` `${chordName(chord)}/${noteName(bassPitchClass)}` `` |
| `musicCore` | `variationsFor(root, currentQuality)` | — | `{quality, name, genreGuide}[]` in catalogue order, excluding `currentQuality` | `ChordQuality` catalogue filtered |
| `musicCore` | `chordName(root, quality)` | — | string (e.g. "A", "Am", "A7", "A♯") | PitchClass `label` + quality `suffix` |
| `musicCore` | `chordFullName(root: PitchClass, quality: ChordQuality)` | — | string (e.g. "A diminished") | PitchClass `label` + quality `name`, space-joined |
| `musicCore` | `isRecommendedForGenre(quality: QualityId, genre: GenreId)` | — | `boolean` | `true` only when `quality.genres` includes `genre`; always `false` for `genre === 'Any'`. Pure lookup, no matching against free-text `genreGuide`. Explore has no genre control and shows no recommendation cue, so this has no consumer there |
| `audioEngine` | `init()` | — | `Promise<void>`; resolves once `Tone.start()` has run (on a user gesture) and the self-hosted `@tonejs/piano` sample set has loaded | `piano.load()` starts eagerly at module load (no gesture needed for asset fetch); `Tone.start()` gated on first gesture as before; `init()` awaits both |
| `audioEngine` | `noteOn(midi: number)` | — | plays immediately; silently no-ops if not initialised / not resumed | `Piano.keyDown({ midi })`; polyphony/voice-stealing handled internally by Tone.js |
| `audioEngine` | `noteOff(midi: number)` | — | releases the playing voice | `Piano.keyUp({ midi })` |
| `audioEngine` | `playChord(voice: number[])` | ~2.5s held | stops current playback, plays the exact displayed voicing/inversion | `keyDown`/`keyUp` pairs scheduled from `voice`'s exact MIDI notes (§Voicing algorithms) |
| `audioEngine` | `playArpeggio(voice: number[])` | ~120ms per note | rolls notes sequentially | same voice set, staggered `keyDown`/`keyUp` pairs |
| `audioEngine` | `playScale(scale: number[], pattern: 'updown' \| 'up' \| 'down' = 'updown')` | ~200ms per note | `updown` plays the scale up then back down, `up` ascending only, `down` descending only | notes from `scaleTones` mapped to MIDI band. `down` is what the Scale view's secondary "Play descending" action calls |

## Storage strategy

No persistence this phase: the selection model is in-memory only (`useSelectionStore`). Local data, favourites, and backup are deliberately later phases; nothing about the store shape assumes them. Piano sample files ship as static build assets; no user data is written for them.

## Key technical decisions

- **Sampled piano via Tone.js, self-hosted samples.** `@tonejs/piano` replaces the previous oscillator voice pool; Tone.js handles polyphony/voice-stealing internally. The sample sprite files are copied into the app's own static assets and `Piano` is constructed with a `baseUrl` pointing at them, instead of the library's default remote CDN host — this is what keeps playback offline-first after install (§Out of Scope), not an override of the stated `@tonejs/piano` choice itself.
- **Sample load starts eagerly; gesture only gates playback start.** `piano.load()` begins at module load (fetching local static assets needs no gesture); `Tone.start()` still waits for the first user gesture per the autoplay policy. `init()`/`isReady()` reflect both being ready.
- **Voicing algorithms (§Data model → Voicing).** `voice(chord, inversion, type)`: (1) rotate `intervalsFor(chord.quality)` left by `inversion` positions, adding 12 to each wrapped-around entry, giving ascending bass→treble offsets from the root — this is the inversion; (2) for `type: 'open'`, then raise every other note starting from the second-lowest (indices 1, 3, …) up one octave and re-sort ascending; (3) for `type: 'leftRight'`, drop the bass note (index 0) one octave and tag it `hand: 'left'`, tag the remaining notes `hand: 'right'`, unchanged in pitch; `close` applies neither transform. All three types are defined for every `inversion` value, so no voicing×inversion combination is invalid.
- **Theory engine is pure and dependency-free.** `musicCore` is pure functions → unit-testable in Vitest; UI and audio never compute intervals themselves.
- **Single store drives "immediate see-and-hear."** Any selector update writes one `Selection`; keyboard highlights, variation panel, and playback read it reactively, so the screen and the sound always reflect the same selection.
- **The scale is chosen, not derived.** The person picks the scale type from the scale list, exactly as they pick the chord type, and one root feeds both. Deriving the scale from the chord quality exposed internal state and left no way to ask "what does this chord look like against a different scale", so `Selection.scaleType` is now a plain user choice and `chordScaleType` has no Explore consumer.
- **The view hides, it never discards.** `viewMode` only decides which of the selection fields are on screen. Switching from Both to Scale hides the chord and its inversion without resetting them, and switching back restores exactly what was there. This is why chord, scale, and inversion are independent fields rather than one derived selection.
- **Genre is not part of Explore.** There is no genre control and no "Recommended" cue on the chord tiles. Genre belongs with progression context, which no built screen owns yet; `GenreId`, `ChordQuality.genres`, and `isRecommendedForGenre` stay as catalogue data so that screen does not have to rebuild them.

## Out of Scope

Architectural commitments, not phase scope. This app stays fully client-side: no backend service, no accounts, and no external/third-party APIs at runtime — required for offline-first use after install. The `@tonejs/piano` sample audio files are bundled as static build assets and self-hosted from the app's own origin; they are fetched once like any other static asset, not called as a third-party API at runtime.

## Platform constraints

- **Autoplay policy:** audio requires a user gesture (`Tone.start()`); on iOS/mobile the first touch must also resume Tone's context.
- **Sample load:** the self-hosted `@tonejs/piano` sample set is fetched once per visit (`piano.load()`, browser-cached thereafter). Playback that fires before it resolves must no-op rather than error, same as the existing not-initialised behaviour.
- **Polyphony:** desktop keys give simultaneous presses; mobile touch may be single-point. Keys must play singly everywhere and polyphonically wherever the input method allows.
- **Small screens:** there is no range control to fall back on, so the fixed window (§Data model → DisplayRange) must scroll horizontally rather than shrink keys below a usable size. Every key stays reachable and tappable at phone width.
- **Latency:** a press must sound immediately (budget ≤ ~50 ms perceived sample-trigger latency); no network round-trip on the playback path itself (the one-time sample fetch happens ahead of it, per above).

## Product principle constraints

- **"Select something and immediately see and hear the musical result"** → selection change must re-render highlights and be audible in the same gesture, with no extra "apply" step.
- **Accessibility posture** → chord tones, scale notes, root, and bass states must be distinguishable without colour alone; playback state and the `leftRight` voicing's hand grouping both need a non-colour indicator (text or motion) alongside any colour treatment.
- **A useful default is always visible** → first load renders the C major chord in Chord view, before any user input and with no saved selection to read.

## Cross-environment boundaries

None: a single browser rendering environment. Desktop vs mobile differences (polyphony, focus, pointer) are handled inside the one environment as platform constraints above.