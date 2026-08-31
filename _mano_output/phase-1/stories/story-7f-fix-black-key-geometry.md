### STORY-7f: Fix black-key geometry

#### What and why
The sharps are a beginner's pitch reference on the keyboard, but after the story-7d restyle they render at the wrong width (56% of the whole band) and sit horizontally offset so a sharp's edge lines up with a white key's edge instead of straddling the seam between its two neighbouring white keys. The keyboard must read like a real piano so the pitch-to-position mapping stays instantly legible.

#### Done when
- [ ] Every black (sharp/flat) key sits horizontally between its two adjacent white keys: it visibly overhangs both white keys instead of ending flush at the edge of one, and this holds at every preset octave range.
- [ ] Black keys render at a realistic width — a fraction of a single white key's width — not 56% of the full keyboard band, and every black key shares the same width and seam-centering relationship.
- [ ] Test: for a range covering C3–B4, each black key's horizontal midpoint falls between the two white keys it separates (within a small tolerance), and black-key width is smaller than one white key's width.

#### Not this story
- Changing keyboard interaction semantics (pointer/keydown handling stays as implemented and tested).
- Changing black-key height (design brief fixes it at 55% of white).
- Re-styling markers, highlights, or anything else from story-7d.

#### Notes
User-reported bug found after story-7d. Depends on: story-7d (keyboard restyle). The `width` value for a black key is not defined by the design brief (it owns height only), so the implementing agent should treat the inferred standard piano ratio below as provisional until the width is owned by the design brief.

#### Implementation Reference
- **Build:** `src/components/Keyboard.tsx` (`blackLeft`, ~line 61) + `src/components/Keyboard.css` (`.key-black`, ~line 66); the black-key layer is absolutely positioned over the band, so `width: 56%` resolves against the whole band instead of one white-key slot
- **Geometry:** `blackLeft` currently sets the black key's left edge at the centre of the left white key (`(idx + 0.5) / whiteCount`); the fix is to translate the key by 50% of its own width so its centre sits over the seam between the two white keys
- **Design:** `design-brief.md §Piano Keyboard (hero)` — black-key height 55% of white; width not defined there
- **Do not:** inline hex; literal `font-family`; change pointer/keyboard interaction handlers; alter the `--color-key-*` tokens

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
