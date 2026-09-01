# Technical Specification — Piano Chord Explorer

## Current Technical Summary

| | |
|---|---|
| Runtime / framework | Vite + React + TypeScript, single-page client app, no server |
| Language | TypeScript |
| Data / storage | In-memory React state (zustand); no persistence this phase |
| Main interfaces | `musicCore` (theory engine), `audioEngine` (Web Audio playback) |
| Testing | Vitest for the theory engine; oxlint via existing `.oxlintrc.json` |
| Key constraints | Offline-first, zero runtime network deps; audio must start from a user gesture; colours never sole indicator |

## Tech stack

- **Vite + React + TypeScript** — responsive browser application per the stated platform (`"Platform: Responsive browser application"`). No SSR, no router needed for a single Explore screen.
- **Web Audio API** — native oscillators + gain envelopes; no audio library. A short-lived, polyphonic voice pool provides multi-key playback with zero dependencies.
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
| Audio | Web Audio API (native) | polyphonic oscillators, no dependency, fully offline | none |
| Testing | Vitest + jsdom | pure theory engine unit tests | `npm install -D vitest@latest jsdom@latest` |
| Lint | oxlint | already pinned in `.oxlintrc.json` | `npm install -D oxlint@latest` |

## Data model

| Entity | Fields | Notes |
|--------|--------|-------|
| PitchClass | `value` 0–11 (C=0 … B=11), `label` ("C"…"B", sharps for accidentals) | §6.1: all 12 chromatic roots selectable |
| ChordQuality | `id`, `intervals: number[]` (semitones), `suffix`, `name: string` (full readable name), `genreGuide: string[]`, `genres: GenreId[]` | catalogue = major, minor, diminished, augmented, sus2, sus4, 6, 7, maj7, m7, 9, add9. `name` and `genres` are additive fields on the existing 12 entries — no id/interval/suffix changes — so they don't trip the phase brief's "no changes to predefined catalogues" line; see the table below for exact values. |
| GenreId | `'Any' \| 'Pop' \| 'Rock' \| 'Jazz' \| 'Blues' \| 'Classical'` | canonical genre catalogue; single source for the genre selector's options and for `ChordQuality.genres` matching — replaces the string literal previously local to the selector component |
| ScaleType | `major`, `naturalMinor`, `augmented`, `locrian`, `mixolydian`; each with `intervals` | full catalogue in §Scale catalogue below — `augmented`/`locrian`/`mixolydian` are new this phase, so every `ChordQuality` has a scale that actually contains its own chord tones |
| KeyContext | `root: PitchClass`, `scaleType: 'major' \| 'naturalMinor'` | the optional key/mode advanced control keeps its existing two-option range unchanged — the three new scale types are chord-driven only (§Chord-scale mapping), never user-selectable here |
| Selection | `root`, `quality`, `key: KeyContext`, `scaleMode: 'chord-root'\|'key'`, `viewMode: 'chord'\|'scale'\|'both'`, `genre: GenreId` | default: C major, scaleMode `chord-root`, viewMode `both`, genre `Any` |
| Voicing | `baseMidi: number[]`, `inversion: number` | Phase 1 always root-position close voicing (`inversion: 0`); concept reserved so later voicings/inversions extend, not rework |
| DisplayRange | `startMidi`, `endMidi` | default 2 octaves from C3 (48–71); selectable so keys stay usable on mobile |

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

**Scale catalogue — new intervals (phase-3).** `augmented`, `locrian`, and `mixolydian` join the existing `major`/`naturalMinor` to fix the phase-2 bug: chord-root mode always showed the major scale regardless of quality, which produced correct markers only by accident for major-family chords.

| id | intervals (semitones from root) |
|---|---|
| augmented | `[0, 3, 4, 7, 8, 11]` |
| locrian | `[0, 1, 3, 5, 6, 8, 10]` |
| mixolydian | `[0, 2, 4, 5, 7, 9, 10]` |

**Chord-scale mapping (chord-root mode only).** `chordScaleType(quality)` returns the one `ScaleTypeId` whose scale contains every one of that quality's own chord tones on the same root — this *is* "the correct theoretical scale" the phase brief's Exit Criteria test. It applies only when `Selection.scaleMode === 'chord-root'`; in `'key'` mode the scale stays `KeyContext.scaleType`, unchanged and still limited to `major`/`naturalMinor`.

| QualityId | ScaleTypeId | Why |
|---|---|---|
| major, sus2, sus4, 6, maj7, add9 | major | major third or no third; every chord tone is diatonic to major |
| minor, m7 | naturalMinor | minor third with a natural (not flattened) seventh; every chord tone is diatonic to natural minor |
| diminished | locrian | the standard chord-scale for a diminished triad (built on the 7th degree of a major key); the only catalogue scale containing the diminished 5th alongside the minor 3rd |
| augmented | augmented | neither major (no ♯5) nor natural minor (no major 3rd) contains `{root, 3rd, ♯5}`; the augmented (symmetric hexatonic) scale does — confirmed against the phase-2 backlog's recorded correct notes for C augmented (`C, D♯, E, G, G♯, B`) |
| 7, 9 | mixolydian | dominant (flattened-7th) chords; `major` has a natural 7th so cannot contain the chord's own ♭7 |

## Public / integration interface contracts

| Surface | Exact operation | Inputs & defaults | Result / failure | Canonical mapping / ownership |
|---------|-----------------|-------------------|------------------|-------------------------------|
| `musicCore` | `chordTones(root: PitchClass, quality: ChordQuality)` | — | `PitchClass[]`; unknown quality → throws | `quality.intervals` applied mod 12 |
| `musicCore` | `scaleTones(root: PitchClass, scaleType: ScaleType = 'major')\|)` | — | `PitchClass[]` | `scaleType.intervals` applied mod 12 |
| `musicCore` | `chordScaleType(quality: ChordQuality)` | — | `ScaleTypeId` | pure lookup, canonical mapping in §Chord-scale mapping; used only in `chord-root` mode — `key` mode keeps reading `KeyContext.scaleType` directly |
| `musicCore` | `rootPositionVoice(chord)` | `chord: {root, quality}` | `number[]` MIDI notes in a default band around C3 | `chordTones` octave-shifted; always `inversion: 0` |
| `musicCore` | `variationsFor(root, currentQuality)` | — | `{quality, name, genreGuide}[]` in catalogue order, excluding `currentQuality` | `ChordQuality` catalogue filtered |
| `musicCore` | `chordName(root, quality)` | — | string (e.g. "A", "Am", "A7", "A♯") | PitchClass `label` + quality `suffix` |
| `musicCore` | `chordFullName(root: PitchClass, quality: ChordQuality)` | — | string (e.g. "A diminished") | PitchClass `label` + quality `name`, space-joined |
| `musicCore` | `isRecommendedForGenre(quality: ChordQuality, genre: GenreId)` | — | `boolean` | `true` only when `quality.genres` includes `genre`; always `false` for `genre === 'Any'` — "Any" is not a wildcard match, it shows no recommendation cue on any tile (phase brief E4c); pure lookup, no matching against free-text `genreGuide` |
| `audioEngine` | `init()` | — | `Promise<void>`; resolves/resumes on a user gesture | lazily creates + resumes shared `AudioContext` |
| `audioEngine` | `noteOn(midi: number)` | — | plays immediately; silently no-ops if not initialised / not resumed | allocates a voice from pool |
| `audioEngine` | `noteOff(midi: number)` | — | releases the playing voice | maps release to allocated voice |
| `audioEngine` | `playChord(voice: number[])` | ~2.5s held | stops current playback, plays the exact displayed voicing/inversion | voices scheduled from `voice` |
| `audioEngine` | `playArpeggio(voice: number[])` | ~120ms per note | rolls notes sequentially | same voice set, staggered |
| `audioEngine` | `playScale(scale: number[], pattern = 'updown')` | ~200ms per note | plays the scale ascending then descending | notes from `scaleTones` mapped to MIDI band |

## Storage strategy

No persistence this phase: the selection model is in-memory only (`useSelectionStore`). Local data, favourites, and backup are deliberately later phases; nothing about the store shape assumes them.

## Key technical decisions

- **Voice pool, not per-note nodes.** Polyphony uses a fixed pool of oscillator+gain pairs; `noteOn` allocates the next free voice so simultaneous key presses sound together while avoiding unbounded node creation.
- **AudioContext created on first user gesture.** Browsers block autoplay; every playback path (key press, play chord, scale, arpeggio) is reachable only through gestures, so a lazy `init()` on first interaction satisfies the policy.
- **Theory engine is pure and dependency-free.** `musicCore` is pure functions → unit-testable in Vitest; UI and audio never compute intervals themselves.
- **Single store drives "immediate see-and-hear."** Any selector update writes one `Selection`; keyboard highlights, variation panel, and playback read it reactively, so the screen and the sound always reflect the same selection.
- **Chord-root scale is quality-derived, never hardcoded.** `chordScaleType` (§Chord-scale mapping) replaces the phase-2 behaviour of always showing the major scale in chord-root mode — the cause of the reported wrong-scale bug and, by the same logic, of every non-major-family quality being wrong whether or not it was reported.
- **Genre recommends, never filters.** Selecting a genre marks matching chord-type tiles with a non-colour "Recommended" cue (text or icon, never colour alone, per the accessibility posture); no tile is hidden, reordered, or disabled. A hard filter could empty the tile grid for a genre few qualities are tagged with, which would violate "a useful default is always visible." The genre control keeps its existing secondary-control-row placement (§Screen Composition) — its behavioural link to the tile grid, not a relocation, is what makes it more than "a settings-style equal." Choosing `Any` clears the cue entirely rather than matching every tile — `isRecommendedForGenre` returns `false` for `Any` by contract, so no quality needs a `genres` entry naming it.

## Out of Scope

Architectural commitments, not phase scope. This app stays fully client-side: no backend service, no accounts, and no external/third-party APIs at runtime — required for offline-first use after install.

## Platform constraints

- **Autoplay policy:** audio requires a user gesture; on iOS/mobile the first touch must also `resume()` the context.
- **Polyphony:** desktop keys give simultaneous presses; mobile touch may be single-point. Keys must play singly everywhere and polyphonically wherever the input method allows.
- **Small screens:** the octave-range control must keep keys usable without unbounded shrinking; horizontal scroll is acceptable.
- **Latency:** a press must sound immediately (budget ≤ ~50 ms perceived); no network or deferred audio buffering.

## Product principle constraints

- **"Select something and immediately see and hear the musical result"** → selection change must re-render highlights and be audible in the same gesture, with no extra "apply" step.
- **Accessibility posture** → chord tones, scale notes, root, and bass states must be distinguishable without colour alone; playback state needs non-colour indication.
- **A useful default is always visible** → first load renders C major before any user input.

## Cross-environment boundaries

None: a single browser rendering environment. Desktop vs mobile differences (polyphony, focus, pointer) are handled inside the one environment as platform constraints above.