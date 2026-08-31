### STORY-2: Selection store and default state

#### What and why
Every visible element on Explore — keyboard, variation list, playback targets — reacts to one shared selection. A beginner who lands on the app must see a useful default (C major) immediately, so the store must exist with sensible defaults before any surface reads it.

#### Done when
- The store initialises with root `C`, quality `major`, key context `C major`, scaleMode `chord-root`, and viewMode `both`.
- Test: reading `useSelectionStore` returns the C-major default above with no interaction required.
- Test: an action that sets a new root/quality updates the store, and a component reading it re-renders with the new selection.
- The store exposes update actions for root, quality, key root/scaleType, scaleMode, viewMode, and octaveRange.
- Test: octaveRange defaults to the 2-octave C3–B4 range (48–71).

#### Not this story
- Any keyboard visualisation, selectors, audio, or playback.
- Persistence of the selection across restarts (local data is a later phase).

#### Notes
The store shape and defaults are defined canonically in `tech-spec.md §Data model`; this story implements that contract. Nothing else in Phase 1 decides the default selection or store shape.

#### Implementation Reference
- **Build:** `useSelectionStore` store module holding `Selection` (`root`, `quality`, `key`, `scaleMode`, `viewMode`) and `DisplayRange` defaults — per `tech-spec.md §Data model`
- **State:** all selection/view state in the store; held-key interplay is local to components (`project-rules.md §Patterns — State Management`)
- **Contract:** default `48–71` octave range from `tech-spec.md §Data model`
- **Rules:** Testing — integration test that a component re-renders on store change (`project-rules.md §Testing`)
- **Do not:** persist the selection (no favourites/storage this phase); compute intervals in the store (use `musicCore`)

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->