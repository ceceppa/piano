### STORY-7c: Restyle header and controls

#### What and why
The Explore screen's chrome — header, root, quality, key/mode, scale-follow, view-mode, and octave-range controls — is the beginner's first impression and the clearest place to apply the shared components. The legacy page does this with four bare buttons, ad-hoc selects, and a show-note-names checkbox.

#### Done when
- [ ] Header shows the app title in the design's headline style, the current chord name in `notation-lg`, and a `ToggleSwitch` that flips the theme; toggling it re-colours the whole page immediately (system preference default retained).
- [ ] Root note is a `SegmentedControl` over the 12 chromatic root labels; selecting a root updates the selection with no apply step.
- [ ] Quality is a `Select` over the catalogue qualities; selecting it updates the chord/scale/notes immediately.
- [ ] Key/mode controls remain collapsed behind the "Advanced" toggle; expanding reveals a key-root `Select` and a mode `Select`.
- [ ] Scale-follow is a `SegmentedControl`; view mode is a `SegmentedControl` (chord / scale / both) bound to the store's existing `viewMode`.
- [ ] Octave range is a `Select` over the default range presets; changing it re-ranges the keyboard.
- [ ] Test: selecting a root/quality via the new controls updates the store and the keyboard highlights; theme switch flips `data-theme`.

#### Not this story
- Restyling the keyboard band itself (story-7d).
- Restyling playback bar and variation panel (story-7e).
- Genre selector rendering (falls out of story-7e's variation rows; any genre `Select` stays wired to the store's `genre`).

#### Notes
Depends on: story-7a (tokens), story-7b (shared components). Replaces the current `RootSelector`/`QualitySelector`/`KeyModeSelector`/`ScaleFollow` UI but must keep the existing "immediate update" store wiring intact.

#### Implementation Reference
- **Build:** restyle `src/App.tsx` and its control components using shared `Button`, `Select`, `SegmentedControl`, `ToggleSwitch`; collapse advanced key/mode behind the existing toggle pattern
- **State:** `theme`/`setTheme`, `viewMode`, `octaveStart`/`octaveEnd` from `useSelectionStore.ts` (already present; wire `viewMode` into a control for the first time)
- **Design:** `design-brief.md §Typography` (headline, `notation-lg`, `label-mono`, `body`), `§Spacing & shape`, `§Shared Select/SegmentedControl/ToggleSwitch`, `### phase-1 — Explore` screen composition
- **Rules:** `project-rules.md §Patterns — State Management` (selection/view state in the store; no local component state for selection), `§Patterns — Theme`, `§Accessibility`
- **Do not:** introduce an apply/save button; leave the show-note-names checkbox in place unless the design keeps it — if it is dropped, that is a visual decision for the design-brief, so keep the control but restyle it as a `ToggleSwitch`; no literal `font-family` in component CSS (use `var(--font-*)` from story-7a)
