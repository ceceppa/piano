# Project Rules — Piano Chord Explorer

Accessibility level: WCAG 2.1 AA

## Folder Structure

**What:** Screens, the theory engine, and the audio layer live in clearly separated modules; UI components stay reusable and presentation-only.

**Why:** Phase 1 already has three distinct concerns — pure theory, browser audio, and React UI — and later phases (favourites, playback engine) must extend them without entangling.

**Pattern:**
- `musicCore` (theory) → pure TypeScript, no React, no DOM, no audio.
- `audioEngine` (Web Audio) → browser-only, no React; operates on MIDI note numbers.
- React UI → components reading the zustand store; no domain math inline.

## Naming

**What:** Pitch classes are named with sharps (C, C♯, …, B); files match their default export; chord qualities use their catalogue `id`.

**Why:** The product spells accidentals with sharps (e.g. `A/C♯`), and stable ids keep the variation panel and musicCore aligned.

**Pattern:**
- `chordTones(root, "maj7")` — never a human label in code.
- Component files named after their component.

## Components

**What:** Separate the playable keyboard, the selectors, and playback controls into components that receive selection state from the store; no component owns the musical model. Reusable primitives live in `src/components/shared/`; feature components live in `src/components/`.

**Why:** "Immediate see-and-hear" means keyboard, variation panel, and controls all react to one store; duplicating the model in a component breaks the loop. Shared primitives keep accessibility semantics and theme tokens in one place instead of diverging per screen.

**Pattern:**
- One `useSelectionStore`; components read `root`, `quality`, `scaleMode`, `viewMode` from it.
- Playback actions call `audioEngine` functions directly — never embed oscillator logic in a component.
- Feature components compose shared primitives; they do not re-style or re-implement them.

### Shared `Button`

**What:** Every actionable button uses the shared `Button`. It wraps a native `<button>` and owns all keyboard, focus, disabled, and toggle semantics.

**Why:** Button is the most repeated control and the reference UI defines primary/ghost variants; one component prevents per-screen divergence in focus rings, disabled handling, and aria state.

**Pattern:**
- Props: `variant: 'primary' | 'ghost'`, `disabled?: boolean`, `pressed?: boolean`, plus standard button props (`onClick`, `children`, `aria-label`).
- Always renders a native `<button type="button">` — never a div or span with a click handler.
- Toggle state uses `aria-pressed` plus a non-colour cue (e.g. marker, border, text), never colour alone.
- Disabled uses native `disabled` (removed from tab order), not `aria-disabled`.
- Visible focus only on `:focus-visible`; never remove the focus ring unconditionally.
- Colours and radius come from theme tokens in `src/index.css`; no inline hex.

### Shared `Select`

**What:** All dropdown fields (quality, key/mode, genre, octave range) use a shared `Select` over a native `<select>` with a visible label.

**Why:** A native select gives keyboard and screen-reader support for free; one wrapper keeps token styling and labelling consistent.

**Pattern:**
- Native `<select>` with an associated `<label>` (or `aria-label` when space is tight).
- Option values are catalogue ids (`QualityId`, `ScaleTypeId`, pitch-class number), never display labels.
- Theme-token styling; `:focus-visible` ring.

### Shared `SegmentedControl`

**What:** Single-choice groups rendered as segmented buttons (root note, view mode, scale-follow) use `SegmentedControl`.

**Why:** The reference UI styles these as a segmented group; shared semantics keep selection state and non-colour indicators consistent.

**Pattern:**
- Native radio inputs (or buttons with `role="radiogroup"` + arrow-key navigation when needed).
- Selected option marked with a non-colour cue (text/border), never colour alone.
- `:focus-visible` on every option.

### Shared `ToggleSwitch`

**What:** The light/dark theme switch uses `ToggleSwitch`.

**Why:** A switch needs correct `role="switch"` / `aria-checked` semantics and a state that is visible without colour.

**Pattern:**
- Native checkbox input styled as a switch, or a button with `role="switch"` and `aria-checked`.
- State shown by text (e.g. "Light" / "Dark") plus position, not colour alone.
- `:focus-visible` ring; usable via keyboard (Space toggles).

### Shared `Card`

**What:** Control panels and list surfaces (Musical Context, Variations) use `Card` with the reference's label header.

**Why:** Consistent panel structure across the Explore screen keeps layout changes local.

**Pattern:**
- `Card` renders a padded container with a themed header; content is the consumer's children.
- Background, border, radius from theme tokens.
- Header uses the label style from the design brief (`label-mono`); not restated per card.

### Shared `Chip`

**What:** Static status/genre-guidance labels use `Chip`.

**Why:** Small pill labels appear in the variation panel; one component keeps text-first, accessible labelling.

**Pattern:**
- Text always present and readable; background tint is decorative, never the only signal.
- `body-sm` size from the design brief.

### Extraction threshold

**What:** Extract a shared component only when the same control appears in two or more places. One-off controls stay local to their feature component.

**Why:** Avoids premature abstraction while keeping genuinely repeated primitives consistent.

**Pattern:** A second occurrence of a control pattern is the trigger to extract; a single-use control is not promoted.

## Patterns — State Management

**What:** All selection and view state lives in the zustand store; transient interaction state (a held key) stays local to the component handling it.

**Why:** Selection must be shared reactively across components; key-press state is ephemeral and belongs in the keyboard's own handlers.

**Pattern:**
- Store: `{ root, quality, key, scaleMode, viewMode, octaveRange }`.
- Held-key/pressed-state: local component state or refs, not the store.

## Patterns — Audio

**What:** Route every audio call through `audioEngine`; create and resume the shared `AudioContext` only inside `init()` triggered by the first user gesture.

**Why:** Browsers block autoplay; keeping one gesture-created context makes polyphony and note release predictable.

**Pattern:**
- `await audioEngine.init()` once on first interaction.
- `noteOn(midi)` / `noteOff(midi)` for keyboard; `playChord`, `playArpeggio`, `playScale` for actions.

## Patterns — Typography

**What:** Every font-family in the app comes from exactly three family tokens — `--font-display`, `--font-body`, `--font-mono` — defined once in `src/index.css` `:root`, outside the theme blocks. Text tokens (`--text-*`) and components reference them via `var(--font-…)`; no component CSS writes a literal `font-family`.

**Why:** Changing the typeface should be one edit in one place instead of a hunt through every component's stylesheet.

**Pattern:**
- Family choices and text-token sizes live in `design-brief.md §Typography`; `:root` maps them to the three family tokens.
- Components and text tokens consume `var(--font-…)` only; a literal `font-family` in component CSS is a violation.
- If fonts are ever self-hosted, `@font-face` declarations land beside the tokens in `src/index.css`, still one place.

## Patterns — Theme

**What:** Light and dark mode are driven by a `data-theme` attribute on the document root, resolved through CSS custom-property tokens in `src/index.css`. Every colour, radius, and surface value is a token; components reference tokens, never inline hex.

**Why:** The reference UI enables `darkMode: class` and the user requires both modes plus a switch; tokens keep both palettes in one canonical home so a change stays consistent everywhere.

**Pattern:**
- `:root[data-theme='light'] { ... }` and `:root[data-theme='dark'] { ... }` blocks define the palettes; values come from the design brief (`design-brief.md`).
- A `ToggleSwitch` in the header sets/clears the attribute on `document.documentElement`.
- Default follows the system preference until the user switches; the choice persists for the session.
- Every text/background pairing meets WCAG 2.1 AA in both modes (verify per pairing when tokens change).

## Architecture

**What:** The theory engine stays pure and side-effect-free; audio never computes intervals; UI never computes frequencies.

**Why:** Keeps exactly one place for musical truth and makes `musicCore` trivially testable.

**Pattern:**
- `musicCore.chordTones` → pitch classes. `audioEngine` maps pitch classes to MIDI/frequency.
- No network calls anywhere in the client.

## Accessibility

**What:** WCAG 2.1 AA applies to every control. Chord tones, scale notes, root, and bass must be distinguishable without colour alone; all controls are keyboard-operable with visible focus.

**Why:** The phase brief makes non-colour distinction an explicit success criterion, and keyboard accessibility is a stated product requirement.

**Pattern:**
- Marker kinds get labels, patterns, or both — never colour-only.
- Native buttons/inputs or elements with proper roles; visible `:focus-visible`.
- Playback state (playing/stopped) shown with text or aria state, not colour alone.

## Testing

**What:** Unit-test `musicCore` (all 12 qualities and both scales, pitch-class correctness) and add integration tests where components and the store interact; audio is covered by a thin seam, not by asserting real sound.

**Why:** The theory engine is deterministic and is the highest-risk logic; the requirement is unit + integration/mix per the phase decision.

**Pattern:**
- Unit: every `ChordQuality` interval and scale spelling, `variationsFor`, `rootPositionVoice`.
- Integration: selection change re-renders keyboard highlights and variation list (jsdom + Vitest).
- `audioEngine` behind a mock in tests; do not open a real `AudioContext` in unit tests.