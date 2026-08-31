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
| ChordQuality | `id`, `intervals: number[]` (semitones), `suffix`, `genreGuide: string[]` | catalogue = major, minor, diminished, augmented, sus2, sus4, 6, 7, maj7, m7, 9, add9 |
| ScaleType | `major`, `naturalMinor`; each with `intervals` | scale set this phase (§11 base) |
| KeyContext | `root: PitchClass`, `scaleType` | the optional key/mode advanced control |
| Selection | `root`, `quality`, `key: KeyContext`, `scaleMode: 'chord-root'\|'key'`, `viewMode: 'chord'\|'scale'\|'both'` | default: C major, scaleMode `chord-root`, viewMode `both` |
| Voicing | `baseMidi: number[]`, `inversion: number` | Phase 1 always root-position close voicing (`inversion: 0`); concept reserved so later voicings/inversions extend, not rework |
| DisplayRange | `startMidi`, `endMidi` | default 2 octaves from C3 (48–71); selectable so keys stay usable on mobile |

## Public / integration interface contracts

| Surface | Exact operation | Inputs & defaults | Result / failure | Canonical mapping / ownership |
|---------|-----------------|-------------------|------------------|-------------------------------|
| `musicCore` | `chordTones(root: PitchClass, quality: ChordQuality)` | — | `PitchClass[]`; unknown quality → throws | `quality.intervals` applied mod 12 |
| `musicCore` | `scaleTones(root: PitchClass, scaleType: ScaleType = 'major')\|)` | — | `PitchClass[]` | `scaleType.intervals` applied mod 12 |
| `musicCore` | `rootPositionVoice(chord)` | `chord: {root, quality}` | `number[]` MIDI notes in a default band around C3 | `chordTones` octave-shifted; always `inversion: 0` |
| `musicCore` | `variationsFor(root, currentQuality)` | — | `{quality, name, genreGuide}[]` in catalogue order, excluding `currentQuality` | `ChordQuality` catalogue filtered |
| `musicCore` | `chordName(root, quality)` | — | string (e.g. "A", "Am", "A7", "A♯") | PitchClass `label` + quality `suffix` |
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