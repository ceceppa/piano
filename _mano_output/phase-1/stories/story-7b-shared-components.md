### STORY-7b: Shared components

#### What and why
The design brief and project rules name six reusable primitives — Button, Select, SegmentedControl, ToggleSwitch, Card, Chip — that every screen control should be built from. A developer picking up any restyle story needs these to exist with the agreed accessibility semantics before the screen is rebuilt, so the shared library lands first.

#### Done when
- [ ] `Button` renders a native `<button type="button">`; `disabled` uses the native `disabled` attribute (control removed from tab order); `pressed` sets `aria-pressed` and shows a non-colour cue (border change or ✓ marker).
- [ ] `Select` renders a native `<select>` with an associated visible `<label>` (or `aria-label`), styled from theme tokens with a `:focus-visible` ring.
- [ ] `SegmentedControl` renders a single-choice group; the selected option is marked with a non-colour cue (fill + border) and each option has a visible `:focus-visible` ring.
- [ ] `ToggleSwitch` renders a native checkbox (or `role="switch"` button) whose `aria-checked` reflects the state, is togglable with Space/Enter, and shows its state by position plus a text label, not colour alone.
- [ ] `Card` renders a padded themed container with an optional `label-mono` header; `Chip` renders a pill-shaped label whose text is always present and readable.
- [ ] All six components consume theme tokens from `src/index.css` — no inline hex.
- [ ] All six components set text through the typography tokens; their fonts come from the `--font-*` tokens in `src/index.css`, never a literal `font-family`.
- [ ] Test: each component renders its expected native element/role and state semantics (focus ring, `aria-pressed`, `aria-checked`, disabled not in tab order).

#### Not this story
- Wiring shared components into the Explore screen (stories-7c, 7d, 7e).
- Theme token values themselves (story-7a).

#### Notes
Depends on: story-7a (tokens). Shared primitives live in `src/components/shared/`; feature components must compose them, never re-style or re-implement them.

#### Implementation Reference
- **Build:** `src/components/shared/Button.tsx`, `Select.tsx`, `SegmentedControl.tsx`, `ToggleSwitch.tsx`, `Card.tsx`, `Chip.tsx` (+ one CSS file per component, or a shared `shared.css`); files named after their default export
- **Props (Button):** `variant: 'primary' | 'ghost'`, `disabled?: boolean`, `pressed?: boolean`, standard button props (`onClick`, `children`, `aria-label`)
- **Design:** `design-brief.md §Shared Button`, `§Shared Select`, `§Shared SegmentedControl`, `§Shared ToggleSwitch`, `§Shared Card`, `§Shared Chip` — exact tokens, radii, sizes
- **Rules:** `project-rules.md §Components` (shared `Button` through `Chip` contracts; extraction threshold; never a div/span with a click handler); `§Naming` (file matches default export); `§Accessibility` (keyboard-operable, visible `:focus-visible`)
- **A11y:** `:focus-visible` ring on every control; `aria-pressed`/`aria-checked` where stateful; non-colour state cues
- **Do not:** inline hex values; render buttons as `div`/`span`; add components not in the shared list
