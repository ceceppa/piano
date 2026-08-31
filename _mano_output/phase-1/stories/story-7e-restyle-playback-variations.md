### STORY-7e: Restyle playback bar and variation panel

#### What and why
The playback bar and variation panel are the "hear it" and "see variations" payoff of the Explore screen. Restyling them to the design tokens and shared components completes the visual pass, and this story owns the end-to-end look-and-feel acceptance check across the whole screen.

#### Done when
- [ ] Playback bar shows a primary round play action plus ghost actions for chord/arpeggio/scale and a text status label (READY / PLAYING…); status is conveyed by text, not colour alone.
- [ ] Variation panel rows live inside a `Card`; each row shows the variation label in `notation-lg` with a genre-guidance `Chip`; the selected row uses the surface-high tint plus a secondary left border (non-colour cue).
- [ ] The whole Explore screen renders in the light palette with the OS in light mode and the dark palette in dark mode; every visible colour comes from a `src/index.css` token (no inline hex in component CSS).
- [ ] Toggling the theme switch re-colours the entire screen immediately with no reload.
- [ ] Test: selecting a variation updates the store's quality and the keyboard highlights; theme switch flips `data-theme` end-to-end.

#### Not this story
- Restyling the keyboard band itself (story-7d).
- Restyling header/controls (story-7c).
- Any interaction/semantics change to playback or variation selection (wiring stays as implemented in the original phase).

#### Notes
Depends on: story-7a (tokens), story-7b (shared components), story-7d (keyboard restyle). This is the terminal restyle story; it closes the loop on the whole-screen token migration that story-7a started.

## Changes

- Variation list semantics: the panel now lists all catalogue qualities for the root (including the current one), with the current quality rendered as the selected row (surface-high tint + secondary left border, `aria-pressed`). Previously the current quality was excluded from the list, which made the design brief's "currently selected variation" state unreachable. Approved via clarification during story-7e implementation; updated the variation-panel tests accordingly.

#### Implementation Reference
- **Build:** update `src/components/PlaybackBar.tsx` + CSS, `src/components/VariationPanel.tsx` + CSS using shared `Button`, `Card`, `Chip`
- **Design:** `design-brief.md §Shared Button` (round primary play, ghost actions), `§Shared Card`, `§Shared Chip`, `§Variation panel`, `§PlaybackBar`; `### phase-1 — Explore` composition for the completed screen
- **Rules:** `project-rules.md §Components`, `§Patterns — Audio` (audio calls unchanged), `§Accessibility` (text status, non-colour selected cue)
- **Do not:** inline hex in CSS; rework playback/variation logic; change a11y labels already covered by existing tests; literal `font-family` in CSS (use `var(--font-*)` from story-7a)
