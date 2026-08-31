### STORY-7: Chord variation panel

#### What and why
Beyond the base quality, the beginner sees contextually useful variations of the same root (e.g. A7, Amaj7, A9, Asus2, Asus4, Aadd9) with honest guidance about which genres use them. Selecting a variation must update the keyboard and playback immediately — variations are a discovery surface, not a separate screen.

#### Done when
- The panel lists contextually useful variations of the selected root (the common catalogue, e.g. A6, A7, Amaj7, A9, Asus2, Asus4, Aadd9).
- Each variation is labelled with genre relevance as guidance (e.g. "Common in Blues", "Popular Jazz variations"), never as an objective claim.
- Selecting a variation updates the keyboard, store selection, and playback immediately (same interaction, no reload).
- Test: selecting a variation changes the current quality and the keyboard highlight set accordingly.
- Test: the genre-guidance labels are per-variation static labels from `musicCore`, not derived from a selected genre.
- Playback targets the newly selected variation without a separate confirmation step.

#### Not this story
- Inversions, voicings (left/right hand), or open voicings — separate later phase.
- Progression suggestions or any "what comes next" logic.
- A genre filter that actually changes the variation list.

#### Notes
Genre relevance as guidance (labelled, not objective) is a product rule from the phase brief (§6.3) and `musicCore`'s catalogue the canonical home of the label set. The variation replaces the current quality in the selection; the base root stays fixed.

#### Implementation Reference
- **Build:** variation list component reading `musicCore.variationsFor(root, currentQuality)` and the genre-guidance labels from the `ChordQuality` catalogue
- **UI:** variation cards/buttons update `useSelectionStore.quality`; playback via `audioEngine` on change
- **Contract:** `variationsFor(root, currentQuality)` exact signature in `tech-spec.md §Public / integration interface contracts`; genre guidance labels defined in `tech-spec.md §Data model` (`genreGuide`)
- **A11y:** each variation control keyboard-accessible with visible focus; selection state shown non-colour (`project-rules.md §Accessibility`)
- **Rules:** Components — store-backed, no domain math inline; Naming — catalogue ids, sharp spellings
- **Do not:** derive labels from a selected genre; implement inversions or voicings; open a separate screen

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->