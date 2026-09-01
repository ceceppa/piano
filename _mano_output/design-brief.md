# Design Brief — Piano Chord Explorer

Visual language: **Ivory & Ink** — High-Precision Minimalist. Clean lines, generous whitespace, tonal layers instead of heavy shadows; the piano keyboard is always the highest-contrast element on screen. Origin: `ui/ivory_ink/DESIGN.md`; phase-1 screen reference: `ui/explore_chords/code.html`.

## Accessibility target

WCAG 2.1 AA everywhere: normal text ≥ 4.5:1, large text and UI graphics ≥ 3:1. Colour is never the sole indicator — musical states pair colour with shapes, markers, borders, or text.

## Framework / component library

React + Vite + TypeScript with **no third-party UI kit**. The visual system is CSS custom-property tokens in `src/index.css`, consumed as `var(--token)`. Shared primitives live in `src/components/shared/` (`Button`, `Select`, `SegmentedControl`, `ToggleSwitch`, `Card`, `Chip`); feature components live in `src/components/`.

## Theme system

Light/dark mode is driven by a `data-theme` attribute on `document.documentElement`; `:root[data-theme='light']` and `:root[data-theme='dark']` token blocks live in `src/index.css`. A `ToggleSwitch` in the header sets the attribute; the default follows the system preference until the user switches. Every colour pairing below is verified against the AA target in both modes.

## Colour palette

Token names are the canonical values components reference. Hex pairs are Light / Dark.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-background` | `#F8F9FA` | `#202224` | page background |
| `--color-surface` | `#FFFFFF` | `#26282A` | cards, panels, keyboard band |
| `--color-surface-low` | `#F3F4F5` | `#2B2D2F` | hover, chip tint |
| `--color-surface-high` | `#E7E8E9` | `#36383A` | pressed, selected-row tint |
| `--color-on-surface` | `#191C1D` | `#E1E3E4` | primary text (16.26:1 / 12.70:1) |
| `--color-on-surface-variant` | `#45474B` | `#C6C8C9` | secondary text, labels (9.31:1 / 8.82:1) |
| `--color-primary` | `#02040A` | `#C3C6D1` | buttons, primary text, black-key family |
| `--color-on-primary` | `#FFFFFF` | `#1A1E26` | text on primary (20.50:1 / 9.80:1) |
| `--color-secondary` | `#0040E0` | `#B8C3FF` | active musical states, chord-tone marker (7.47:1 / 5.45:1) |
| `--color-on-secondary` | `#FFFFFF` | `#0035BE` | text on secondary |
| `--color-tertiary` | `#735C00` | `#E9C349` | root marker gold fill (6.44:1 on white) |
| `--color-on-tertiary` | `#FFFFFF` | `#4E3D00` | text on tertiary |
| `--color-error` | `#BA1A1A` | `#FFB4AB` | errors (6.46:1) |
| `--color-outline` | `#76777C` | `#8F9293` | borders, dividers |
| `--color-outline-variant` | `#C6C6CB` | `#45474B` | subtle borders |
| `--color-key-white` | `#FFFFFF` | `#F1F2F2` | white piano keys |
| `--color-key-black` | `#121417` | `#0D0E0F` | black piano keys |
| `--color-scale-tone-muted` | `#E2E8F0` | `#3C3E41` | scale-note tint |
| `--color-highlight-teal` | `#00B4D8` | `#00B4D8` | auxiliary highlight |
| `--color-success-green` | `#22C55E` | `#22C55E` | success states |

## Typography

Tri-font hierarchy: **Hanken Grotesk** (headlines), **Inter** (body), **JetBrains Mono** (labels, notation, chord formulas). Fonts are self-hosted and bundled (offline-first; no runtime CDN), with system fallbacks.

| Token | Font | Size / Line-height / Weight | Use |
|---|---|---|---|
| `--text-headline-xl` | Hanken Grotesk | 40px / 48px / 700, -0.02em | screen title (desktop) |
| `--text-headline-lg` | Hanken Grotesk | 32px / 40px / 600, -0.01em | section headers (desktop) |
| `--text-headline-lg-mobile` | Hanken Grotesk | 24px / 32px / 600 | section headers (mobile) |
| `--text-body-md` | Inter | 16px / 24px / 400 | body copy, controls |
| `--text-body-sm` | Inter | 14px / 20px / 400 | captions, chips, guidance |
| `--text-label-mono` | JetBrains Mono | 13px / 16px / 500, 0.05em | card headers, button labels |
| `--text-notation-lg` | JetBrains Mono | 20px / 28px / 600 | chord names, variation rows |

## Spacing & shape

- **Spacing scale:** 8px base rhythm; `container-margin` 24px, `gutter` 16px, `card-padding` 20px, `base` 8px.
- **Radius:** `sm` 0.125rem, `DEFAULT` 0.25rem (buttons, controls), `md` 0.375rem, `lg` 0.5rem, `xl` 0.75rem (cards, panels), `full` 9999px (chips, switches).
- **Elevation:** tonal layers + low-contrast outlines (1px `outline-variant`); only floating elements use `0px 10px 30px rgba(0,0,0,0.05)`.
- **Icon style:** Material Symbols outlined, rendered as inline SVG (no runtime CDN), 24px base grid, stroke ~1.75.

## Component guide

### Piano Keyboard (hero)
- White keys `--color-key-white`, 1px `--color-outline-variant` border, radius `lg` bottom. Black keys `--color-key-black`, height 55% of white. Desktop height 240px, mobile 180px.
- **Black-key geometry (canonical, from `ui/explore_chords/code.html`):** black-key width = **66.67% (2:3) of a white-key width**. Each black key is horizontally **centred on the seam between its two adjacent white keys**: place its left edge at the seam, then translate it left by **50% of its own width** (the reference uses `width: 32px; margin-left: -16px` on a 48px white key). No black-key edge ever lands on a white-key edge.
- **Markers (non-colour paired):** Root = gold diamond (`--color-tertiary` fill, 2px `#4E3D00` stroke → 10.55:1 ✓) + the key's 3px double-border state. **The root diamond is the largest key marker (18px)** so it reads at a glance against the chord-tone dot (12px) and scale-note ring (16px, phase-3) — the size + the strongest border carry the root identity, never colour alone. Chord tone = `--color-secondary` dot (≥ 7:1 on white ✓). **Scale note (phase-3 redesign):** a solid 2px `--color-secondary` ring, 16px, at full opacity — replaces the phase-2 30%-opacity dashed ring the phase-2 review found hard to distinguish at a glance. The hollow-ring shape stays distinct from the filled root diamond and filled chord-tone dot by shape alone, before colour registers. The key itself also gets a full-opacity `--color-scale-tone-muted` background wash, so a scale-in-key note reads differently from an unmarked key even without the ring. Active key = light secondary tint (`#DDE1FF` light / `#2E5BFF` dark) with inset shadow.
- **Bass marker (phase-4):** a 4px `--color-primary` bar along the full width of the key's bottom edge — a shape distinct from the root diamond, chord-tone dot, and scale-tone ring, so it reads independently of colour. Marks whichever key is currently the lowest note of the voiced chord; at root position this is the same key as the root diamond, so both render together (diamond + bar) rather than one replacing the other.
- **Hand-grouping strip (phase-4, Left/Right-hands voicing only):** a 3px bracket strip directly above the keyboard band, spanning each hand's key range, with a small filled tag at the bracket's left end: "L" on `--color-primary` fill / `--color-on-primary` text (20.50:1 / 9.80:1 ✓), "R" on `--color-secondary` fill / `--color-on-secondary` text (7.47:1 / 5.45:1 ✓). The letter is the non-colour cue; the two token families (ink vs. blue) are already established for unrelated purposes elsewhere, so the strip reads as its own channel rather than colliding with root/chord-tone/scale markers on the keys themselves. Hidden entirely for `close` and `open` voicings.
- Keyboard band sits on `--color-surface` between `outline-variant` rules.

### Shared `Button`
- Variants: `primary` (`--color-primary` fill, `--color-on-primary` text), `ghost` (transparent, 1px `--color-outline-variant` border, `--color-on-surface` text). Radius `DEFAULT` (0.25rem). Height 40px; padding 0 16px; `--text-label-mono`.
- Toggle state: `aria-pressed` + non-colour cue (border change or ✓ marker). Disabled: native `disabled`. Focus: `:focus-visible` 2px `--color-secondary` ring. Contrast: primary 20.5:1 ✓; ghost on surface 16.26:1 ✓.

### Shared `Select`
- Native `<select>` styled with `--color-surface` fill, 1px `--color-outline-variant` border, radius `DEFAULT`, `--text-body-md`; `:focus-visible` 2px `--color-secondary` ring. Label above in `--text-label-mono` `--color-on-surface-variant`.

### Shared `SegmentedControl`
- Grouped buttons sharing outer `DEFAULT` radius; selected option `--color-primary` fill + `--color-on-primary` text (or `--color-surface-high` tint with a bottom border in `--color-secondary`), never colour alone; `:focus-visible` ring on each option.

### Shared `ToggleSwitch`
- Native checkbox or `role="switch"`; track `--color-surface-high`, knob `--color-surface`; on state `--color-secondary` track + knob at right. Always paired with text label ("Light"/"Dark"); `aria-checked` reflects state.

### Shared `Card`
- Container on `--color-surface`, 1px `--color-outline-variant` border, radius `xl`, padding `card-padding` 20px. Header: `--text-label-mono`, uppercase, letter-spacing 0.05em, `--color-on-surface-variant`.

### Shared `Chip`
- Pill (`radius full`), `--text-body-sm`, `--color-surface-low` fill with 1px `--color-outline-variant`; text `--color-on-surface`. Text always present; tint is decorative.

### PlaybackBar
- Desktop: transport cluster (primary round play button 48px, ghost action buttons `Play chord` / `Arpeggiate` / `Play scale`) + a `--text-label-mono` uppercase status label ("READY" / "PLAYING…"). Mobile: fixed-bottom 72px bar on `--color-surface`, 1px top `--color-outline-variant` border. Playback state is text/aria, never colour only. **Play chord is the primary action; Arpeggiate and Play scale are secondary** — visually subordinate but still one cluster directly beneath the keyboard.

### Notes panel (phase-3)
- A `Card` labelled "NOTES" (`--text-label-mono` header) sitting directly beneath the keyboard. Two rows in `--text-notation-lg` mono: "Chord: C · E · G" always shown; "Scale: C · D · E · F · G · A · B" shown only when `viewMode` is `scale` or `both` — the same store field that already drives keyboard highlighting, no new control. Row labels in `--text-label-mono` `--color-on-surface-variant`.

### Chord-type tile grid (Explore [root] chord types)
- Replaces the single-column variation rows. A `Card`-less section titled "Explore [root] chord types" in `--text-headline-lg`; chord types are **grouped**: Core (A, Am, Adim, Aaug), Colour (Asus2, Asus4, A6, Aadd9), Sevenths & extensions (A7, Amaj7, Am7, A9). Group headers in `--text-label-mono`, uppercase.
- Each tile: chord symbol in `--text-notation-lg` `--color-on-surface`, short explanatory label in `--text-body-sm` `--color-on-surface-variant`, `--color-surface-low` fill, 1px `--color-outline-variant` border, radius `DEFAULT`, min 88px height, responsive grid (auto-fill, min 120px columns). Selected state: `--color-secondary` fill + `--color-on-secondary` text + 2px `--color-secondary` outline (non-colour cue), never colour alone. `:focus-visible` 2px `--color-secondary` ring.

### Header slash-chord label (phase-4)
- Directly beside the selected-chord title: the slash-chord symbol (e.g. "C/E") in `--text-notation-lg` mono, matching the title's notation style, shown only when the current inversion is not root position. Beside it, the plain inversion name (e.g. "1st inversion") in `--text-body-sm` `--color-on-surface-variant` — same caption treatment already used for genre guidance text. Both are absent at root position; nothing renders in their place.

### Arrangement controls (phase-4)
- Two `SegmentedControl`s — Inversion and Voicing — using the existing shared component and styling as-is (§Shared `SegmentedControl`); no new visual variant. Inversion's option count varies with the current chord quality (3 for a triad, up to 5 for extended chords); Voicing always shows Close / Open / Left-Right hands. Grouped with, and styled identically to, the dominant root/quality pair — same `--text-body-md` label weight, no card — since arrangement is part of choosing the chord, not a secondary setting.

### Control area (chord-first hierarchy)
- **Root note + chord quality are the dominant control pair**, placed together at the top in `--color-on-surface` with `--text-body-md` labels; root-note `SegmentedControl` (`--text-notation-lg`) and quality `Select` — both visually stronger (larger text, no card), with nothing else between this pair and the keyboard (phase-3). **Secondary/context controls** (scale-follow, view mode, octave range, note names, genre) follow as a quieter `--text-body-sm` `--color-on-surface-variant` row on `--color-surface-low`, now positioned after the keyboard and notes panel rather than before them (phase-3) — see Screen Composition. No large bordered `Card` around the control area; spacing + grouping carry the hierarchy.

## Screen Composition

### phase-4 — Explore (arrangement controls + bass/hand-grouping keyboard states, supersedes phase-3 for this phase)
1. **Header:** app title (`headline-lg`, lighter weight) + light/dark `ToggleSwitch`. Unchanged from phase-3.
2. **Selected-chord title:** the chord's full readable name in `--text-headline-xl` (desktop) / `headline-lg-mobile` (mobile), with the slash-chord label + inversion name beside it when not root position (phase-4, see Component guide).
3. **Dominant pair, extended:** root-note `SegmentedControl` + quality `Select`, plus the two new Arrangement `SegmentedControl`s (Inversion, Voicing) — same row/group, same visual weight, directly above the keyboard with nothing between them.
4. **Piano keyboard band:** directly beneath the dominant pair. Full-width `--color-surface` band, 1px `outline-variant` rules, keys + markers (root diamond, chord-tone dot, scale-tone ring, phase-4 bass-marker bar), with the hand-grouping strip appearing above it only for the Left/Right-hands voicing.
5. **Notes panel:** unchanged from phase-3 — a `Card` labelled "NOTES" beneath the keyboard, listing notes in the current voicing's bass-to-treble order.
6. **Secondary/context row:** unchanged from phase-3 — view mode, scale-follow, octave range, genre, note-names.
7. **PlaybackBar:** unchanged from phase-3.
8. **Chord-type tile grid:** unchanged from phase-3.

### phase-3 — Explore (keyboard-adjacent notes panel, supersedes phase-2 for this phase)
1. **Header:** app title (`headline-lg`, lighter weight) + light/dark `ToggleSwitch`. Unchanged from phase-2.
2. **Selected-chord title:** the chord's full readable name in `--text-headline-xl` (desktop) / `headline-lg-mobile` (mobile). Unchanged from phase-2.
3. **Dominant pair:** root-note `SegmentedControl` + quality `Select`, directly above the keyboard with nothing between them (phase-3 — previously the full control block, including the secondary row, sat between this pair and the keyboard).
4. **Piano keyboard band:** directly beneath the dominant pair. Full-width `--color-surface` band, 1px `outline-variant` rules, keys + markers (root diamond 18px, chord-tone dot 12px, redesigned scale-tone ring 16px — see Component guide).
5. **Notes panel:** a `Card` labelled "NOTES" directly beneath the keyboard — always lists the selected chord's notes; when `viewMode` is `scale` or `both`, also lists the scale's notes on a second row.
6. **Secondary/context row:** `SegmentedControl`s for view mode and scale-follow, `Select`s for octave range and genre, note-names toggle — now positioned after the keyboard and notes panel (phase-3).
7. **PlaybackBar:** directly beneath the secondary row — primary play button + `Play chord` as primary action, `Arpeggiate` / `Play scale` secondary, + status label; fixed bottom 72px on mobile, inline on desktop.
8. **Chord-type tile grid:** "Explore [root] chord types" with grouped tiles (Core / Colour / Sevenths & extensions) + selected-state highlight; selecting updates title, keyboard, notes panel, and playback immediately.

### phase-2 — Explore (chord-first layout, supersedes phase-1 for this phase)
1. **Header:** app title (`headline-lg`, lighter weight) + light/dark `ToggleSwitch`. No chord subtitle here — the chord moves down into its own dominant heading.
2. **Selected-chord title:** the chord's full readable name in `--text-headline-xl` (desktop) / `headline-lg-mobile` (mobile), e.g. "A diminished". The short symbol (`Adim`) stays in controls and tiles.
3. **Control area (no big bordered card):** root-note `SegmentedControl` + quality `Select` as the dominant pair in one group; below them a quieter secondary row — `SegmentedControl`s for view mode and scale-follow, `Select`s for octave range and genre, note-names toggle.
4. **Piano keyboard band:** directly after the root/quality pair so selection visibly drives the highlights. Full-width `--color-surface` band, 1px `outline-variant` rules, keys + markers (root diamond 18px), horizontally scrollable on mobile.
5. **PlaybackBar:** directly beneath the keyboard — primary play button + `Play chord` as primary action, `Arpeggiate` / `Play scale` secondary, + status label; fixed bottom 72px on mobile, inline on desktop.
6. **Chord-type tile grid:** "Explore [root] chord types" with grouped tiles (Core / Colour / Sevenths & extensions) + selected-state highlight; selecting updates title, keyboard, and playback immediately.

### phase-1 — Explore
1. **Header:** app title (`headline-xl` desktop / `headline-lg-mobile`), current chord name in `notation-lg`, and the light/dark `ToggleSwitch`. Max-width 1280px, `container-margin` gutters.
2. **Controls (Musical Context `Card`):** Root-note `SegmentedControl` (12 chromatic, `notation-lg`), Quality `Select`, and the collapsed "Advanced: key / mode" block (`Select`s). Followed by `SegmentedControl`s for "Scale follows" (chord root / selected key) and view mode (chord / scale / both), plus the octave-range `Select`.
3. **Piano keyboard band:** full-width `--color-surface` band with 1px `outline-variant` rules, keys + markers, horizontally scrollable on mobile.
4. **PlaybackBar:** primary play button + ghost `Play chord` / `Arpeggiate` / `Play scale` + status label; fixed bottom 72px on mobile, inline on desktop.
5. **VariationPanel `Card`:** variation rows with genre-guidance `Chip`s; selecting one updates keyboard, label, and playback immediately.

Layout: desktop 12-column grid — controls 8 cols, right rail 4 cols reserved for later-phase surfaces (progression cards); single-column stack on mobile. Primary loop: *choose a chord → see it on the keyboard → hear it immediately*, no apply step.
