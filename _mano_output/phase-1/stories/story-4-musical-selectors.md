### STORY-4: Musical context selectors

#### What and why
The Explore screen starts from a raw selection — root, quality, and optional key/mode. A beginner must be able to change these controls and see the store update immediately; this is the interaction device that drives everything else on the screen.

#### Done when
- A root-note control offers all 12 pitch classes (C through B with sharps) and sets the store root on change.
- A chord-quality control offers the common catalogue (major, minor, diminished, augmented, sus2, sus4, 6, 7, maj7, m7, 9, add9) and sets the store quality.
- Test: changing root or quality via a selector updates the store and re-renders the keyboard highlight set immediately.
- An Advanced control exposes a key/mode selector (root + major/natural-minor) without cluttering the default view.
- Genre selection exists as a selector but has no effect on this phase's rendering beyond storing the value (optional field).
- The scale-follow choice (chord-root vs key) updates the store's `scaleMode`.

#### Not this story
- Playing sound or updating audio when selectors change.
- Progression context modes ("in the key of" / "include anywhere"), variation panel, inversions.

#### Notes
The scale rule (chord-root default, key override) is defined in the phase brief; `scaleMode` already exists in the store from `story-2`. This story only wires the visible controls to it. Genre is stored for later phases; it must not change Explore rendering yet.

#### Implementation Reference
- **Build:** root selector, quality selector, advanced key/mode control, scale-follow toggle — components writing `useSelectionStore`
- **Contract:** `scaleMode: 'chord-root'|'key'` and `key: {root, scaleType}` per `tech-spec.md §Data model`; qualities/scaleTypes via `musicCore`
- **A11y:** controls keyboard-accessible with visible focus (`project-rules.md §Accessibility`)
- **Rules:** Components (store-backed, no model logic); State Management
- **Do not:** implement progression-context modes; make genre alter rendering this phase; move pitch logic into components (use musicCore)

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->